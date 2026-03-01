import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-3-flash-preview";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function askOpenAI(prompt) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2, // Lower temperature for more deterministic filtering
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error Response:", response.status, errorData);
      throw new Error(`Gemini API returned status: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    return rawText;
  } catch (error) {
    console.error("error occured at gemini directly", error);
    return null; // Return null so the calling function can handle the failure gracefully
  }
}



export async function getEmbedding(text) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.NEXT_PUBLIC_GEMINI_API_KEY,
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
    console.error("Embedding API Error via Vercel AI SDK:", err.message);
    return null;
  }
}
