import { YoutubeTranscript } from "youtube-transcript";
import axios from "axios";
import { cache } from "react";
function formatTranscript(transcript) {
  return transcript.map((entry) => entry.text).join("\n");
}


export const fetchVideos = cache(async (query) => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const apiURL = process.env.NEXT_PUBLIC_YOUTUBE_API_URL;

  try {
    const response = await axios.get(`${apiURL}/search`, {
      params: {
        part: "snippet",
        key: apiKey,
        type: "video",
        q: query,
        maxResults: 10,
      },
    });

    return response.data.items || [];
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return [];
  }
});
export async function getYoutubeTranscript(videoId) {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  return formatTranscript(transcript);
}
