import { fetchTranscript } from "youtube-transcript";

export default async function handler(req, res) {
  const { videoId } = req.query; // videoId is passed as query param

  if (!videoId) {
    return res.status(400).json({ error: "Video ID is required" });
  }

  try {
    // Fetch transcript using youtube-transcript
    const transcript = await fetchTranscript(videoId);

    // Respond with the transcript data
    res.status(200).json(transcript);
  } catch (error) {
    console.error("Error fetching transcript:", error);
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
}
