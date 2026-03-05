"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronsUp, ChevronsDown, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Rotating avatar colors based on first letter of author name
const avatarColorMap = {
    A: "bg-green-600", B: "bg-blue-600", C: "bg-cyan-600", D: "bg-indigo-600",
    E: "bg-emerald-600", F: "bg-fuchsia-600", G: "bg-gray-600", H: "bg-yellow-600",
    I: "bg-pink-600", J: "bg-orange-600", K: "bg-teal-600", L: "bg-lime-600",
    M: "bg-purple-600", N: "bg-violet-600", O: "bg-rose-600", P: "bg-sky-600",
    Q: "bg-amber-600", R: "bg-red-600", S: "bg-green-600", T: "bg-blue-600",
    U: "bg-cyan-600", V: "bg-indigo-600", W: "bg-emerald-600", X: "bg-fuchsia-600",
    Y: "bg-yellow-600", Z: "bg-pink-600",
};

function getAvatarColor(name) {
    if (!name) return "bg-blue-600";
    const letter = name.charAt(0).toUpperCase();
    return avatarColorMap[letter] || "bg-blue-600";
}

// Tag color mapping — matching the discussions page/note-tags exactly
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
};

function getTagStyle(tag) {
    return tagStyleMap[tag] || "bg-secondary text-muted-foreground border-border";
}

export function VideoNotes({ videoId, secureVideoId, channelTitle }) {
    const router = useRouter();
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [navigatingTo, setNavigatingTo] = useState(null);

    useEffect(() => {
        if (!videoId) return;

        const fetchNotes = async () => {
            try {
                const res = await fetch(`/api/notes?videoId=${videoId}`);
                if (res.ok) {
                    const data = await res.json();
                    setNotes(data.notes || []);
                }
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotes();
    }, [videoId]);

    return (
        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Full-page loading overlay */}
            {navigatingTo && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground">Loading...</p>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Top Notes</h2>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, index) => (
                        <div key={index} className="bg-card border border-border rounded-xl p-5 animate-pulse">
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
            ) : notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/50 rounded-2xl border border-dashed border-border">
                    <div className="bg-secondary p-4 rounded-full mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">No notes here yet!</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                        There are no revision materials attached to this video. Be the first to share your learnings with others!
                    </p>
                    <Button onClick={() => document.getElementById('create-post-dialog')?.click()} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Create a Note
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Notes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {notes.map((note) => {
                            const avatarBg = getAvatarColor(note.author);
                            return (
                                <div
                                    key={note.id}
                                    className="flex flex-col bg-card border border-border rounded-xl p-6 transition-all duration-200"
                                >
                                    {/* Author Row */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className={`${avatarBg} text-white text-sm font-semibold`}>
                                                {note.author ? note.author.charAt(0).toUpperCase() : "A"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="text-[15px] font-semibold text-foreground leading-tight">
                                                {note.author || "Anonymous"}
                                            </span>
                                            <span className="text-[13px] text-muted-foreground mt-0.5">
                                                Updated {note.date || "1 day ago"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <Link
                                        href={`/video/${secureVideoId}/notes/${note.id}`}
                                        className="block mb-3"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setNavigatingTo(note.id);
                                            router.push(`/video/${secureVideoId}/notes/${note.id}`);
                                        }}
                                    >
                                        <h3 className="text-base font-bold leading-snug text-foreground line-clamp-2">
                                            {note.title}
                                        </h3>
                                    </Link>

                                    {/* Description — blockquote style if subtitle exists */}
                                    {note.subtitle && (
                                        <div className="border-l-2 border-border pl-3 mb-4">
                                            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed italic">
                                                {note.subtitle}
                                            </p>
                                        </div>
                                    )}


                                    {/* Tags — colored rounded pills */}
                                    {note.tags && note.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {note.tags.map((tag, i) => (
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
                                            <span>{note.upvotes || 0}</span>
                                        </button>

                                        {/* Downvote pill */}
                                        <button className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-transparent hover:bg-secondary text-[13px] font-medium text-muted-foreground transition-colors">
                                            <ChevronsDown className="h-3.5 w-3.5" />
                                            <span>{note.downvotes || 0}</span>
                                        </button>

                                        {/* Replies count */}
                                        <span className="text-[13px] text-muted-foreground/70 ml-1">
                                            • {note.comments || note.replies || 0} replies
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Show All Button */}
                    <div className="pt-2">
                        <Button
                            asChild
                            className="w-full rounded-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200"
                        >
                            <Link
                                href={`/video/${secureVideoId}/discussions`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setNavigatingTo('all');
                                    router.push(`/video/${secureVideoId}/discussions`);
                                }}
                            >
                                Show all Notes
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
