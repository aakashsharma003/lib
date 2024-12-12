"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import Link from "next/link"

export default function QuickRevisePage() {
  const [content, setContent] = useState(
    "React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have since become an integral part of React development..."
  )
  const [savedContent, setSavedContent] = useState(content)

  const handleSave = () => {
    setSavedContent(content)
  }

  const handleRestore = () => {
    setContent(savedContent)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Link>
          <div className="flex gap-2">
            <Button onClick={handleSave} variant="outline">
              Save
            </Button>
            <Button onClick={handleRestore} variant="outline">
              Restore
            </Button>
          </div>
        </div>
      </header> */}
      <main className="container py-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-6">Introduction to React Hooks</h1>
          <div className="prose dark:prose-invert">
            <textarea
              className="w-full min-h-[200px] bg-background resize-none border-none focus:outline-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

