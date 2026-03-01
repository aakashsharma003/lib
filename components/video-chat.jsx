"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Loader2 } from "lucide-react";
import { chatWithVideo } from "@/app/actions/chat";

export function VideoChat({ videoId }) {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content: "Hi! I've read the transcript for this video. Ask me anything about it!",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Analyzing video...");
    const scrollRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    // ChatGPT style dynamic loading messages
    useEffect(() => {
        if (!isLoading) return;

        const loadingStates = [
            "Analyzing video...",
            "Fetching transcript...",
            "Embedding context...",
            "Searching vector space...",
            "Generating response...",
            "Refining answer..."
        ];

        let currentIndex = 0;
        setLoadingMessage(loadingStates[0]);

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % loadingStates.length;
            // Stop cycling at the last logical message
            if (currentIndex < loadingStates.length) {
                setLoadingMessage(loadingStates[currentIndex]);
            }
        }, 2500); // Change text every 2.5 seconds

        return () => clearInterval(interval);
    }, [isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const currentInput = input;
        const userMessage = { id: Date.now(), role: "user", content: currentInput };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const responseText = await chatWithVideo(videoId, messages, currentInput);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: responseText,
                },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content: "I'm sorry, my connection was interrupted. Please try asking again.",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-8 flex flex-col h-[500px] bg-secondary/10 rounded-2xl border border-border/50 overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center">
                    <img src="/Google-Gemini-Logo-Transparent-thumb.png" alt="Gemini AI" className="h-5 w-5 object-contain" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground leading-none">Chat with Video</h3>
                    <p className="text-xs text-muted-foreground mt-1">AI trained on the video transcript</p>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
                {messages.map((m) => (
                    <div key={m.id} className={`flex space-x-4 ${m.role === "assistant" ? "" : "flex-row-reverse space-x-reverse"}`}>
                        <Avatar className="h-8 w-8 shrink-0 mt-1">
                            {m.role === "assistant" ? (
                                <>
                                    <AvatarFallback className="bg-primary/20 flex items-center justify-center"><img src="/Google-Gemini-Logo-Transparent-thumb.png" alt="Gemini" className="h-4 w-4 object-contain" /></AvatarFallback>
                                </>
                            ) : (
                                <>
                                    <AvatarImage src="/placeholder.svg" />
                                    <AvatarFallback className="bg-secondary text-secondary-foreground"><User size={16} /></AvatarFallback>
                                </>
                            )}
                        </Avatar>
                        <div className={`p-3 rounded-2xl max-w-[85%] sm:max-w-[75%] ${m.role === "assistant" ? "bg-secondary/50 text-secondary-foreground rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex space-x-4">
                        <Avatar className="h-8 w-8 shrink-0 mt-1">
                            <AvatarFallback className="bg-primary/20 flex items-center justify-center"><img src="/Google-Gemini-Logo-Transparent-thumb.png" alt="Gemini" className="h-4 w-4 object-contain" /></AvatarFallback>
                        </Avatar>
                        <div className="p-4 rounded-2xl bg-secondary/50 rounded-tl-sm flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-medium animate-pulse">{loadingMessage}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input area */}
            <div className="p-4 bg-card/50 border-t border-border/50">
                <form onSubmit={handleSend} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about the video..."
                        className="flex h-12 w-full rounded-full border border-border/50 bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-1.5 h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                        disabled={!input.trim() || isLoading}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
