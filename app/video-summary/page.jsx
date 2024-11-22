"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function VideoSummaryPage() {
  const [messages, setMessages] = useState([
    {
      text: "Hello! I'm here to help you with any questions you have about the video you just watched. What would you like to know?",
      isUser: false,
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Add user message
    setMessages(prev => [...prev, { text: inputValue, isUser: true }])

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text: "The main concept of the video is [insert brief explanation here]. It covers [key points]. Is there any specific part you'd like me to elaborate on?",
          isUser: false,
        },
      ])
    }, 1000)

    setInputValue("")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.isUser
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
            <form onSubmit={handleSubmit} className="container max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your question here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button type="submit">Ask</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

