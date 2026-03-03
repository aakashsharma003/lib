import { askOpenAI } from "./openAI";
import { checkRateLimit } from "./rate-limiter";

export const getRelatedVideos = async (relatedContnt) => {
  if (!relatedContnt) {
    throw new Error("Video ID is required");
  }

  try {
    const params = new URLSearchParams({
      part: "snippet",
      q: relatedContnt,
      type: "video",
      maxResults: 10,
      videoCategoryId: "27", // Education
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_YOUTUBE_API_URL}/search?${params.toString()}`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    return data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      platform: 'youtube',
    }));
  } catch (error) {
    console.error("Error fetching recommended videos:", error);
    throw new Error("Unable to fetch recommended videos");
  }
};

export const getInfoWithVideoId = async (videoId) => {
  try {
    const params = new URLSearchParams({
      part: "snippet,contentDetails,statistics",
      id: videoId,
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_YOUTUBE_API_URL}/videos?${params.toString()}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    const videoData = data.items[0];
    const {
      snippet: { title, description, channelTitle, channelId, publishedAt, categoryId },
      statistics: { viewCount, likeCount },
      contentDetails: { duration },
    } = videoData;

    return {
      title,
      description,
      channelId,
      channelTitle,
      publishedAt,
      viewCount,
      likeCount,
      duration,
      categoryId,
    };
  } catch (error) {
    console.error("Error fetching video info:", error);
    return null;
  }
};

export const fetchVideos = async (query, pageToken = "") => {
  const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  const apiURL = process.env.NEXT_PUBLIC_YOUTUBE_API_URL;

  try {
    // 1. PRE-SEARCH AI FILTERING (rate-limited via Groq)
    // Ask Groq AI if the query is educational before wasting YouTube API quotas
    if (query) {
      try {
        // Check Groq rate limit before calling AI filter
        await checkRateLimit('groq');

        const validationPrompt = `Evaluate this search query: "${query}". 
Is this query related to education, programming, technology, tutorials, courses, learning, or self-improvement? 
Respond with exactly one word: "YES" or "NO".`;

        const isEducational = await askOpenAI(validationPrompt);

        if (isEducational && isEducational.trim().toUpperCase() === "NO") {
          console.log(`[AI Filter] Blocked non-educational search query: "${query}"`);
          return {
            items: [],
            nextPageToken: null,
            blockedByAI: true,
            rateLimited: false,
          };
        }
      } catch (validationErr) {
        // If rate limited, bubble up to UI
        if (validationErr.message.includes('Rate limit exceeded')) {
          const retryMatch = validationErr.message.match(/wait (\d+) seconds/);
          const retryAfter = retryMatch ? parseInt(retryMatch[1]) : 30;
          console.warn(`[AI Filter] Groq rate limit hit. Retry in ${retryAfter}s`);
          return {
            items: [],
            nextPageToken: null,
            blockedByAI: false,
            rateLimited: true,
            retryAfter,
          };
        }
        console.error("AI Search Validation Error:", validationErr);
        // Fail open: if Groq fails for other reasons, let the search proceed to YouTube
      }
    }

    // 2. YOUTUBE API FETCH
    // Use the exact query, but append negative keywords to aggressively filter out entertainment spam
    const baseQuery = query || "programming tutorial course";
    const curatedQuery = `${baseQuery} -shorts -prank -funny -entertainment -comedy -vlog -gossip`;

    const params = new URLSearchParams({
      part: "snippet",
      key: apiKey,
      type: "video",
      q: curatedQuery,
      maxResults: 15,
      videoCategoryId: "27", // 27 = Education category in YouTube
      videoEmbeddable: "true",
      safeSearch: "strict",
      videoDuration: "medium", // Guarantee 4-20 minute runtimes to kill quick shorts
    });

    if (pageToken) {
      params.append("pageToken", pageToken);
    }

    const res = await fetch(`${apiURL}/search?${params.toString()}`, {
      next: { revalidate: 86400 }, // Cache aggressively for 24 hours to save API quotas
    });

    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();

    // Map the initial results
    let youtubeItems = (data.items || []).map(item => ({
      ...item,
      platform: 'youtube'
    }));

    // Post-filter the results using AI
    if (youtubeItems.length > 0) {
      try {
        const videoList = youtubeItems.map(item => `ID: ${item.id.videoId} | Title: ${item.snippet.title}`).join('\n');

        const prompt = `You are a strict educational content filter. I will provide a list of videos with their ID and Title. 
Your job is to identify ONLY the ones that are high-quality, genuine educational tutorials, courses, computer science lectures, or programming guides.
Reject ANY entertainment, gossip, vlogs, funny shorts, compilation videos, or non-educational content carefully. 
Return ONLY a comma-separated list of the perfectly valid educational video IDs. Provide no other text, no markdown format, and no explanation.

Here is the list:
${videoList}`;

        const aiResponse = await askOpenAI(prompt);
        if (aiResponse) {
          const validIds = aiResponse.split(',').map(id => id.trim());
          const filteredItems = youtubeItems.filter(item => validIds.includes(item.id.videoId));

          // Only apply the filter if it didn't completely wipe everything out (safety net)
          if (filteredItems.length > 0) {
            youtubeItems = filteredItems;
          }
        }
      } catch (aiError) {
        console.error("AI Filtering error", aiError);
      }
    }

    // Generate dynamic mock data for other platforms based on the search query
    let finalItems = youtubeItems;
    if (!pageToken) {
      const displayQuery = query || "Programming";
      const capitalizedQuery = displayQuery.charAt(0).toUpperCase() + displayQuery.slice(1);

      const mockedVideos = [
        {
          id: { videoId: `mock-udemy-${Date.now()}` },
          platform: 'udemy',
          snippet: {
            title: `Complete ${capitalizedQuery} Bootcamp 2026`,
            channelTitle: "Udemy",
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" }, high: { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" } }
          }
        },
        {
          id: { videoId: `mock-coursera-${Date.now()}` },
          platform: 'coursera',
          snippet: {
            title: `${capitalizedQuery} Specialization Certificate`,
            channelTitle: "Coursera",
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" }, high: { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" } }
          }
        },
        {
          id: { videoId: `mock-vimeo-${Date.now()}` },
          platform: 'vimeo',
          snippet: {
            title: `Masterclass: Advanced ${capitalizedQuery} Techniques`,
            channelTitle: "Vimeo Learning",
            thumbnails: { medium: { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" }, high: { url: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop" } }
          }
        }
      ];

      // Insert mocked videos into the feed gracefully interspersed with real youtube results
      if (finalItems.length >= 2) finalItems.splice(2, 0, mockedVideos[0]);
      else finalItems.push(mockedVideos[0]);

      if (finalItems.length >= 5) finalItems.splice(5, 0, mockedVideos[1]);
      else finalItems.push(mockedVideos[1]);

      if (finalItems.length >= 8) finalItems.splice(8, 0, mockedVideos[2]);
      else finalItems.push(mockedVideos[2]);
    }

    return {
      items: finalItems,
      nextPageToken: data.nextPageToken || null,
      blockedByAI: false,
      rateLimited: false,
    };
  } catch (error) {
    console.error("Failed to fetch videos:", error);
    return { items: [], nextPageToken: null, blockedByAI: false, rateLimited: false };
  }
};


