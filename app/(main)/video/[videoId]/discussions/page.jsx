"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ChevronsUp, ChevronsDown } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useParams } from "next/navigation"

// Avatar colors based on first letter
const avatarColorMap = {
  A: "bg-green-600", B: "bg-blue-600", C: "bg-cyan-600", D: "bg-indigo-600",
  E: "bg-emerald-600", F: "bg-fuchsia-600", G: "bg-gray-600", H: "bg-yellow-600",
  I: "bg-pink-600", J: "bg-orange-600", K: "bg-teal-600", L: "bg-lime-600",
  M: "bg-purple-600", N: "bg-violet-600", O: "bg-rose-600", P: "bg-sky-600",
  Q: "bg-amber-600", R: "bg-red-600", S: "bg-green-600", T: "bg-blue-600",
  U: "bg-cyan-600", V: "bg-indigo-600", W: "bg-emerald-600", X: "bg-fuchsia-600",
  Y: "bg-yellow-600", Z: "bg-pink-600",
}
function getAvatarColor(name) {
  if (!name) return "bg-blue-600"
  return avatarColorMap[name.charAt(0).toUpperCase()] || "bg-blue-600"
}

// Tag color mapping — matching the reference image exactly
const tagStyleMap = {
  "Suspicious": "bg-red-500/15 text-red-400 border-red-500/30",
  "File Deleted": "bg-green-500/15 text-green-400 border-green-500/30",
  "Not able to open": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Not relatable to video": "bg-green-500/15 text-green-400 border-green-500/30",
  "recommended notes": "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  "Best One": "bg-pink-500/15 text-pink-400 border-pink-500/30",
  "Covers Everything": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Short and Concise": "bg-green-500/15 text-green-400 border-green-500/30",
  "Indepth": "bg-purple-500/15 text-purple-400 border-purple-500/30",
  "Awesome": "bg-orange-500/15 text-orange-400 border-orange-500/30",
  "Incomplete Notes": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
  "Revision": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "Other": "bg-green-500/15 text-green-400 border-green-500/30",
}
function getTagStyle(tag) {
  return tagStyleMap[tag] || "bg-secondary text-muted-foreground border-border"
}

export default function QuickRevisionMaterialsPage() {
  const params = useParams()
  const secureVideoId = params?.videoId

  const [materials, setMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [realVideoId, setRealVideoId] = useState(null)

  useEffect(() => {
    if (!secureVideoId) return

    const fetchNotes = async () => {
      try {
        // Check sessionStorage cache for the decrypted video ID
        const cacheKey = `decrypt-${secureVideoId}`
        let resolvedId = sessionStorage.getItem(cacheKey)

        if (!resolvedId) {
          // Resolve the secure video ID to the real YouTube video ID
          const decryptRes = await fetch(`/api/decrypt-video?id=${secureVideoId}`)
          if (!decryptRes.ok) {
            console.error("Failed to decrypt video ID")
            setIsLoading(false)
            return
          }
          const data = await decryptRes.json()
          resolvedId = data.videoId
          // Cache the decrypted ID for future use
          try { sessionStorage.setItem(cacheKey, resolvedId) } catch (e) { }
        }

        setRealVideoId(resolvedId)

        // Fetch notes using the real video ID
        const res = await fetch(`/api/notes?videoId=${resolvedId}&limit=all`)
        if (res.ok) {
          const data = await res.json()
          setMaterials(data.notes || [])
        }
      } catch (error) {
        console.error("Failed to fetch notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [secureVideoId])

  const [searchQuery, setSearchQuery] = useState("")

  const filteredMaterials = materials.filter((material) => {
    return material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (material.content && material.content.toLowerCase().includes(searchQuery.toLowerCase()))
  })

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <Link
          href={`/video/${secureVideoId}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Video
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Discussions</h1>
          <p className="text-muted-foreground mt-1 text-sm">Please maintain a respectful and civil tone in all interactions.</p>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-60 bg-card border-border text-foreground placeholder:text-muted-foreground h-9 rounded-md"
            />
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 font-medium rounded-md">
              Search
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary h-9 px-5 font-medium rounded-md">
              ↕ Sort by
            </Button>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-5 font-medium rounded-md">
              + Ask a Question
            </Button>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-9 w-9 rounded-full bg-secondary"></div>
                  <div className="space-y-1.5">
                    <div className="h-3 w-28 bg-secondary rounded"></div>
                    <div className="h-2.5 w-20 bg-secondary/60 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-5 w-[85%] bg-secondary rounded"></div>
                  <div className="h-4 w-[65%] bg-secondary/60 rounded"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-7 w-16 bg-secondary rounded-full"></div>
                  <div className="h-7 w-14 bg-secondary rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-20 px-4 border border-dashed border-border rounded-xl bg-card/30">
            <h3 className="text-xl font-semibold mb-2 text-foreground">No questions found</h3>
            <p className="text-muted-foreground">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredMaterials.map((material) => {
              const avatarBg = getAvatarColor(material.author)
              return (
                <div
                  key={material.id}
                  className="flex flex-col bg-card border border-border rounded-xl p-6 transition-all duration-200"
                >
                  {/* Author Row */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className={`${avatarBg} text-white text-sm font-semibold`}>
                        {material.author.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-semibold text-foreground leading-tight">
                        {material.author}
                      </span>
                      <span className="text-[13px] text-muted-foreground mt-0.5">
                        Updated {material.date}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/video/${secureVideoId}/notes/${material.id}?from=discussions`} className="block mb-3">
                    <h3 className="text-base font-bold leading-snug text-foreground line-clamp-2">
                      {material.title}
                    </h3>
                  </Link>

                  {/* Description — blockquote style */}
                  {material.subtitle && (
                    <div className="border-l-2 border-border pl-3 mb-4 bg-secondary/30 rounded-r-md py-2 pr-3">
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {material.subtitle}
                      </p>
                    </div>
                  )}

                  {/* Tags — colored rounded pills with border */}
                  {material.tags && material.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {material.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`text-xs font-medium px-3 py-1 rounded-md border ${getTagStyle(tag)}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom: Upvote / Downvote / Replies */}
                  <div className="flex items-center gap-2.5 mt-auto pt-1">
                    {/* Upvote pill */}
                    <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-transparent hover:bg-secondary text-[13px] font-medium text-muted-foreground transition-colors">
                      <ChevronsUp className="h-3.5 w-3.5" />
                      <span>{material.upvotes || 0}</span>
                    </button>

                    {/* Downvote pill */}
                    <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-transparent hover:bg-secondary text-[13px] font-medium text-muted-foreground transition-colors">
                      <ChevronsDown className="h-3.5 w-3.5" />
                      <span>{material.downvotes || 0}</span>
                    </button>

                    {/* Replies count */}
                    <span className="text-[13px] text-muted-foreground/70 ml-1">
                      • {material.comments || material.replies || 0} replies
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
