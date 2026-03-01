'use server';

import crypto from 'crypto';
import prisma from '@/lib/prisma';

const SECRET_KEY = process.env.ENCRYPTION_KEY || 'ideahub_secure_key_12345678901234';

// Generate a deterministic, mathematically secure 11-char signature 
// to perfectly mimick YouTube URL structures
function generateSignature(videoId) {
    const hash = crypto.createHmac('sha256', SECRET_KEY).update(videoId).digest('base64url');
    // Return exactly 11 characters
    return hash.substring(0, 11);
}

export async function createSecureVideoLink(videoId) {
    try {
        const encryptedId = generateSignature(videoId);

        // Check if we've already generated a secure link for this video to prevent DB bloating
        const existing = await prisma.secureVideo.findFirst({
            where: { videoId }
        });

        if (existing) {
            if (existing.encryptedId !== encryptedId) {
                // Algorithm migrated (e.g. from AES to HMAC). Overwrite the database.
                await prisma.secureVideo.update({
                    where: { encryptedId: existing.encryptedId },
                    data: { encryptedId }
                });
            }
            return encryptedId;
        }

        // Store the anti-injection entry in DB
        await prisma.secureVideo.create({
            data: {
                videoId,
                encryptedId
            }
        });

        return encryptedId;
    } catch (error) {
        console.error("Encryption Error:", error);
        return null;
    }
}

export async function verifySecureVideoLink(encryptedId) {
    try {
        if (!encryptedId) return null;

        // 1. Verify it exists in the Database (Anti-Injection layer)
        const record = await prisma.secureVideo.findUnique({
            where: { encryptedId }
        });

        if (!record) {
            console.log(`[Security] Blocked unverified URL injection attempt: ${encryptedId}`);
            return null;
        }

        // 2. Mathematically Verify constraint via Secret Key
        const expectedSignature = generateSignature(record.videoId);

        // 3. Cryptographic confirmation matches DB
        if (expectedSignature !== encryptedId) {
            return null; // Forged or manipulated
        }

        return record.videoId; // Returns the actual YouTube videoId
    } catch (error) {
        console.error("Signature verification failed. Invalid or manipulated token.", error);
        return null;
    }
}
