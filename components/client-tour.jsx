"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function ClientTour() {
    const { user, isLoaded } = useUser();
    const pathname = usePathname();
    const [run, setRun] = useState(false);
    const [Joyride, setJoyride] = useState(null);
    const [STATUS, setSTATUS] = useState(null);

    // Lazily import react-joyride client-side only to avoid SSR crashes
    useEffect(() => {
        import("react-joyride").then((mod) => {
            setJoyride(() => mod.default);
            setSTATUS(mod.STATUS);
        });
    }, []);

    useEffect(() => {
        if (!isLoaded || !user || !Joyride) return;
        if (!pathname?.includes("/video/")) return;
        const hasFinished = user.publicMetadata?.hasFinishedTour;
        if (!hasFinished) {
            const timer = setTimeout(() => setRun(true), 2500);
            return () => clearTimeout(timer);
        }
    }, [user, isLoaded, pathname, Joyride]);

    const handleCallback = async (data) => {
        if (!STATUS) return;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
            setRun(false);
            try {
                await fetch("/api/user/complete-tour", { method: "POST" });
            } catch (e) {
                console.error("Failed to persist tour completion", e);
            }
        }
    };

    const steps = [
        {
            target: ".tour-attach-note",
            content: "📎 Attach a Note: Click to upload your notes directly to Google Drive and link them to this video.",
            disableBeacon: true,
            placement: "left",
        },
        {
            target: ".tour-ask-ai",
            content: "🤖 Ask AI: Use the Gemini-powered Q&A to ask specific questions about this video's content.",
            placement: "bottom",
        },
        {
            target: ".tour-library-management",
            content: "📚 Notes Library: View and manage all your saved notes synced from Google Drive here.",
            placement: "bottom",
        },
        {
            target: ".tour-platform-tag",
            content: "🏷️ Platform Tag: This icon shows you the source platform (YouTube, Udemy, etc.) of the video.",
            placement: "top",
        },
    ];

    if (!Joyride || !run) return null;

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            disableOverlayClose
            spotlightClicks
            callback={handleCallback}
            styles={{
                options: {
                    primaryColor: "hsl(var(--primary))",
                    textColor: "hsl(var(--foreground))",
                    backgroundColor: "hsl(var(--background))",
                    arrowColor: "hsl(var(--background))",
                    overlayColor: "rgba(0,0,0,0.6)",
                    zIndex: 10000,
                },
                buttonNext: {
                    backgroundColor: "hsl(var(--primary))",
                    color: "hsl(var(--primary-foreground))",
                    borderRadius: "6px",
                    padding: "8px 16px",
                    fontSize: "13px",
                    fontWeight: 600,
                },
                buttonBack: {
                    color: "hsl(var(--muted-foreground))",
                    marginRight: "8px",
                },
                buttonSkip: {
                    color: "hsl(var(--muted-foreground))",
                },
                tooltip: {
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
                    padding: "16px 20px",
                },
            }}
        />
    );
}
