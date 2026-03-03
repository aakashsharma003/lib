import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
    try {
        const { videoId, userId } = await req.json();

        if (!videoId || !userId) {
            return Response.json({ count: 1 }, { status: 400 });
        }

        const setKey = `live_viewers:${videoId}`;

        // 1. Add user to the video's viewer Set (SADD deduplicates automatically)
        await redis.sadd(setKey, userId);

        // 2. Set a heartbeat key that expires in 35s if not refreshed
        await redis.set(`heartbeat:${videoId}:${userId}`, "1", { ex: 35 });

        // 3. Set TTL on the viewer set itself (auto-cleanup after 24h of inactivity)
        await redis.expire(setKey, 86400);

        // 4. Get total unique viewer count
        const count = await redis.scard(setKey);

        return Response.json({ count });
    } catch (error) {
        console.error("Redis Viewer Error:", error);
        return Response.json({ count: 1 }, { status: 500 });
    }
}
