"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FuturisticBackdrop } from "@/components/molecules/FuturisticBackdrop/FuturisticBackdrop";
import { WordleSplashScreen } from "@/components/molecules/WordleSplashScreen/WordleSplashScreen";
import { WordleHeroPreview } from "./WordleHeroPreview";
import { WordleRoomCustomizer } from "./WordleRoomCustomizer";
import { WordleJoinRoomCard } from "./WordleJoinRoomCard";
import { DiscordButton } from "@/components/atoms/DiscordButton/DiscordButton";
import { useButtonStyles } from "@/components/atoms/Button/button.hooks";
import { signOutAction } from "@/lib/domain/actions/auth.actions";
import { PwaPanel } from "@/components/organisms/PwaPanel/PwaPanel";
import type { AuthSession } from "@/lib/entities/auth.type";

interface WordleLandingProps {
  session: AuthSession | null;
}

export function WordleLanding({ session }: WordleLandingProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [activeModal, setActiveModal] = useState<
    "builder" | "join" | "features" | "pwa" | null
  >(null);

  useEffect(() => {
    // Check if user already saw the splash screen in this tab session
    const hasSeen = typeof window !== "undefined" && sessionStorage.getItem("wordle_pro_splash_seen");
    if (hasSeen) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    try {
      sessionStorage.setItem("wordle_pro_splash_seen", "1");
    } catch {
      // ignore
    }
  };

  const primaryBtnClass = useButtonStyles("primary");
  const secondaryBtnClass = useButtonStyles("secondary");

  return (
    <>
      {/* 1. Cinematic Game Splash Screen on First Launch */}
      {showSplash ? (
        <WordleSplashScreen onFinish={handleSplashFinish} />
      ) : null}

      {/* 2. Main Game Menu Stage (Strictly 100dvh & Zero Page Scroll) */}
      <div className="relative h-screen w-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-surface font-(family-name:--font-comic-relief) flex flex-col justify-between p-3 sm:p-5 lg:p-6 select-none">
        <FuturisticBackdrop />

        {/* Top Header */}
        <header className="relative z-10 mx-auto w-full max-w-7xl flex items-center justify-between gap-3 border-b border-primary/10 pb-2.5">
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="flex gap-0.5 sm:gap-1">
              {["W", "O", "R", "D", "L", "E"].map((letter, i) => (
                <span
                  key={i}
                  className="flex size-7 sm:size-8 items-center justify-center rounded-lg bg-primary font-display text-xs sm:text-sm font-bold text-on-primary shadow-xs transition-transform group-hover:-translate-y-0.5"
                >
                  {letter}
                </span>
              ))}
            </div>
            <span className="flex items-center justify-center rounded-lg bg-secondary px-2 py-0.5 font-display text-xs sm:text-sm font-bold text-on-secondary shadow-xs">
              PRO
            </span>
          </Link>

          {/* WebRTC Live Sync Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>WebRTC P2P Ready</span>
          </div>

          {/* Auth Bar */}
          <div className="flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-xl bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="max-w-[110px] truncate">{session.user.name}</span>
                </div>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="rounded-xl bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-secondary hover:bg-secondary/10 transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/sign-in" className="inline-block">
                <DiscordButton className="py-1.5 px-3.5 text-xs font-bold">
                  Sign In
                </DiscordButton>
              </Link>
            )}
          </div>
        </header>

        {/* Center Stage: Title, Menu & Live Battle Preview */}
        <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 grid items-center gap-6 lg:grid-cols-[1.1fr_0.9fr] py-2 overflow-hidden">
          {/* Left Column: Hero Callout & Modal Menu */}
          <div className="space-y-3 sm:space-y-4">
            <div className="neo-badge bg-yellow-300 text-black text-xs font-extrabold rotate-[-1deg]">
              <span>🔥 Fair WebRTC Multiplayer Battle</span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight text-black dark:text-white">
              Guess Words. <br />
              <span className="inline-block bg-emerald-300 text-black px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_#000] rotate-1">
                Custom Rooms.
              </span>{" "}
              <br />
              Battle Friends & Bots.
            </h1>

            <p className="max-w-md text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
              Real-time WebRTC peer-to-peer guess sync, 4 to 8 letters, turn timers, customizable bot AI limits, and infinite seeded rounds.
            </p>

            {/* Quick Game Mode Badges */}
            <div className="flex flex-wrap gap-2 text-xs font-extrabold">
              <span className="neo-badge bg-cyan-300 text-black">
                🌐 WebRTC P2P
              </span>
              <span className="neo-badge bg-amber-300 text-black">
                🤖 Bot Limits
              </span>
              <span className="neo-badge bg-emerald-300 text-black">
                🔠 4-8 Letters
              </span>
              <span className="neo-badge bg-pink-300 text-black">
                🔑 Passkeys
              </span>
            </div>

            {/* Main Action Triggers */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {session ? (
                <Link
                  href="/play"
                  className="neo-btn-primary px-6 py-3 text-xs sm:text-sm font-extrabold shadow-[4px_4px_0px_#000]"
                >
                  🎮 Quick Match / Enter Lobby →
                </Link>
              ) : (
                <Link
                  href="/sign-in?callbackURL=/play"
                  className="neo-btn-primary px-6 py-3 text-xs sm:text-sm font-extrabold shadow-[4px_4px_0px_#000]"
                >
                  🔒 Sign In with Discord to Play →
                </Link>
              )}

              <button
                type="button"
                onClick={() => setActiveModal("join")}
                className="neo-btn-secondary px-5 py-3 text-xs sm:text-sm font-extrabold shadow-[4px_4px_0px_#000]"
              >
                🔑 Join Room
              </button>

              <button
                type="button"
                onClick={() => setActiveModal("builder")}
                className="neo-btn-cyan px-5 py-3 text-xs sm:text-sm font-extrabold shadow-[4px_4px_0px_#000]"
              >
                ⚙️ Custom Room & Bots
              </button>
            </div>
          </div>

          {/* Right Column: Hero Live Board Preview */}
          <div className="relative flex items-center justify-center">
            <WordleHeroPreview />
          </div>
        </main>

        {/* Bottom Status Bar */}
        <footer className="relative z-10 mx-auto w-full max-w-7xl flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-2 text-[11px] text-on-surface-muted">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-theme-studio"));
                }
              }}
              className="flex items-center gap-1 hover:text-primary transition-colors font-bold text-primary"
            >
              <span>🎨</span>
              <span>Theme & Glow Studio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("features")}
              className="hover:text-primary transition-colors font-bold"
            >
              ✨ Highlights & WebRTC
            </button>
            <button
              type="button"
              onClick={() => setActiveModal("pwa")}
              className="hover:text-primary transition-colors font-bold"
            >
              📱 Install App
            </button>
          </div>
          <p>© {new Date().getFullYear()} Wordle PRO. All rights reserved.</p>
        </footer>

        {/* Modal 1: Custom Room Builder & Bot Rules */}
        {activeModal === "builder" ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-3 right-3 z-20 flex size-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container-highest"
              >
                ✕
              </button>
              <WordleRoomCustomizer isAuthenticated={Boolean(session)} />
            </div>
          </div>
        ) : null}

        {/* Modal 2: Join Existing Match */}
        {activeModal === "join" ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-3 right-3 z-20 flex size-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container-highest"
              >
                ✕
              </button>
              <WordleJoinRoomCard isAuthenticated={Boolean(session)} />
            </div>
          </div>
        ) : null}

        {/* Modal 3: Game Features & WebRTC Rules */}
        {activeModal === "features" ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-150">
            <div className="comic-card relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl bg-surface-container-low/98 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between border-b-2 border-primary/20 pb-3">
                <div>
                  <h3 className="font-display text-lg font-extrabold text-on-surface">
                    Wordle PRO Engine Features
                  </h3>
                  <p className="text-[11px] text-on-surface-muted">
                    Fair multiplayer WebRTC mesh & anti-cheat mechanics
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex size-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container-highest"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                <div className="rounded-2xl border-2 border-primary/20 bg-surface-container-high/60 p-3.5 shadow-xs">
                  <span className="text-xl block mb-1">🌐</span>
                  <h4 className="font-display font-extrabold text-primary">WebRTC P2P DataChannels</h4>
                  <p className="mt-1 text-on-surface-muted">
                    Direct peer-to-peer data sync ensures real-time guess tile updates with zero latency.
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-secondary/20 bg-surface-container-high/60 p-3.5 shadow-xs">
                  <span className="text-xl block mb-1">🤖</span>
                  <h4 className="font-display font-extrabold text-secondary">Bot AI Limits & Options</h4>
                  <p className="mt-1 text-on-surface-muted">
                    Configure 0 to 4 bots, or set Bot Difficulty to Off for 100% human-only matches.
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-emerald-500/20 bg-surface-container-high/60 p-3.5 shadow-xs">
                  <span className="text-xl block mb-1">🔒</span>
                  <h4 className="font-display font-extrabold text-emerald-600 dark:text-emerald-400">Anti-Cheat Secret Words</h4>
                  <p className="mt-1 text-on-surface-muted">
                    Opponent guesses broadcast colored tile statuses only (🟩 🟨 ⬛), never revealing letters.
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-purple-500/20 bg-surface-container-high/60 p-3.5 shadow-xs">
                  <span className="text-xl block mb-1">🎲</span>
                  <h4 className="font-display font-extrabold text-purple-600 dark:text-purple-400">Synchronized Room Seeds</h4>
                  <p className="mt-1 text-on-surface-muted">
                    All players in the same room receive the exact same target word and letter sequence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Modal 4: Install PWA */}
        {activeModal === "pwa" ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-150">
            <div className="comic-card relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-surface-container-low/98 p-6 shadow-2xl backdrop-blur-xl">
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-3 right-3 z-20 flex size-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface hover:bg-surface-container-highest"
              >
                ✕
              </button>
              <PwaPanel />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export function WordleLandingFallback() {
  return (
    <div className="relative h-screen w-screen bg-surface flex items-center justify-center">
      <FuturisticBackdrop />
      <div className="h-10 w-40 animate-pulse rounded-lg bg-surface-container-low" />
    </div>
  );
}
