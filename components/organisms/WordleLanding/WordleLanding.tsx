"use client";

import React from "react";
import Link from "next/link";
import { FuturisticBackdrop } from "@/components/molecules/FuturisticBackdrop/FuturisticBackdrop";
import { WordleHeroPreview } from "./WordleHeroPreview";
import { WordleRoomCustomizer } from "./WordleRoomCustomizer";
import { DiscordButton } from "@/components/atoms/DiscordButton/DiscordButton";
import { useButtonStyles } from "@/components/atoms/Button/button.hooks";
import { signOutAction } from "@/lib/domain/actions/auth.actions";
import { PwaPanel } from "@/components/organisms/PwaPanel/PwaPanel";
import type { AuthSession } from "@/lib/entities/auth.type";

interface WordleLandingProps {
  session: AuthSession | null;
}

export function WordleLanding({ session }: WordleLandingProps) {
  const primaryBtnClass = useButtonStyles("primary");
  const secondaryBtnClass = useButtonStyles("secondary");

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface font-(family-name:--font-comic-relief)">
      <FuturisticBackdrop />

      {/* Main Container */}
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-6 py-6 md:px-12 md:py-10 lg:px-16">
        {/* Navigation Bar */}
        <nav className="mb-12 flex flex-wrap items-center justify-between gap-6 border-b border-primary/10 pb-6">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Wordle Pro Logo Letter Badges */}
            <div className="flex gap-1">
              {["W", "O", "R", "D", "L", "E"].map((letter, i) => (
                <span
                  key={i}
                  className="flex size-8 items-center justify-center rounded-lg bg-primary font-display text-sm font-bold text-on-primary shadow-xs transition-transform group-hover:-translate-y-0.5"
                >
                  {letter}
                </span>
              ))}
            </div>
            <span className="flex items-center justify-center rounded-lg bg-secondary px-2.5 py-1 font-display text-sm font-bold text-on-secondary shadow-xs">
              PRO
            </span>
          </Link>

          {/* Nav Actions / User Bar */}
          <div className="flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-2xl bg-surface-container-high px-4 py-2 text-xs font-semibold text-on-surface">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{session.user.name}</span>
                </div>
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="rounded-2xl bg-surface-container-high px-4 py-2 text-xs font-semibold text-secondary hover:bg-secondary/10 transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/sign-in" className="inline-block">
                <DiscordButton className="py-2.5 px-5 text-xs font-bold">
                  Sign in with Discord
                </DiscordButton>
              </Link>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] xl:gap-16 py-6 lg:py-12">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-secondary">
                <span>🔥 Next-Gen Word Guesser Battle</span>
              </div>

              <h1 className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-on-surface sm:text-5xl lg:text-6xl xl:text-[4rem]">
                Guess Words. <br />
                <span className="text-primary underline decoration-secondary decoration-wavy decoration-2">
                  Create Rooms.
                </span>{" "}
                <br />
                Battle Friends.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-on-surface-muted lg:text-lg">
                Not just standard 5 letters. Host customized rooms with passkeys, pick word lengths from 4 to 8 letters, set blitz time limits, and compete across multiple rounds with random words from open Wiki dictionaries.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2.5 text-xs font-bold">
              <span className="rounded-xl bg-surface-container-high px-3.5 py-2 text-primary">
                🔑 Passkey Rooms
              </span>
              <span className="rounded-xl bg-surface-container-high px-3.5 py-2 text-secondary">
                🔠 4-8 Letter Words
              </span>
              <span className="rounded-xl bg-surface-container-high px-3.5 py-2 text-emerald-700">
                ⏱️ Turn Timers
              </span>
              <span className="rounded-xl bg-surface-container-high px-3.5 py-2 text-primary">
                🏆 Multi-Round Battles
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/sign-in"
                className={`${primaryBtnClass} px-8 py-4 text-base font-bold shadow-lg shadow-primary/20 hover:scale-105`}
              >
                {session ? "Enter Game Lobby →" : "Create a Room Now →"}
              </Link>
              <a
                href="#room-builder"
                className={`${secondaryBtnClass} px-7 py-4 text-base font-bold`}
              >
                Explore Room Rules ↓
              </a>
            </div>
          </div>

          {/* Interactive Hero Preview */}
          <div className="relative">
            <WordleHeroPreview />
          </div>
        </section>

        {/* Room Builder Engine Section */}
        <section id="room-builder" className="mt-16 lg:mt-24">
          <WordleRoomCustomizer isAuthenticated={Boolean(session)} />
        </section>

        {/* Core Game Features Matrix */}
        <section className="mt-20 lg:mt-32">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-secondary">
              Game Highlights
            </span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-on-surface sm:text-4xl">
              Why Wordle PRO is Built Different
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-on-surface-muted sm:text-base">
              Say goodbye to one-word-a-day limits. Play infinite rounds with customized multiplayer battle settings.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="futuristic-frame rounded-2xl bg-surface-container-low/80 p-6 backdrop-blur-sm border border-primary/10 transition-transform hover:-translate-y-1">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                🔑
              </div>
              <h3 className="font-display text-lg font-bold text-primary">
                Custom Rooms & Passkeys
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                Create private lobbies with a custom passkey for your Discord squad or make public rooms for open matchmaking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="futuristic-frame rounded-2xl bg-surface-container-low/80 p-6 backdrop-blur-sm border border-primary/10 transition-transform hover:-translate-y-1">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary/10 text-2xl">
                🔤
              </div>
              <h3 className="font-display text-lg font-bold text-secondary">
                Variable Word Length (4-8)
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                Choose short 4-letter blitz puzzles or test your vocabulary with challenging 7 and 8-letter brainteasers.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="futuristic-frame rounded-2xl bg-surface-container-low/80 p-6 backdrop-blur-sm border border-primary/10 transition-transform hover:-translate-y-1">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-2xl">
                ⏱️
              </div>
              <h3 className="font-display text-lg font-bold text-emerald-700">
                Custom Timers & Guesses
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                Set turn clocks from 30 seconds to unlimited, and adjust guess chances from 4 up to 10 chances per round.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="futuristic-frame rounded-2xl bg-surface-container-low/80 p-6 backdrop-blur-sm border border-primary/10 transition-transform hover:-translate-y-1">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                📚
              </div>
              <h3 className="font-display text-lg font-bold text-primary">
                Open Wiki Dictionary API
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                Words are pulled randomly from vast open knowledge dictionaries with verified English vocabulary and definitions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="futuristic-frame rounded-2xl bg-surface-container-low/80 p-6 backdrop-blur-sm border border-primary/10 transition-transform hover:-translate-y-1">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#5865F2]/10 text-2xl">
                🎮
              </div>
              <h3 className="font-display text-lg font-bold text-[#5865F2]">
                Discord Identity Sync
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                Instant one-click sign in with your Discord account, syncing your avatar and gamer tag to all multiplayer lobbies.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="futuristic-frame rounded-2xl bg-surface-container-low/80 p-6 backdrop-blur-sm border border-primary/10 transition-transform hover:-translate-y-1">
              <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-amber-500/10 text-2xl">
                📱
              </div>
              <h3 className="font-display text-lg font-bold text-amber-700">
                PWA Desktop & Mobile App
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-muted">
                Install Wordle PRO directly onto your phone or desktop for an app-like, frameless, and ultra-fast gaming experience.
              </p>
            </div>
          </div>
        </section>

        {/* PWA Section */}
        <section className="mt-20 lg:mt-32">
          <div className="futuristic-frame rounded-3xl bg-surface-container-low/90 p-8 backdrop-blur-sm lg:p-12 border border-primary/15">
            <PwaPanel />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 border-t border-primary/10 py-8 text-center text-xs text-on-surface-muted lg:mt-32">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <Link href="/" className="hover:text-primary transition-colors font-semibold">
              Wordle PRO
            </Link>
            <Link href="/sign-in" className="hover:text-primary transition-colors font-semibold">
              Discord Sign In
            </Link>
            <Link href="/landing" className="hover:text-primary transition-colors font-semibold">
              Install App
            </Link>
          </div>
          <p>© {new Date().getFullYear()} Wordle PRO — The Multiplayer Word Guesser Game. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export function WordleLandingFallback() {
  return (
    <div className="relative min-h-screen bg-surface">
      <FuturisticBackdrop />
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-8 py-16">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-surface-container-low" />
        <div className="mt-16 grid gap-12 xl:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-surface-container-low" />
          <div className="h-72 animate-pulse rounded-2xl bg-surface-container-low" />
        </div>
      </div>
    </div>
  );
}
