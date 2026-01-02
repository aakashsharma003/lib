"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function VideoNotePage() {
  const { videoId, id } = useParams();
  const [noteData, setNoteData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNoteData = async () => {
      setIsLoading(true);
      try {
        // In a real application, you would fetch the note data from your backend
        // For now, we'll simulate this with a timeout and mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setNoteData({
          title: "Sample Note Title for Video " + videoId,
          content: "This is the content of the note for video " + videoId,
          driveLink: `https://drive.google.com/file/d/1oVak4if6oBbnFfvlGgUiy0Sqvs_dGHO2/preview`,
        });
      } catch (err) {
        console.error("Error fetching note data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoteData();
  }, [videoId, id]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link
            href={`/video/${videoId}`}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Video</span>
          </Link>
        </div>
      </header>
      <main className="flex-grow container py-6">
        {isLoading ? (
          <p>Loading...</p>
        ) : noteData ? (
          <>
            <h1 className="text-3xl font-bold mb-4">{noteData.title}</h1>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Notes:</h2>
              <p>{noteData.content}</p>
            </div>
            <div className="w-full h-[calc(100vh-300px)] border rounded">
              <iframe
                src={noteData.driveLink}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </>
        ) : (
          <p>Note not found.</p>
        )}
      </main>
    </div>
  );
}
