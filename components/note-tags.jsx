"use client"

import { useState, useRef, useEffect } from "react"
import { Check, Plus, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Tag color mapping — matching the quick-revision-materials page
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

const AVAILABLE_TAGS = Object.keys(tagStyleMap)

export function NoteTags({ initialTags = [], noteId, isOwner = false }) {
    const [open, setOpen] = useState(false)
    const [tags, setTags] = useState(initialTags)
    const [isUpdating, setIsUpdating] = useState(false)
    const [search, setSearch] = useState("")
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const filteredTags = AVAILABLE_TAGS.filter(tag =>
        tag.toLowerCase().includes(search.toLowerCase())
    )

    const toggleTag = async (tagValue) => {
        if (!isOwner) return

        const prevTags = [...tags]
        const newTags = tags.includes(tagValue)
            ? tags.filter((t) => t !== tagValue)
            : [...tags, tagValue]

        // Optimistic update
        setTags(newTags)
        setIsUpdating(true)

        try {
            const response = await fetch(`/api/notes/${noteId}/tags`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tags: newTags }),
            })

            if (!response.ok) throw new Error("Failed to update tags")

            const data = await response.json()
            setTags(data.tags)
        } catch (error) {
            console.error(error)
            setTags(prevTags) // revert
        } finally {
            setIsUpdating(false)
        }
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mt-4">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className={cn(
                        "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-md border transition-colors",
                        tagStyleMap[tag] || "bg-[#1e293b] text-[#94a3b8] border-[#334155]"
                    )}
                >
                    {tag}
                    {isOwner && (
                        <button
                            onClick={() => toggleTag(tag)}
                            className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity"
                            disabled={isUpdating}
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </span>
            ))}

            {isOwner && (
                <div className="relative" ref={dropdownRef}>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setOpen(!open)}
                        disabled={isUpdating}
                        className="h-7 text-xs border-dashed text-muted-foreground rounded-full px-3 bg-transparent hover:bg-secondary"
                    >
                        {isUpdating ? (
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        ) : (
                            <Plus className="mr-1 h-3 w-3" />
                        )}
                        Add Tags
                    </Button>

                    {open && (
                        <div className="absolute left-0 top-full mt-2 z-50 w-[240px] rounded-lg border border-border bg-card shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
                            {/* Search input */}
                            <div className="p-2 border-b border-border">
                                <input
                                    type="text"
                                    placeholder="Search tags..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none px-2 py-1"
                                    autoFocus
                                />
                            </div>

                            {/* Tag list */}
                            <div className="max-h-[240px] overflow-y-auto p-1">
                                {filteredTags.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-3">No tags found.</p>
                                ) : (
                                    filteredTags.map((tag) => {
                                        const isSelected = tags.includes(tag)
                                        return (
                                            <button
                                                key={tag}
                                                onClick={() => toggleTag(tag)}
                                                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm hover:bg-secondary/80 transition-colors text-left"
                                            >
                                                <div
                                                    className={cn(
                                                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border border-primary",
                                                        isSelected
                                                            ? "bg-primary text-primary-foreground"
                                                            : "opacity-50"
                                                    )}
                                                >
                                                    {isSelected && <Check className="h-3 w-3" />}
                                                </div>
                                                <span
                                                    className={cn(
                                                        "text-xs font-medium px-2 py-0.5 rounded-md border",
                                                        tagStyleMap[tag]
                                                    )}
                                                >
                                                    {tag}
                                                </span>
                                            </button>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
