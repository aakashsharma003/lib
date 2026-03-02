"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageSquare, ThumbsUp, FileText, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function VideoNotes({ videoId, secureVideoId, channelTitle }) {
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
        <div className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Top Notes</h2>
            </div>

            {isLoading ? (
                <div className="flex flex-col mt-4 border border-border/20 rounded-2xl p-2 sm:p-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="flex flex-row gap-6 border-b border-border/20 py-6 last:border-0 p-4 -mx-4 rounded-xl items-center animate-pulse">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div className="h-6 w-6 rounded-full bg-secondary/80"></div>
                                    <div className="h-3 w-32 bg-secondary/80 rounded"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-5 w-[80%] bg-secondary/80 rounded"></div>
                                    <div className="h-4 w-[60%] bg-secondary/60 rounded"></div>
                                </div>
                                <div className="h-4 w-48 bg-secondary/60 rounded pt-2"></div>
                            </div>
                            <div className="hidden sm:block shrink-0 w-[120px] sm:w-[160px] lg:w-[180px]">
                                <div className="aspect-[4/3] w-full rounded-md bg-secondary/60"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : notes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-secondary/20 rounded-2xl border border-dashed border-border/60">
                    <div className="bg-secondary p-4 rounded-full mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No notes here yet!</h3>
                    <p className="text-muted-foreground max-w-md mb-6">
                        There are no revision materials attached to this video. Be the first to share your learnings with others!
                    </p>
                    <Button onClick={() => document.getElementById('create-post-dialog')?.click()} className="rounded-full">
                        Create a Note
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col mt-4 bg-[#fafcfd] dark:bg-background/50 border border-border/20 rounded-2xl p-2 sm:p-4">
                    {notes.map((note) => (
                        <div key={note.id} className="flex flex-row gap-6 border-b border-border/20 py-6 last:border-0 hover:bg-secondary/5 transition-colors p-4 -mx-4 rounded-xl cursor-default items-center">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground mb-3">
                                    <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold">
                                            {note.author.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span>
                                        In <span className="font-semibold text-foreground">{channelTitle || "Community Notes"}</span> by <span className="font-medium text-foreground">{note.author}</span>
                                    </span>
                                </div>

                                <Link href={`/video/${secureVideoId}/notes/${note.id}`} className="group block space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
                                    <h3 className="text-lg sm:text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                        {note.title}
                                    </h3>
                                    <p className="text-muted-foreground text-[14px] sm:text-[15px] line-clamp-2 leading-relaxed">
                                        {note.subtitle}
                                    </p>
                                </Link>

                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center space-x-4 text-[13px] text-muted-foreground font-medium">
                                        <span>{note.date}</span>
                                        <div className="flex items-center space-x-1.5 cursor-pointer hover:text-foreground transition-colors">
                                            <ThumbsUp className="h-4 w-4" />
                                            <span>{note.upvotes}</span>
                                        </div>
                                        {note.comments > 0 && (
                                            <div className="flex items-center space-x-1.5 cursor-pointer hover:text-foreground transition-colors">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{note.comments}</span>
                                            </div>
                                        )}
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground -mr-2">
                                        <Bookmark className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Right side notes icon thumbnail */}
                            <div className="hidden sm:block shrink-0 w-[120px] sm:w-[160px] lg:w-[180px]">
                                <Link href={`/video/${secureVideoId}/notes/${note.id}`} className="block relative aspect-[4/3] w-full overflow-hidden rounded-md border border-border/20 bg-secondary/10 group shadow-sm flex items-center justify-center p-2">
                                    <Image
                                        src="/notes-icon.png"
                                        alt="Notes Thumbnail"
                                        layout="fill"
                                        objectFit="contain"
                                        className="transition-transform duration-500 group-hover:scale-105 p-3 sm:p-4 opacity-90"
                                        onError={(e) => {
                                            e.currentTarget.src = "/placeholder.svg";
                                        }}
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}

                    <div className="pt-2">
                        <Button asChild variant="outline" className="w-full rounded-full h-12 text-base font-semibold border-border/50 hover:bg-secondary/50 transition-colors">
                            <Link href="/quick-revision-materials">
                                Show all Notes
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
