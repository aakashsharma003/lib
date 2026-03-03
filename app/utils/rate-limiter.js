import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// ─── Redis Client (singleton) ─────────────────────────────────────────────────
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// ─── Rate Limiters ────────────────────────────────────────────────────────────
// Groq: queue after 10 requests per minute
const groqLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    analytics: true,
    prefix: 'ratelimit:groq',
});

// Gemini Embedding free-tier: 1500 RPD (~25/min safe target)
const geminiEmbeddingLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '60 s'), // 20/min to avoid 429s
    analytics: true,
    prefix: 'ratelimit:gemini-embedding',
});

// Transcript API: protect external Kome.ai / yt-dlp endpoints
const transcriptLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '60 s'),
    analytics: true,
    prefix: 'ratelimit:transcript',
});

// ─── Map of named limiters ────────────────────────────────────────────────────
const limiters = {
    groq: groqLimiter,
    'gemini-embedding': geminiEmbeddingLimiter,
    transcript: transcriptLimiter,
};

/**
 * Check if the request is within rate limits.
 * @param {'groq' | 'gemini-embedding' | 'transcript'} limiterName
 * @param {string} [identifier='global'] - Unique key (e.g. userId or IP). Defaults to 'global'.
 * @returns {Promise<{ success: boolean, remaining: number, reset: number }>}
 * @throws {Error} If rate limit is exceeded
 */
export async function checkRateLimit(limiterName, identifier = 'global') {
    const limiter = limiters[limiterName];
    if (!limiter) {
        console.warn(`[RateLimiter] Unknown limiter: ${limiterName}. Skipping.`);
        return { success: true, remaining: -1, reset: 0 };
    }

    try {
        const result = await limiter.limit(identifier);

        if (!result.success) {
            const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
            console.warn(`[RateLimiter] ${limiterName} limit exceeded. Retry after ${retryAfter}s. Remaining: ${result.remaining}`);
            throw new Error(`Rate limit exceeded for ${limiterName}. Please wait ${retryAfter} seconds.`);
        }

        return result;
    } catch (err) {
        // If Redis is down, fail open so we don't block the whole app
        if (!err.message.includes('Rate limit exceeded')) {
            console.error(`[RateLimiter] Redis error for ${limiterName}:`, err.message);
            return { success: true, remaining: -1, reset: 0 };
        }
        throw err;
    }
}
