"use client";

import React from "react";
import { RoomConfig } from "@/lib/entities/wordle.type";

interface WordleToolbarProps {
  config: RoomConfig;
  currentRound: number;
  timeLeft: number;
  playersCount?: number;
  onOpenSettings: () => void;
  onNewGame: () => void;
  onExit: () => void;
  onTogglePlayers?: () => void;
}

export function WordleToolbar({
  config,
  currentRound,
  timeLeft,
  playersCount = 3,
  onOpenSettings,
  onNewGame,
  onExit,
  onTogglePlayers,
}: WordleToolbarProps) {
  const formatTime = (seconds: number) => {
    if (config.timeLimitSeconds === 0) return "∞";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isLowTime = config.timeLimitSeconds > 0 && timeLeft <= 10;

  return (
    <header className="futuristic-frame flex w-full items-center justify-between gap-2 rounded-2xl border border-primary/20 bg-surface-container-low/95 px-3 py-2 sm:px-4 sm:py-3 shadow-md backdrop-blur-xl shrink-0">
      {/* Left: Brand & Room Tag */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1 rounded-xl bg-surface-container-high px-2.5 py-1 text-xs font-bold text-on-surface-muted hover:text-primary transition-colors"
          title="Exit to Main Lobby"
        >
          <span>←</span>
          <span className="hidden sm:inline">Lobby</span>
        </button>

        <div className="flex items-center gap-1.5 rounded-xl bg-surface-container-high px-2.5 py-1 text-xs font-semibold text-primary">
          <span>{config.isPrivate ? "🔒" : "🌐"}</span>
          <span className="font-mono font-bold">#{config.roomId}</span>
          {config.passkey ? (
            <span className="hidden sm:inline-block rounded bg-primary/15 px-1.5 py-0.2 text-[10px] font-mono text-primary font-bold">
              KEY: {config.passkey}
            </span>
          ) : null}
        </div>
      </div>

      {/* Middle: Game Specs & Round Stats */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Round Badge */}
        <div className="flex items-center gap-1 rounded-xl bg-surface-container-highest/60 px-2.5 py-1 text-xs font-bold text-on-surface">
          <span className="text-on-surface-muted">R:</span>
          <span className="font-display text-primary">
            {currentRound}/{config.totalRounds}
          </span>
        </div>

        {/* Word Length (Desktop/Tablet) */}
        <div className="hidden md:flex items-center gap-1 rounded-xl bg-surface-container-highest/60 px-2.5 py-1 text-xs font-bold text-secondary">
          <span>🔤 {config.wordLength}L</span>
        </div>

        {/* Countdown Timer */}
        <div
          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-mono font-extrabold transition-all ${
            isLowTime
              ? "bg-red-500 text-white animate-pulse shadow-sm shadow-red-500/40 scale-105"
              : "bg-surface-container-highest text-on-surface"
          }`}
        >
          <span>⏱️</span>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Mobile Players Drawer Button */}
        {onTogglePlayers ? (
          <button
            type="button"
            onClick={onTogglePlayers}
            className="lg:hidden rounded-xl bg-surface-container-high px-2.5 py-1 text-xs font-bold text-primary hover:bg-surface-container-highest transition-colors flex items-center gap-1"
            title="View Players"
          >
            <span>👥</span>
            <span>{playersCount}</span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={onOpenSettings}
          className="rounded-xl bg-surface-container-high px-2.5 py-1 text-xs font-bold text-on-surface hover:bg-surface-container-highest transition-colors"
          title="Room Rules & Settings"
        >
          ⚙️
        </button>

        <button
          type="button"
          onClick={onNewGame}
          className="rounded-xl bg-primary px-3 py-1 text-xs font-bold text-on-primary hover:bg-primary-container shadow-sm transition-all"
        >
          🔄 <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
