"use server";
import { getYoutubeTranscript } from "@/app/utils/transcript";
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("videoId");

  if (!videoId) {
    return NextResponse.json(
      { error: "Video ID is required" },
      { status: 400 }
    );
  }

  try {
    // Cache transcript per video (6 hours) — transcripts are static
    const getCachedTranscript = unstable_cache(
      async () => await getYoutubeTranscript(videoId),
      [`transcript-${videoId}`],
      { revalidate: 21600 } // 6 hours
    );

    const transcript = await getCachedTranscript();
    return NextResponse.json(transcript, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transcript" },
      { status: 500 }
    );
  }
}
