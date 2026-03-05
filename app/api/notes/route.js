import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";

const getCachedNotes = unstable_cache(
    async (videoId) => {
        const notes = await prisma.post.findMany({
            where: {
                category: "NOTES",
                del_status: false,
                video: {
                    videoUrl: videoId
                }
            },
            include: {
                user: {
                    select: {
                        firstname: true,
                        lastname: true,
                        profile_pic: true
                    }
                }
            },
            take: 5,
            orderBy: {
                created_at: 'desc'
            }
        });

        // Map Prisma model to frontend expected format
        return notes.map(note => ({
            id: note.post_id,
            author: `${note.user?.firstname || 'Unknown'} ${note.user?.lastname || ''}`.trim(),
            publication: "Community Notes",
            title: note.title,
            subtitle: note.content || "Click to view full note details.",
            date: new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            upvotes: 0, // Mock upvotes until DB supports them natively
            comments: 0,
            attachment: note.attach_file,
            tags: note.tags || []
        }));
    },
    ['notes-query'],
    { revalidate: 86400, tags: ['notes'] } // Global tag and dynamic tags are added per-call below in next15
);

export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let user = await prisma.user.findUnique({
            where: { clerkId: userId }
        });

        if (!user) {
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(userId);
            const email = clerkUser.emailAddresses[0]?.emailAddress || "no-email@example.com";
            const firstname = clerkUser.firstName || "User";
            const lastname = clerkUser.lastName || "";

            user = await prisma.user.create({
                data: {
                    clerkId: userId,
                    email,
                    firstname,
                    lastname
                }
            });
        }

        const formData = await req.formData();
        const title = formData.get("title");
        const content = formData.get("content");
        const videoId = formData.get("videoId");
        const attachmentType = formData.get("attachmentType");
        let driveLink = formData.get("driveLink");
        const file = formData.get("file");

        // File upload is now handled separately by the client prior to this API call.
        if (attachmentType === "upload" && file && file !== "null" && !driveLink) {
            return NextResponse.json({ error: "Wait for the file to upload to Google Drive first" }, { status: 400 });
        }

        // Upsert video
        let video = await prisma.video.findUnique({
            where: { videoUrl: videoId },
        });

        if (!video) {
            // If title wasn't fetched, just put placeholder.
            video = await prisma.video.create({
                data: {
                    videoUrl: videoId,
                    title: `Video ${videoId}`,
                },
            });
        }

        const post = await prisma.post.create({
            data: {
                user_id: user.user_id,
                video_id: video.video_id,
                title,
                content,
                attach_file: driveLink,
                category: "NOTES",
            },
        });

        // Invalidate the cache for this specific video
        revalidateTag(`notes-${videoId}`);

        return NextResponse.json({ success: true, post, noteId: post.post_id });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get('videoId');
        const limit = searchParams.get('limit');

        if (!videoId) {
            return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
        }

        // Use cached version for "all" notes too (1 hour TTL)
        if (limit === 'all') {
            const getCachedAllNotes = unstable_cache(
                async () => {
                    const notes = await prisma.post.findMany({
                        where: {
                            category: "NOTES",
                            del_status: false,
                            video: {
                                videoUrl: videoId
                            }
                        },
                        include: {
                            user: {
                                select: {
                                    firstname: true,
                                    lastname: true,
                                    profile_pic: true
                                }
                            }
                        },
                        orderBy: {
                            created_at: 'desc'
                        }
                    });

                    return notes.map(note => ({
                        id: note.post_id,
                        author: `${note.user?.firstname || 'Unknown'} ${note.user?.lastname || ''}`.trim(),
                        publication: "Community Notes",
                        title: note.title,
                        subtitle: note.content || "Click to view full note details.",
                        date: new Date(note.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        upvotes: 0,
                        comments: 0,
                        attachment: note.attach_file,
                        tags: note.tags || []
                    }));
                },
                [`all-notes-${videoId}`],
                { revalidate: 3600, tags: [`notes-${videoId}`] }
            );

            const formattedNotes = await getCachedAllNotes();
            return NextResponse.json({ notes: formattedNotes });
        }

        // Use a customized unstable_cache call per video ID to ensure proper tagging
        const getNotesByVideoTag = unstable_cache(
            async () => await getCachedNotes(videoId),
            [`notes-${videoId}`],
            { revalidate: 86400, tags: [`notes-${videoId}`] }
        );

        const formattedNotes = await getNotesByVideoTag();

        return NextResponse.json({ notes: formattedNotes });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
