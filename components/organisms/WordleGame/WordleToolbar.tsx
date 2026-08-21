"use client";

import React from "react";
import { RoomConfig } from "@/lib/entities/wordle.type";

interface WordleToolbarProps {
  config: RoomConfig;
  currentRound: number;
  timeLeft: number;
  onOpenSettings: () => void;
  onNewGame: () => void;
  onExit: () => void;
}

export function WordleToolbar({
  config,
  currentRound,
  timeLeft,
  onOpenSettings,
  onNewGame,
  onExit,
}: WordleToolbarProps) {
  const formatTime = (seconds: number) => {
    if (config.timeLimitSeconds === 0) return "∞";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = config.timeLimitSeconds > 0 && timeLeft <= 10;

  return (
    <header className="futuristic-frame flex w-full flex-wrap items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-surface-container-low/95 p-4 shadow-lg backdrop-blur-xl">
      {/* Left: Brand & Room Tag */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1.5 rounded-2xl bg-surface-container-high px-3 py-1.5 text-xs font-bold text-on-surface-muted hover:text-primary transition-colors"
          title="Exit to Main Lobby"
        >
          <span>←</span>
          <span className="hidden sm:inline">Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {["W", "P"].map((l, i) => (
              <span
                key={i}
                className="flex size-6 items-center justify-center rounded-md bg-primary font-display text-xs font-bold text-on-primary"
              >
                {l}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 rounded-xl bg-surface-container-high px-3 py-1 text-xs font-semibold text-primary">
            <span>{config.isPrivate ? "🔒" : "🌐"}</span>
            <span className="font-mono font-bold">#{config.roomId}</span>
            {config.passkey ? (
              <span className="rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-mono text-primary font-bold">
                KEY: {config.passkey}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Middle: Game Specs & Round Stats */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Round Badge */}
        <div className="flex items-center gap-1.5 rounded-2xl bg-surface-container-highest/60 px-3.5 py-1.5 text-xs font-bold text-on-surface">
          <span className="text-on-surface-muted">Round:</span>
          <span className="font-display text-primary">
            {currentRound} / {config.totalRounds}
          </span>
        </div>

        {/* Word Length */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-2xl bg-surface-container-highest/60 px-3 py-1.5 text-xs font-bold text-secondary">
          <span>🔤 {config.wordLength} Letters</span>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-2 rounded-2xl px-3.5 py-1.5 text-xs font-mono font-extrabold transition-all ${
            isLowTime
              ? "bg-red-500 text-white animate-pulse shadow-md shadow-red-500/40 scale-105"
              : "bg-surface-container-highest text-on-surface"
          }`}
        >
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-2xl bg-surface-container-high px-3 py-1.5 text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-colors"
          title="Room Rules & Settings"
        >
          ⚙️ <span className="hidden md:inline">Rules</span>
        </button>

        <button
          type="button"
          onClick={onNewGame}
          className="rounded-2xl bg-primary px-3.5 py-1.5 text-xs font-bold text-on-primary hover:bg-primary-container shadow-sm transition-all"
        >
          🔄 Restart
        </button>
      </div>
    </header>
  );
}
