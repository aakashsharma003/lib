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
  try{
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
     console.log("transcript", transcript);
    return formatTranscript(transcript);
  }
  catch(err){
   console.log("error occured at transcript", err);
   return "Hey there i am akash sharma from mbm university a passionate open source contributer from india!";
  }
}
