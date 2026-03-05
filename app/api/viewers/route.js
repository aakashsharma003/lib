import { Redis } from "@upstash/redis";

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { videoId, userId, action } = body;

        if (!videoId || !userId) {
            return Response.json({ count: 1 }, { status: 400 });
        }

        const setKey = `live_viewers:${videoId}`;

        // Handle "leave" action (used by sendBeacon on page unload)
        if (action === "leave") {
            await redis.srem(setKey, userId);
            await redis.del(`heartbeat:${videoId}:${userId}`);
            const count = await redis.scard(setKey);
            return Response.json({ count, success: true });
        }

        // Default: "join" action — add user to viewer set
        await redis.sadd(setKey, userId);
        await redis.set(`heartbeat:${videoId}:${userId}`, "1", { ex: 35 });
        await redis.expire(setKey, 86400);
        const count = await redis.scard(setKey);

        return Response.json({ count });
    } catch (error) {
        console.error("Redis Viewer Error:", error);
        return Response.json({ count: 1 }, { status: 500 });
    }
}
