"use server";
import { NextResponse } from "next/server";

import { askOpenAI } from "@/app/utils/openAI";
export async function POST(req) {
  try {
    const { videoId, transcript } = await req.json();

    if (!videoId || !transcript) {
      return NextResponse.json(
        { error: "Missing videoId or question" },
        { status: 400 }
      );
    }

    // const transcript = await getYoutubeTranscript(videoId);
    if (transcript.length > 0) console.log("we got the transcript");
    const prompt = `give me a concise set of quick revision notes in the form of an array of objects from the given transcript. Each object should have the following structure:

heading: The main heading of the topic.
topic: The specific topic under the heading.
subtopic: The subtopic under the topic (optional, can be null if not applicable).
content: A concise and well-structured markdown-supported summary of the subtopic.
Ensure the content uses proper Markdown syntax for headings, lists, and emphasis to make it easy to display on a markdown-supported platform. Avoid overly detailed explanations; just give me an array or araay of single object with empty content.
Here is the video content:
[${transcript}]
`;
    const answer = await askOpenAI(prompt);
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
