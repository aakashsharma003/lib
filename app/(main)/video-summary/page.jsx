"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Copy, Save, User, Bot } from "lucide-react";
import Link from "next/link"
import axios from "axios"

export default function VideoSummaryPage() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm here to help you with any questions you have about the video you just watched. What would you like to know?",
      isUser: false,
    },
  ]);
  const [isStreamingResponse, setStreamingResponse] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStreamingResponse(true);
    //  //console.log("input value", inputValue)
    if (!inputValue.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { text: inputValue, isUser: true }]);
    try {
      const response = await axios.post(`/api/ask`, {
        videoId: "009FHqBo87Q",
        question: inputValue,
      });
      // //console.log("response m kya aya",response.data);
      // Check if the response status is not OK
      if (response.status !== 200) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              text: "I am unable to answer this question. Is there any other question?",
              isUser: false,
            },
          ]);
        }, 1000);
        return;
      }
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: response?.data?.answer,
            isUser: false,
          },
        ]);
      }, 1000);
    } catch (error) {
      console.error("error", error);
    } finally {
      setInputValue("");
      setStreamingResponse(false);
    }
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
  };

  const saveMessage = (text) => {
    // //console.log("Saving message:", text);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
        </div>
      </header>
      <div className="container py-6">
        <div className="mx-auto max-w-2xl">
          <div className="space-y-4 pb-[100px]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 rounded-lg px-4 py-2 max-w-[80%] ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {/* {message.isUser ? (
                    <User className="h-6 w-6 mt-1 flex-shrink-0" />
                  ) : (
                    <Bot className="h-6 w-6 mt-1 flex-shrink-0" />
                  )} */}
                  <div className="flex-grow">
                    <div className="prose dark:prose-invert max-w-none">
                      {message?.text?.split("\n")?.map((paragraph, i) => {
                        if (paragraph.startsWith("**")) {
                          return (
                            <h3 key={i} className="font-bold mt-4 mb-2">
                              {paragraph.replace(/\*\*/g, "")}
                            </h3>
                          );
                        } else if (paragraph.startsWith("*")) {
                          return (
                            <ul key={i} className="list-disc pl-5 mt-2">
                              <li>{paragraph.replace("*", "")}</li>
                            </ul>
                          );
                        } else {
                          return (
                            <p key={i} className="mb-2">
                              {paragraph}
                            </p>
                          );
                        }
                      })}
                    </div>
                    {!message.isUser && (
                      <div className="mt-2 flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => copyMessage(message.text)}
                          className="h-6 w-6"
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy message</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => saveMessage(message.text)}
                          className="h-6 w-6"
                        >
                          <Save className="h-4 w-4" />
                          <span className="sr-only">Save message</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <form
              onSubmit={handleSubmit}
              className="container max-w-2xl mx-auto"
            >
              <div className="flex gap-2">
                <Input
                  placeholder="Type your question here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="submit" disabled={isStreamingResponse}>
                  Ask
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

