"use client"

import { useState,useEffect} from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"
import axios from "axios"
import { useParams } from "next/navigation"

export default function QuickRevisePage() {
  const [content, setContent] = useState([]);
  const [transcript, setTranscript] = useState("");
  const [loadingTranscript, setLoadingTranscript] = useState(false);  
   const { videoId } = useParams();
  async function getTranscript() {
    setLoadingTranscript(true);
    try {
      const response = await axios.get(
        `/api/transcript?videoId=vpJGWvi0h9U`
      );
      console.log("response yh hhh", response.data);
      setTranscript(response.data);
    } catch (error) {
      console.log("error aa gya")
      console.log("error", error);
    } finally {
      setLoadingTranscript(false);
    }
  }
  async function getQuickRevise() {
    // setLoadingTranscript(true);
    console.log("transcript ayyyiiii", transcript);
    try {
      const response = await axios.post(`/api/revise-notes`, {
        videoId: videoId,
        transcript:transcript
      });
      console.log("yh aya response", response);
      setContent(response);
    } catch (error) {
      console.log("error", error);
    } finally {
      // setLoadingTranscript(false);
    }
  }
  async function fetchTranscriptAndRevise() {
    try {
      await getTranscript(); // Wait for transcript
      console.log("transcript nhi ayi ",transcript)
      await getQuickRevise(); // Then get quick revise
    } catch (error) {
      console.log("Error occurred during fetch sequence:", error);
    }
  }
    useEffect(() => {
      fetchTranscriptAndRevise();
    }, [videoId]);
  const [savedContent, setSavedContent] = useState(content)

  const handleSave = () => {
    setSavedContent(content)
  }

  const handleRestore = () => {
    setContent(savedContent)
  }

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

function ShowContent({data}) {
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

