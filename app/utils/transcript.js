import { YoutubeTranscript } from "youtube-transcript";
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function getYoutubeTranscript(videoId) {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        // Extract the text and join them together
        const text = transcript.map(t => t.text).join(" ");
        if (!text || !text.trim()) {
            throw new Error("youtube-transcript returned an empty array.");
        }
        return text;
    } catch (err) {
        console.log(`[YoutubeTranscript] Primary method failed for ${videoId}: ${err.message}. Attempting Kome.ai fallback...`);

        try {
            const response = await fetch('https://kome.ai/api/transcript', {
                method: 'POST',
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'content-type': 'application/json',
                    'origin': 'https://kome.ai',
                    'referer': 'https://kome.ai/tools/youtube-transcript-generator',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15'
                },
                body: JSON.stringify({
                    video_id: `https://youtu.be/${videoId}`,
                    format: true,
                    source: 'tool',
                    reason: '',
                    other_reason: null
                })
            });

            if (!response.ok) {
                throw new Error(`Kome API responded with status: ${response.status}`);
            }

            const data = await response.json();

            // Kome API dynamically returns either a raw string or an object containing the transcript
            let fallbackText = "";
            if (typeof data === 'string') {
                fallbackText = data;
            } else if (data.transcript && typeof data.transcript === 'string') {
                fallbackText = data.transcript;
            } else if (data.data?.transcript && typeof data.data.transcript === 'string') {
                fallbackText = data.data.transcript;
            } else if (Array.isArray(data.transcript)) {
                fallbackText = data.transcript.map(t => t.text || t).join(" ");
            } else if (Array.isArray(data.data?.transcript)) {
                fallbackText = data.data.transcript.map(t => t.text || t).join(" ");
            } else if (data.text) { // Some APIs use 'text'
                fallbackText = data.text;
            } else {
                throw new Error("Unexpected Kome.ai response format");
            }

            if (!fallbackText || fallbackText.trim().length === 0) {
                throw new Error("Kome API returned an empty text string.");
            }

            console.log(`[YoutubeTranscript] Kome.ai fallback succeeded. Retrieved string of length ${fallbackText.length}.`);
            return fallbackText;

        } catch (komeErr) {
            console.log(`[YoutubeTranscript] Kome.ai fallback failed: ${komeErr.message}. Attempting yt-dlp fallback...`);

            try {
                // Final fallback: yt-dlp to get the auto-generated subtitle JSON URL
                // Use absolute path relative to project root to ensure child_process finds the binary
                const ytDlpPath = `${process.cwd()}/yt-dlp`;
                const { stdout, stderr } = await execAsync(`${ytDlpPath} --dump-json "https://youtu.be/${videoId}"`);

                if (!stdout) {
                    throw new Error("yt-dlp executed but returned no JSON stdout.");
                }

                const videoInfo = JSON.parse(stdout);

                // yt-dlp stores captions in 'subtitles' (manual) or 'automatic_captions' (auto-generated)
                const subs = videoInfo.subtitles?.en || videoInfo.automatic_captions?.en;
                if (!subs) {
                    throw new Error("No English captions found via yt-dlp. Video might have closed captions completely disabled.");
                }

                const json3Sub = subs.find(s => s.ext === 'json3');
                if (!json3Sub || !json3Sub.url) {
                    throw new Error("No json3 format caption found via yt-dlp.");
                }

                const subRes = await fetch(json3Sub.url);
                if (!subRes.ok) throw new Error("Failed to fetch json3 subtitles.");

                const subData = await subRes.json();
                const events = subData.events || [];

                const ytDlpText = events.reduce((acc, event) => {
                    if (event.segs) {
                        const segmentText = event.segs.map(seg => seg.utf8).join("");
                        if (segmentText.trim() !== "") {
                            acc.push(segmentText.replace(/\n/g, ' '));
                        }
                    }
                    return acc;
                }, []).join(" ");

                console.log(`[YoutubeTranscript] yt-dlp fallback succeeded. Retrieved string of length ${ytDlpText.length}.`);
                return ytDlpText;

            } catch (ytDlpErr) {
                console.log(`[YoutubeTranscript] yt-dlp fallback completely failed:`, ytDlpErr.message);
                console.log(`[YoutubeTranscript] yt-dlp stderr/stack:`, ytDlpErr.stderr || ytDlpErr.stack);
                return "";
            }
        }
    }
}
