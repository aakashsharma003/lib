import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function POST(req, { params }) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Wait for dynamic parameters in Next.js 15
        const p = await params;
        const noteId = parseInt(p.id, 10);

        if (isNaN(noteId)) {
            return NextResponse.json({ error: "Invalid Note ID" }, { status: 400 });
        }

        const body = await req.json();
        const { tags } = body;

        if (!Array.isArray(tags)) {
            return NextResponse.json({ error: "Tags must be an array" }, { status: 400 });
        }

        // Verify the user owns the note
        const note = await prisma.post.findUnique({
            where: { post_id: noteId },
            include: { user: true, video: true }
        });

        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }

        if (note.user.clerkId !== userId) {
            return NextResponse.json({ error: "Unauthorized: You can only edit your own notes" }, { status: 403 });
        }

        // Update the tags
        const updatedNote = await prisma.post.update({
            where: { post_id: noteId },
            data: { tags },
        });

        // Revalidate cache for this video's notes
        if (note.video && note.video.videoUrl) {
            revalidateTag(`notes-${note.video.videoUrl}`);
        }
        revalidateTag('notes');

        return NextResponse.json({ success: true, tags: updatedNote.tags });
    } catch (error) {
        console.error("Error updating tags:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
