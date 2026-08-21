"use client";

import Link from "next/link";
import { Button } from "@/components/atoms/Button/Button";
import { useButtonStyles } from "@/components/atoms/Button/button.hooks";
import { StatusOrb } from "@/components/atoms/StatusOrb/StatusOrb";
import { FuturisticBackdrop } from "@/components/molecules/FuturisticBackdrop/FuturisticBackdrop";
import { usePwaPanel } from "@/components/organisms/PwaPanel/pwaPanel.hooks";

export function InstallLanding() {
  const pwa = usePwaPanel();
  const { isStandalone, isIOS, canInstall, installOutcome, installApp } = pwa;
  const secondaryLinkClass = useButtonStyles("secondary");

  const statusVariant = isStandalone ? "complete" : canInstall ? "progress" : "neutral";
  const statusLabel = isStandalone
    ? "Installed"
    : canInstall
      ? "Ready to install"
      : isIOS
        ? "Add via Share menu"
        : "Install available";

  return (
    <div className="relative h-screen w-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-surface flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-(family-name:--font-comic-relief) select-none">
      <FuturisticBackdrop />

      {/* Header */}
      <header className="relative z-10 mx-auto w-full max-w-5xl flex items-center justify-between border-b border-primary/10 pb-3">
        <Link
          href="/"
          className="text-xs sm:text-sm font-bold text-on-surface-muted hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span>←</span> Back to Game
        </Link>
        <StatusOrb label={statusLabel} variant={statusVariant} />
      </header>

      {/* Main Content Stage */}
      <main className="relative z-10 mx-auto w-full max-w-5xl flex-1 grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr] py-4">
        <div className="space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
            <span>📱 Desktop & Mobile PWA</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] text-on-surface">
            Install <br />
            <span className="text-primary underline decoration-secondary decoration-wavy decoration-2">
              Wordle PRO
            </span>
          </h1>

          <p className="max-w-lg text-xs sm:text-sm text-on-surface-muted leading-relaxed">
            Play Wordle PRO directly from your desktop or phone home screen with zero browser tabs, instant load times, and custom room lobbies.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {isStandalone ? (
              <Button variant="success" disabled className="px-6 py-2.5 text-xs font-bold">
                ✓ Already Installed
              </Button>
            ) : canInstall ? (
              <Button onClick={installApp} className="px-6 py-2.5 text-xs font-bold">
                Install App Now →
              </Button>
            ) : (
              <Button variant="secondary" disabled className="px-6 py-2.5 text-xs font-bold">
                {isIOS ? "Share → Add to Home Screen" : "Ready in Browser"}
              </Button>
            )}
            <Link href="/" className={`${secondaryLinkClass} px-5 py-2.5 text-xs font-bold`}>
              Play in Browser
            </Link>
          </div>

          {installOutcome === "dismissed" ? (
            <p className="text-xs text-on-surface-muted">
              Install prompt dismissed — you can install anytime via your browser address bar.
            </p>
          ) : null}

          {isIOS ? (
            <div className="rounded-2xl bg-surface-container-high/60 p-3 text-xs">
              <strong className="text-primary block mb-0.5">iPhone / iPad Tip:</strong>
              Tap the <span className="font-bold">Share</span> icon in Safari, then select <span className="font-bold text-on-surface">"Add to Home Screen"</span>.
            </div>
          ) : null}
        </div>

        {/* Feature Highlights Card */}
        <div className="futuristic-frame rounded-3xl border border-primary/20 bg-surface-container-low/95 p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-3 border-b border-primary/10 pb-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/15 font-display text-lg font-bold text-primary">
              W
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-on-surface">Wordle PRO Standalone</h3>
              <span className="text-[11px] text-on-surface-muted">Frameless PWA Window</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-surface-container-high/50 p-3">
              <span className="text-on-surface-muted block text-[10px] uppercase font-bold">Performance</span>
              <span className="font-bold text-primary">Instant Launch</span>
            </div>
            <div className="rounded-xl bg-surface-container-high/50 p-3">
              <span className="text-on-surface-muted block text-[10px] uppercase font-bold">Identity</span>
              <span className="font-bold text-secondary">Discord Linked</span>
            </div>
            <div className="rounded-xl bg-surface-container-high/50 p-3">
              <span className="text-on-surface-muted block text-[10px] uppercase font-bold">Dictionary</span>
              <span className="font-bold text-on-surface">Wiki Synchronized</span>
            </div>
            <div className="rounded-xl bg-surface-container-high/50 p-3">
              <span className="text-on-surface-muted block text-[10px] uppercase font-bold">Rooms</span>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">4-8 Letter Puzzles</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto w-full max-w-5xl flex items-center justify-between border-t border-primary/10 pt-3 text-[11px] text-on-surface-muted">
        <span>© {new Date().getFullYear()} Wordle PRO</span>
        <Link href="/play" className="hover:text-primary transition-colors font-bold">
          Enter Game Lobby →
        </Link>
      </footer>
    </div>
  );
}

export function InstallLandingFallback() {
  return (
    <div className="relative h-screen w-screen bg-surface flex items-center justify-center">
      <FuturisticBackdrop />
      <div className="h-12 w-48 animate-pulse rounded-2xl bg-surface-container-high" />
    </div>
  );
}
