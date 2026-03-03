import { checkRateLimit } from './rate-limiter';

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

/**
 * Ask Groq LLM a question using their OpenAI-compatible chat completions API.
 */
export async function askOpenAI(prompt) {
  try {
    // Rate limit check: Groq
    await checkRateLimit('groq');

    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          }
        ],
        temperature: 0.2,
        max_tokens: 2048,
        top_p: 1,
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Groq API Error Response:", response.status, errorData);
      throw new Error(`Groq API returned status: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;

    return rawText;
  } catch (error) {
    console.error("error occurred at Groq API", error);
    return null; // Return null so the calling function can handle the failure gracefully
  }
}


/**
 * Generate an embedding using Google Gemini (Groq does not support embeddings).
 * Rate-limited to protect free-tier quotas.
 */
export async function getEmbedding(text) {
  try {
    // Rate limit check: Gemini Embedding
    await checkRateLimit('gemini-embedding');

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: {
          parts: [{ text }]
        }
      })
    });

    if (!response.ok) {
      console.error("Embedding API REST Error:", response.status);
      return null;
    }

    const data = await response.json();
    return data?.embedding?.values || null;
  } catch (err) {
    console.error("Embedding API Error:", err.message);
    return null;
  }
}
