import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function askOpenAI(prompt) {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
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
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "HELLO" }],
      },
      {
        role: "model",
        parts: [{ text: "Hello there! How can I assist you today?" }],
      },
    ],
  });

  try {
    const result = await chat.sendMessage(prompt);
    // console.log("response", result?.response?.candidates[0]);
    const rawText = result?.response?.candidates[0]?.content?.parts[0]?.text;
    // const formattedTextWithBr = rawText.replace(/\n/g, "<br>");
    // console.log("rawtext", rawText);
    return rawText;

    // return formattedTextWithBr;
  } catch (error) {
    console.error("error occured at gemini",error)
    return "Please try again later, as our server is currently busy."
  }
  
}
