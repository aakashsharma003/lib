"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Pencil, Bookmark } from 'lucide-react'
import Link from "next/link"

export default function QuickRevisionMaterialsPage() {
  const [materials] = useState([
    {
      id: "1",
      title: "Introduction to React Hooks",
      content:
        "React Hooks are functions that let you use state and other React features without writing a class. They were introduced in React 16.8 and have since become an integral part of React development...",
      isHighlighted: true,
      isMarked: false,
    },
    {
      id: "2",
      title: "Understanding useEffect",
      content:
        "The useEffect Hook allows you to perform side effects in your components. Some examples of side effects are: fetching data, directly updating the DOM, and timers. useEffect accepts two arguments...",
      isHighlighted: false,
      isMarked: true,
    },
  ])

  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredMaterials = materials.filter((material) => {
    if (activeTab === "highlighted" && !material.isHighlighted) return false
    if (activeTab === "marked" && !material.isMarked) return false
    return material.title.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <div className="min-h-screen bg-background">
      {/* <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Video</span>
          </Link>
        </div>
      </header> */}
      <main className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Quick Revision Materials</h1>
        <div className="space-y-6">
          <Input
            placeholder="Search revision materials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="highlighted">Highlighted</TabsTrigger>
              <TabsTrigger value="marked">Marked for Revisit</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="space-y-4">
            {filteredMaterials.map((material) => (
              <div
                key={material.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-xl font-semibold">{material.title}</h2>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-muted-foreground line-clamp-2">
                  {material.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

