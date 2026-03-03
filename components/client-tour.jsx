"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import {
    Library,
    Search,
    Layers,
    MessageSquare,
    BookOpen,
    Paperclip,
    ArrowRight,
    X,
} from "lucide-react";

// ─── Feature highlights shown in the welcome modal ───────────────────────────
const FEATURES = [
    {
        icon: Search,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        label: "Smart Search",
        desc: "Find educational videos across YouTube and more",
    },
    {
        icon: Layers,
        color: "text-violet-500",
        bg: "bg-violet-500/10",
        label: "Multi-Platform",
        desc: "YouTube, Udemy, Coursera — all in one feed",
    },
    {
        icon: MessageSquare,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        label: "AI Study Chat",
        desc: "Ask anything about any video with Groq AI",
    },
    {
        icon: Paperclip,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        label: "Shared Notes",
        desc: "Attach notes to videos and help the community",
    },
];

// ─── Check if user just signed up (within last 10 minutes) ────────────────────
function isNewUser(user) {
    if (!user?.createdAt) return false;
    const createdAt = new Date(user.createdAt).getTime();
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    return now - createdAt < tenMinutes;
}

// ─── Welcome Modal ────────────────────────────────────────────────────────────
function WelcomeModal({ userName, onStart }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 300);
        return () => clearTimeout(t);
    }, []);

    const handleStart = () => {
        setVisible(false);
        setTimeout(onStart, 400);
    };

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-500 ${visible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
        >
            <div
                className={`relative w-full max-w-lg bg-background border border-border/60 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                    }`}
            >
                {/* ── Top accent bar ── */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />

                {/* ── Brand header ── */}
                <div className="flex flex-col items-center pt-10 pb-6 px-8">
                    <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 shadow-inner">
                        <Library className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground mb-1">
                        Welcome to
                    </p>
                    <h2 className="text-3xl font-black tracking-tight text-foreground">
                        Library
                    </h2>
                    <p className="mt-3 text-center text-muted-foreground text-sm leading-relaxed max-w-xs">
                        {userName ? (
                            <>
                                Hey <span className="font-semibold text-foreground">{userName.split(" ")[0]}</span>! 👋 Your smart learning hub is ready.
                            </>
                        ) : (
                            "Your all-in-one smart learning hub. Let's show you around!"
                        )}
                    </p>
                </div>

                {/* ── Feature grid ── */}
                <div className="grid grid-cols-2 gap-3 px-8 pb-6">
                    {FEATURES.map(({ icon: Icon, color, bg, label, desc }) => (
                        <div
                            key={label}
                            className="flex items-start gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/40 hover:border-border/80 transition-colors"
                        >
                            <span className={`flex-shrink-0 p-2 rounded-xl ${bg}`}>
                                <Icon className={`w-4 h-4 ${color}`} />
                            </span>
                            <div>
                                <p className="text-xs font-bold text-foreground leading-none mb-0.5">{label}</p>
                                <p className="text-[11px] text-muted-foreground leading-tight">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA ── */}
                <div className="px-8 pb-8 flex flex-col gap-2">
                    <button
                        onClick={handleStart}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20"
                    >
                        Take a Quick Tour
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => { setVisible(false); setTimeout(onStart, 400); }}
                        className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Skip for now
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Tour Component ──────────────────────────────────────────────────────
export function ClientTour() {
    const { user, isLoaded } = useUser();
    const pathname = usePathname();

    // Joyride lazy-loaded (SSR-safe)
    const [Joyride, setJoyride] = useState(null);
    const [STATUS, setSTATUS] = useState(null);

    // Which phase we're in
    const [showWelcome, setShowWelcome] = useState(false);
    const [runHomeTour, setRunHomeTour] = useState(false);
    const [runVideoTour, setRunVideoTour] = useState(false);

    useEffect(() => {
        import("react-joyride").then((mod) => {
            setJoyride(() => mod.default);
            setSTATUS(mod.STATUS);
        });
    }, []);

    // ── Determine which tour to show ──────────────────────────────────────────
    useEffect(() => {
        if (!isLoaded || !user) return;

        // Already completed the full tour — never show again
        const hasFinishedTour = user.publicMetadata?.hasFinishedTour;
        if (hasFinishedTour) return;

        // Only trigger for brand-new signups (within last 10 min) or users mid-tour
        const homeTourDone = localStorage.getItem("lib_home_tour_done") === "1";
        const freshSignup = isNewUser(user);

        // Phase A: Home page welcome + tour (only for fresh signups who haven't done it)
        if (pathname === "/home" && !homeTourDone && freshSignup) {
            const t = setTimeout(() => setShowWelcome(true), 1200);
            return () => clearTimeout(t);
        }

        // Phase B: Video page tour (only if home tour is done — they're mid-tour flow)
        if (pathname?.includes("/video/") && homeTourDone && Joyride) {
            const t = setTimeout(() => setRunVideoTour(true), 2500);
            return () => clearTimeout(t);
        }
    }, [isLoaded, user, pathname, Joyride]);

    // ── Called when user clicks "Start Tour" in welcome modal ─────────────────
    const handleWelcomeStart = () => {
        setShowWelcome(false);
        if (Joyride) {
            setTimeout(() => setRunHomeTour(true), 600);
        } else {
            // Joyride not yet loaded — just mark home as done
            localStorage.setItem("lib_home_tour_done", "1");
        }
    };

    // ── Joyride callbacks ─────────────────────────────────────────────────────
    const handleHomeTourCallback = (data) => {
        if (!STATUS) return;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
            setRunHomeTour(false);
            localStorage.setItem("lib_home_tour_done", "1");
        }
    };

    const handleVideoTourCallback = async (data) => {
        if (!STATUS) return;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(data.status)) {
            setRunVideoTour(false);
            try {
                await fetch("/api/user/complete-tour", { method: "POST" });
            } catch (e) {
                console.error("Failed to persist tour completion", e);
            }
        }
    };

    // ── Tour steps ────────────────────────────────────────────────────────────
    const homeSteps = [
        {
            target: ".tour-search",
            content: (
                <div>
                    <p className="font-bold text-base mb-1">Search Anything</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Type any topic — Python, design, finance — and get curated educational
                        videos. Our AI filters out non-educational content automatically.
                    </p>
                </div>
            ),
            disableBeacon: true,
            placement: "bottom",
        },
        {
            target: ".tour-platform-tag",
            content: (
                <div>
                    <p className="font-bold text-base mb-1">Platform Source Icon</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        This badge shows where the video comes from — YouTube, Udemy, Coursera
                        and more. Library unifies learning content from every major platform.
                    </p>
                </div>
            ),
            placement: "top",
        },
    ];

    const videoSteps = [
        {
            target: ".tour-ask-ai",
            content: (
                <div>
                    <p className="font-bold text-base mb-1">Ask AI Anything</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Powered by Groq AI. Ask any question about this video and get
                        answers grounded in the actual transcript — no hallucinations.
                    </p>
                </div>
            ),
            disableBeacon: true,
            placement: "bottom",
        },
        {
            target: ".tour-library-management",
            content: (
                <div>
                    <p className="font-bold text-base mb-1">Your Notes Library</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        View and manage all notes you&apos;ve saved for this video. Notes are
                        synced from Google Drive and organized by video.
                    </p>
                </div>
            ),
            placement: "bottom",
        },
        {
            target: ".tour-attach-note",
            content: (
                <div>
                    <p className="font-bold text-base mb-1">Attach Your Notes</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Upload your study notes here. On first use, you&apos;ll be asked to{" "}
                        <strong>grant Google Drive access</strong> — this is a one-time
                        consent so Library can securely store your file and share the link
                        with fellow learners. We only request permission to upload, nothing
                        else.
                    </p>
                </div>
            ),
            placement: "left",
        },
    ];

    const joyrideStyles = {
        options: {
            primaryColor: "hsl(var(--primary))",
            textColor: "hsl(var(--foreground))",
            backgroundColor: "hsl(var(--background))",
            arrowColor: "hsl(var(--background))",
            overlayColor: "rgba(0,0,0,0.55)",
            zIndex: 10000,
        },
        buttonNext: {
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            borderRadius: "8px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 700,
        },
        buttonBack: {
            color: "hsl(var(--muted-foreground))",
            marginRight: "8px",
            fontSize: "13px",
        },
        buttonSkip: {
            color: "hsl(var(--muted-foreground))",
            fontSize: "12px",
        },
        tooltip: {
            borderRadius: "16px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            padding: "20px 24px",
            maxWidth: "320px",
        },
        tooltipTitle: {
            fontSize: "15px",
            fontWeight: 700,
        },
    };

    return (
        <>
            {/* Welcome modal — shown once on /home for brand-new signups */}
            {showWelcome && (
                <WelcomeModal
                    userName={user?.fullName || user?.firstName || ""}
                    onStart={handleWelcomeStart}
                />
            )}

            {/* Phase A — Home page tour */}
            {Joyride && runHomeTour && (
                <Joyride
                    steps={homeSteps}
                    run={runHomeTour}
                    continuous
                    showProgress
                    showSkipButton
                    disableOverlayClose
                    spotlightClicks
                    callback={handleHomeTourCallback}
                    styles={joyrideStyles}
                />
            )}

            {/* Phase B — Video page tour */}
            {Joyride && runVideoTour && (
                <Joyride
                    steps={videoSteps}
                    run={runVideoTour}
                    continuous
                    showProgress
                    showSkipButton
                    disableOverlayClose
                    spotlightClicks
                    callback={handleVideoTourCallback}
                    styles={joyrideStyles}
                />
            )}
        </>
    );
}
