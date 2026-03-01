'use server';

import { askOpenAI, getEmbedding } from "@/app/utils/openAI";
import { getYoutubeTranscript } from "@/app/utils/transcript";
import { generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY
});

// In-memory cache for document chunks and embeddings so we don't re-embed on every message
const videoStoreCache = globalThis.videoStoreCache || new Map();
if (process.env.NODE_ENV === "development") globalThis.videoStoreCache = videoStoreCache;

// Function to split text into overlapping chunks
function splitIntoChunks(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let i = 0;
    while (i < text.length) {
        chunks.push(text.slice(i, i + chunkSize));
        i += chunkSize - overlap;
    }
    return chunks;
}

// Compute cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Retrieve relevant chunks via Vector Search
async function retrieveContext(videoId, query) {
    console.log(`\n[RAG Pipeline] Initiating context retrieval for videoId: ${videoId}`);
    console.log(`[RAG Pipeline] Query: "${query}"`);
    console.time(`[RAG Pipeline] Total Retrieval Time`);

    // 1. Check if we already chunked and embedded this video's transcript
    let videoData = videoStoreCache.get(videoId);

    if (!videoData || videoData.length === 0) {
        console.log(`[RAG Pipeline] Cache Miss. Fetching transcript from YouTube...`);
        console.time(`[RAG Pipeline] Fetch Transcript`);
        const transcript = await getYoutubeTranscript(videoId);
        console.timeEnd(`[RAG Pipeline] Fetch Transcript`);

        if (!transcript) {
            console.log(`[RAG Pipeline] ERROR: Failed to retrieve transcript.`);
            console.timeEnd(`[RAG Pipeline] Total Retrieval Time`);
            return null;
        }

        // Chunk the transcript
        const chunks = splitIntoChunks(transcript, 1200, 200);
        console.log(`[RAG Pipeline] Partitioned transcript into ${chunks.length} chunks.`);

        // Embed all chunks (sequential MVP)
        const limitedChunks = chunks.slice(0, 50);
        if (chunks.length > 50) {
            console.log(`[RAG Pipeline] Truncating to 50 chunks to satisfy free-tier rate limits.`);
        }

        const embeddedChunks = [];
        console.log(`[RAG Pipeline] Embedding chunks. This may take a moment...`);
        console.time(`[RAG Pipeline] Embedding Chunks`);

        // Process sequentially to avoid Gemini API free-tier rate limits (429 Too Many Requests)
        for (let i = 0; i < limitedChunks.length; i++) {
            try {
                const chunk = limitedChunks[i];
                const vector = await getEmbedding(chunk);

                if (vector) {
                    embeddedChunks.push({
                        text: chunk,
                        vector: vector
                    });
                }

                // Small synthetic delay to satisfy rate limit tokens per minute
                await new Promise(resolve => setTimeout(resolve, 300));

            } catch (err) {
                console.error("[RAG Pipeline] Failed to embed chunk", i, err);
            }
        }
        console.timeEnd(`[RAG Pipeline] Embedding Chunks`);
        console.log(`[RAG Pipeline] Successfully embedded ${embeddedChunks.length} chunks.`);

        videoData = embeddedChunks;
        videoStoreCache.set(videoId, videoData);
        console.log(`[RAG Pipeline] Stored embeddings in server cache.`);
    } else {
        console.log(`[RAG Pipeline] Cache Hit! Retrieved ${videoData.length} chunks from memory.`);
    }

    if (videoData.length === 0) return null;

    // 2. Embed the User's Query
    console.time(`[RAG Pipeline] Embed Query`);
    const queryEmbedding = await getEmbedding(query);
    console.timeEnd(`[RAG Pipeline] Embed Query`);

    if (!queryEmbedding) {
        console.log(`[RAG Pipeline] ERROR: Failed to embed user query.`);
        return null;
    }

    // 3. Compute Cosine Similarity and find top K chunks
    console.time(`[RAG Pipeline] Cosine Similarity Search`);
    const scoredChunks = videoData.map(chunk => ({
        text: chunk.text,
        score: cosineSimilarity(queryEmbedding, chunk.vector)
    }));

    // Sort descending by score
    scoredChunks.sort((a, b) => b.score - a.score);

    // Take top 3 chunks
    const topChunks = scoredChunks.slice(0, 3);
    console.timeEnd(`[RAG Pipeline] Cosine Similarity Search`);

    console.log(`[RAG Pipeline] Top 3 chunks retrieved. Top score: ${topChunks[0]?.score.toFixed(4) || 0}`);
    console.timeEnd(`[RAG Pipeline] Total Retrieval Time`);

    return topChunks.map(c => c.text).join("\n\n---\n\n");
}

export async function chatWithVideo(videoId, history, newMessage) {
    try {
        console.log(`\n========================================`);
        console.log(`[Video Chat Action] Incoming request`);
        console.time(`[Video Chat Action] Total Request Time`);

        // Fetch the perfectly retrieved chunks using RAG instead of the whole transcript
        const relevantContext = await retrieveContext(videoId, newMessage);

        if (relevantContext === null) {
            console.log(`[Video Chat Action] ERROR: Context retrieval failed. Bypassing Gemini API call.`);
            console.timeEnd(`[Video Chat Action] Total Request Time`);
            console.log(`========================================\n`);
            return "I'm sorry, I couldn't access this video's content. The instructor might not have enabled closed captions, or the video might be restricted.";
        }

        console.log(`[Video Chat Action] Calling Gemini Generation API with context...`);
        console.time(`[Video Chat Action] Gemini LLM Generation`);
        let prompt = `You are a helpful educational AI assistant answering a user's question about a specific video.
Here is the most relevant retrieved transcript context to answer the question:
"""
${relevantContext}
"""

Here is the conversation history:
${history.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n')}

User's new question: ${newMessage}

Answer the user's question directly, clearly, and concisely based ONLY on the retrieved context above. If the answer is not in the context, mention that you can only answer based on the video context. Do not use markdown headers or bolding excessively, keep it conversational.`;

        const { text: response } = await generateText({
            model: google('gemini-3-flash-preview'),
            prompt: prompt
        });
        console.timeEnd(`[Video Chat Action] Gemini LLM Generation`);

        if (!response) {
            console.log(`[Video Chat Action] ERROR: Gemini returned empty response.`);
            return "I'm sorry, I couldn't generate a response at this moment. Please try again.";
        }

        console.log(`[Video Chat Action] Response successfully generated.`);
        console.timeEnd(`[Video Chat Action] Total Request Time`);
        console.log(`========================================\n`);

        return response;
    } catch (error) {
        console.error("[Video Chat Action] Critical Error:", error);
        return "I encountered an error while trying to answer your question. Please ensure the video has English closed captions enabled.";
    }
}
