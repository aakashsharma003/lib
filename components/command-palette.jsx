"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, MessageSquareText, FileText, Sparkles, ArrowRight } from "lucide-react";

export function CommandPalette({ onClose, onJumpToNotes }) {
    const [query, setQuery] = useState("");
    const inputRef = useRef(null);
    const overlayRef = useRef(null);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Handle keyboard
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        },
        [onClose]
    );

    // Click outside to close
    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh]"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        >
            <div className="w-full max-w-lg rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-top-2 duration-200"
                style={{ backgroundColor: "#0d1117", border: "1px solid #1e293b" }}
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: "1px solid #1e293b" }}>
                    <Search className="h-5 w-5 shrink-0" style={{ color: "#94a3b8" }} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent border-none outline-none text-sm"
                        style={{ color: "#e2e8f0", caretColor: "#e2e8f0" }}
                    />
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
                        style={{ backgroundColor: "#1e293b", color: "#64748b", border: "1px solid #334155" }}>
                        ESC
                    </kbd>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md transition-colors sm:hidden"
                        style={{ color: "#94a3b8" }}
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-[50vh] overflow-y-auto">

                    {/* Timestamps Section */}
                    <div className="px-4 pt-4 pb-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "#64748b" }}>
                            Timestamps
                        </p>

                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group"
                            style={{ color: "#e2e8f0" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            onClick={onClose}
                        >
                            <Clock className="h-4 w-4 shrink-0" style={{ color: "#22d3ee" }} />
                            <span className="flex-1 text-sm">Jump to timestamp</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold"
                                style={{ backgroundColor: "#164e63", color: "#22d3ee", border: "1px solid #0e7490" }}>
                                1:30
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#64748b" }} />
                        </button>

                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group"
                            style={{ color: "#e2e8f0" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            onClick={onClose}
                        >
                            <MessageSquareText className="h-4 w-4 shrink-0" style={{ color: "#a78bfa" }} />
                            <span className="flex-1 text-sm">What is the tutor explaining at</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold"
                                style={{ backgroundColor: "#2e1065", color: "#a78bfa", border: "1px solid #6d28d9" }}>
                                2:30
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#64748b" }} />
                        </button>
                    </div>

                    {/* Quick Actions Section */}
                    <div className="px-4 pt-2 pb-4" style={{ borderTop: "1px solid #1e293b" }}>
                        <p className="text-[11px] font-semibold uppercase tracking-wider mb-2 mt-2" style={{ color: "#64748b" }}>
                            Quick Actions
                        </p>

                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group"
                            style={{ color: "#e2e8f0" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            onClick={() => { onJumpToNotes?.(); onClose(); }}
                        >
                            <FileText className="h-4 w-4 shrink-0" style={{ color: "#34d399" }} />
                            <span className="flex-1 text-sm">Browse attached notes</span>
                            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
                                style={{ backgroundColor: "#1e293b", color: "#64748b", border: "1px solid #334155" }}>
                                N
                            </kbd>
                        </button>

                        <button
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group"
                            style={{ color: "#e2e8f0" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1e293b"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                            onClick={onClose}
                        >
                            <Sparkles className="h-4 w-4 shrink-0" style={{ color: "#fbbf24" }} />
                            <span className="flex-1 text-sm">Summarize this video with AI</span>
                            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono"
                                style={{ backgroundColor: "#1e293b", color: "#64748b", border: "1px solid #334155" }}>
                                S
                            </kbd>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
