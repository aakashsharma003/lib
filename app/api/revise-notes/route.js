import { NextResponse } from "next/server";
import { askOpenAI } from "@/app/utils/openAI";
export async function POST(req) {
  try {
    const { videoId, transcript } = await req.json();

    if (!videoId || !transcript) {
      return NextResponse.json(
        { error: "Missing videoId or transcript" },
        { status: 400 }
      );
    }

    if (transcript.length > 0) console.log("we got the transcript");

    const prompt = `Generate a concise set of quick revision notes based on the following transcript. Return the result as a JSON array of objects.

Each object should have the following structure:

{
  "heading": "The main heading of the topic",
  "topic": "The specific topic under the heading",
  "subtopic": "The subtopic under the topic (can be null if not applicable)",
  "content": "A concise and well-structured markdown-supported summary of the subtopic"
}

If the transcript is missing or empty, return a single object formatted as follows:

"{
  "heading": "Error",
  "topic": "Missing Transcript",
  "subtopic": null,
  "content": "Our server is busy. Please try again after some time!"
}

Here is the video transcript:
[${transcript}]
`;

    const answer = await askOpenAI(prompt);
    let parsedAnswer;

    try {
      // Attempt to parse the answer as JSON
      parsedAnswer = JSON.parse(answer);

      // Ensure the parsed answer is an array
      if (!Array.isArray(parsedAnswer)) {
        throw new Error("Parsed answer is not an array");
      }
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      console.log("Raw OpenAI response:", answer);
      parsedAnswer = [
        {
          heading: "Error",
          topic: "Parsing Error",
          subtopic: null,
          content:
            "There was an error processing the response. Please try again.",
        },
      ];
    }

    const formattedAnswer = parsedAnswer.map((item) => ({
      heading: item.heading || "No Heading",
      topic: item.topic || "No Topic",
      subtopic: item.subtopic || null,
      content: item.content || "No Content",
    }));

    console.log("Formatted answer:", formattedAnswer);

    return NextResponse.json(formattedAnswer);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      [
        {
          heading: "Error",
          topic: "Server Error",
          subtopic: null,
          content: "An internal server error occurred. Please try again later.",
        },
      ],
      { status: 500 }
    );
  }
}
