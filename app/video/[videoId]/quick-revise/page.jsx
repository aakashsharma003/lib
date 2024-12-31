"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function QuickRevisePage() {
  const [content, setContent] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const { videoId } = useParams();

  async function getTranscript() {
    setLoadingTranscript(true);
    try {
      const response = await axios.get(`/api/transcript?videoId=${videoId}`);
      console.log("transcript response", response.data);
      setTranscript(response.data);
    } catch (error) {
      console.log("error in getTranscript", error);
    } finally {
      setLoadingTranscript(false);
    }
  }

  async function getQuickRevise() {
    console.log("transcript in getQuickRevise", transcript);
    try {
      const response = await axios.post(`/api/revise-notes`, {
        videoId: videoId,
        transcript: transcript,
      });
      console.log("response from revise-notes", response);
      setContent(response.data);
    } catch (error) {
      console.log("error in getQuickRevise", error);
    }
  }

  useEffect(() => {
    getTranscript();
  }, [videoId]);

  useEffect(() => {
    if (transcript) {
      getQuickRevise();
    }
  }, [transcript, videoId]);

  const [savedContent, setSavedContent] = useState(content);

  const handleSave = () => {
    setSavedContent(content);
  };

  const handleRestore = () => {
    setContent(savedContent);
  };

  return (
    <div className="min-h-screen bg-background">
      <ShowContent data={content} />
    </div>
  );
}

const formatContent = (content) => {
  return content
    .split("\n")
    .map((line) =>
      line.trim().startsWith("-")
        ? `<li>${line.slice(1).trim()}</li>`
        : `<p>${line}</p>`
    )
    .join("")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
};

function ShowContent({ data }) {
  const groupedData = data.reduce((acc, item) => {
    if (!acc[item.topic]) {
      acc[item.topic] = [];
    }
    acc[item.topic].push(item);
    return acc;
  }, {});

  return (
    <div className="container mx-auto px-4 py-8">
      {data[0]?.heading && (
        <h1 className="text-3xl font-bold mb-6 text-center">
          {data[0].heading}
        </h1>
      )}
      {Object.entries(groupedData).map(([topic, items]) => (
        <div key={topic} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{topic}</h2>
          {items.map((item, index) => (
            <div key={index} className="mb-4 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2">{item.subtopic}</h3>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: formatContent(item.content),
                }}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
