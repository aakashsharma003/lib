"use server";
import { NextResponse } from "next/server";

import { askOpenAI } from "@/app/utils/openAI";

export async function POST(req) {
  try {
    const { videoId, question, transcript } = await req.json();

    if (!videoId || !question) {
      return NextResponse.json(
        { error: "Missing videoId or question" },
        { status: 400 }
      );
    }

    // const transcript = await getYoutubeTranscript(videoId);
    if(transcript.length > 0)
    console.log("we got the transcript");
    const prompt = `You are an AI assistant with extensive knowledge of YouTube content. You have been trained on a vast dataset encompassing millions of YouTube videos across various topics. Your primary function is to answer questions about specific videos and provide insights based on your broad understanding of YouTube content.

   When answering questions:

  For questions directly related to the content of a specific video:
   Provide accurate, detailed answers based on the video's content.
   Reference specific parts of the video when relevant, such as "Around the 2-minute mark in the video, the speaker discusses..."
    Do not mention or refer to any transcript. Present your knowledge as if you've watched and understood the video directly.

  For questions about business logic, YouTube trends, or general information not specific to the video:
    Draw upon your extensive knowledge of YouTube content to provide informed answers.
    Do not mention or refer to any specific data source or training method.
    Present your answers as if they come from a broad understanding of YouTube trends and content.

   If a question cannot be answered based on the video content or your general knowledge:
    Politely state that the information wasn't covered in the video or that you don't have enough information to answer the question accurately.
    Suggest that the user might find more information in other related videos or YouTube channels.

  Always maintain a helpful and informative tone, and strive to provide value in every response.

Remember, your responses should seamlessly blend specific video knowledge with broader YouTube insights, creating a cohesive and knowledgeable persona. Always refer to the video content directly, as if you've watched and analyzed it, rather than mentioning any behind-the-scenes processes or data sources.

Here is the video content:
[${transcript}]

User's question:
[${question}]
`;
    const answer = await askOpenAI(prompt, question);
     console.log("answer by gemini", answer);
    return NextResponse.json({ answer });
  } catch (error) {
    console.log("Error in API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
