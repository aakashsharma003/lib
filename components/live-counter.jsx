"use client";

import { useState, useEffect, useRef } from "react";

export function LiveCounter({ videoId, userId }) {
    const [viewers, setViewers] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const prevCountRef = useRef(1);

    useEffect(() => {
        if (!videoId || !userId) return;

        const updatePresence = async () => {
            try {
                const res = await fetch("/api/viewers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ videoId, userId }),
                });
                const data = await res.json();

                if (data.count !== prevCountRef.current) {
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 600);
                    prevCountRef.current = data.count;
                }

                setViewers(data.count);
            } catch (err) {
                console.error("Failed to update presence", err);
            }
        };

        // Initial call
        updatePresence();

        // Heartbeat every 25 seconds
        const interval = setInterval(updatePresence, 25000);

        return () => clearInterval(interval);
    }, [videoId, userId]);

    const formatCount = (count) => {
        if (count > 999) return `${(count / 1000).toFixed(1)}k`;
        return count;
    };

    return (
        <div className="inline-flex items-center gap-2 bg-zinc-900/90 dark:bg-zinc-900/95 border border-zinc-800 px-3 py-1.5 rounded-full shadow-xl backdrop-blur-sm">
            {/* Pulsing Red Live Indicator */}
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
            </span>

            {/* Count Display */}
            <p className="text-[11px] font-bold text-white tracking-widest uppercase">
                <span
                    className={`inline-block tabular-nums transition-transform duration-300 ${isAnimating ? "scale-125 text-red-400" : "scale-100"}`}
                >
                    {formatCount(viewers)}
                </span>
                <span className="ml-1.5 text-zinc-400 font-medium normal-case tracking-normal">
                    Watching Now
                </span>
            </p>
        </div>
    );
}
