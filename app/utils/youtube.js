import { YoutubeTranscript } from "youtube-transcript";

function formatTranscript(transcript) {
  return transcript.map((entry) => entry.text).join("\n");
}
export async function getYoutubeTranscript(videoId) {
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  return formatTranscript(transcript);
}
