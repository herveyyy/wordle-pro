"use client";

import React, { useState, useEffect } from "react";

interface WordleSplashScreenProps {
  onFinish?: () => void;
  autoDismissMs?: number;
}

export function WordleSplashScreen({
  onFinish,
  autoDismissMs = 2200,
}: WordleSplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING GAME MATRIX...");
  const [isDismissing, setIsDismissing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / autoDismissMs) * 100));
      setProgress(pct);

      if (pct >= 25 && pct < 55) {
        setStatusText("ESTABLISHING WEBRTC P2P LOBBY MESH...");
      } else if (pct >= 55 && pct < 85) {
        setStatusText("SYNCING RANDOM-WORDS DICTIONARY SEED...");
      } else if (pct >= 85 && pct < 100) {
        setStatusText("DISCORD IDENTITY & GAME ENGINE READY...");
      } else if (pct >= 100) {
        setStatusText("WELCOME TO WORDLE PRO!");
        clearInterval(interval);
        handleDismiss();
      }
    }, 40);

    return () => {
      clearInterval(interval);
    };
  }, [autoDismissMs]);

  const handleDismiss = () => {
    setIsDismissing(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, 350);
  };

  if (!isVisible) return null;

  return (
    <div
      onClick={handleDismiss}
      style={{ backgroundColor: "var(--surface)" }}
      className={`fixed inset-0 z-[9999] flex h-screen w-screen h-[100dvh] max-h-[100dvh] cursor-pointer flex-col items-center justify-between overflow-hidden p-6 sm:p-10 select-none font-(family-name:--font-comic-relief) transition-all duration-350 ${
        isDismissing
          ? "opacity-0 pointer-events-none scale-105"
          : "opacity-100 scale-100"
      }`}
    >
      {/* Dynamic Background Glowing Light Orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="pulsing-orb-1 absolute -top-20 left-1/3 size-80 rounded-full bg-primary/30 blur-[80px]" />
        <div className="pulsing-orb-2 absolute -bottom-20 right-1/3 size-80 rounded-full bg-secondary/30 blur-[80px]" />
        <div className="futuristic-dots absolute inset-0 opacity-20" />
      </div>

      {/* Top Banner */}
      <div className="relative z-10 flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-surface-container-high px-3.5 py-1 text-[11px] font-bold text-primary shadow-xs">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>ARCADE SYSTEM 2.0</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleDismiss();
          }}
          className="rounded-full bg-surface-container-high px-3.5 py-1 text-xs font-bold text-on-surface-muted hover:text-on-surface hover:bg-surface-container-highest transition-colors shadow-xs"
        >
          SKIP ➔
        </button>
      </div>

      {/* Center Stage: Title Tiles & Loading Bar */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center">
        {/* Animated Letter Tiles */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
          {["W", "O", "R", "D", "L", "E"].map((letter, i) => (
            <div
              key={i}
              className="flex size-11 sm:size-14 md:size-16 items-center justify-center rounded-2xl border-2 border-primary bg-primary font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-on-primary shadow-lg shadow-primary/30 animate-in zoom-in-75 duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {letter}
            </div>
          ))}
          <div
            className="flex h-11 sm:h-14 md:h-16 items-center justify-center rounded-2xl border-2 border-secondary bg-secondary px-3 sm:px-4 font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-on-secondary shadow-lg shadow-secondary/30 animate-in zoom-in-75 duration-300"
            style={{ animationDelay: "650ms" }}
          >
            PRO
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="font-display text-base sm:text-xl font-bold tracking-wider text-on-surface">
            MULTIPLAYER WORD GUESSER
          </h2>
          <p className="font-mono text-[11px] sm:text-xs text-primary font-bold tracking-widest uppercase">
            {statusText}
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-60 sm:w-72 space-y-1.5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest p-0.5 border border-primary/20">
            <div
              className="h-full rounded-full bg-linear-to-r from-primary via-emerald-500 to-secondary transition-all duration-100 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono font-bold text-on-surface-muted">
            <span>WEBRTC MESH</span>
            <span>{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 text-center text-xs font-semibold text-on-surface-muted animate-pulse">
        Tap or click anywhere to launch
      </div>
    </div>
  );
}
