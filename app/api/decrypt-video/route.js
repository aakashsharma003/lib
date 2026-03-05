import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// Cache the secure video ID lookup — this mapping never changes
const getCachedVideoId = unstable_cache(
    async (encryptedId) => {
        const record = await prisma.secureVideo.findUnique({
            where: { encryptedId }
        });
        return record?.videoId || null;
    },
    ['decrypt-video'],
    { revalidate: 604800 } // 7 days — these mappings never change
);

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const encryptedId = searchParams.get("id");

        if (!encryptedId) {
            return Response.json({ error: "Missing id" }, { status: 400 });
        }

        const videoId = await getCachedVideoId(encryptedId);

        if (!videoId) {
            return Response.json({ error: "Invalid or expired video link" }, { status: 404 });
        }

        return Response.json({ videoId }, {
            headers: {
                'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
            }
        });
    } catch (error) {
        console.error("Decrypt video error:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
