"use client";

import React from "react";
import Link from "next/link";
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
    <header className="neo-card flex w-full items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5 shrink-0 bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff]">
      {/* Left: Brand & Room Tag */}
      <div className="flex items-center gap-2">
        <Link
          href="/"
          onClick={onExit}
          className="neo-btn-pill flex items-center gap-1.5 px-3 py-1 text-xs font-extrabold"
          title="Exit to Main Lobby"
        >
          <span>←</span>
          <span>Lobby</span>
        </Link>

        <div className="neo-badge bg-cyan-300 text-black text-xs font-extrabold">
          <span>{config.isPrivate ? "🔒" : "🌐"}</span>
          <span className="font-mono">#{config.roomId}</span>
          {config.passkey ? (
            <span className="hidden sm:inline-block bg-black text-white px-1.5 py-0.2 text-[10px] font-mono rounded-md">
              {config.passkey}
            </span>
          ) : null}
        </div>
      </div>

      {/* Middle: Game Specs & Round Stats */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Round Badge */}
        <div className="neo-badge bg-yellow-300 text-black text-xs font-extrabold">
          <span>R:</span>
          <span>
            {currentRound}/{config.totalRounds}
          </span>
        </div>

        {/* Word Length (Desktop/Tablet) */}
        <div className="hidden md:flex neo-badge bg-pink-300 text-black text-xs font-extrabold">
          <span>🔤 {config.wordLength}L</span>
        </div>

        {/* Countdown Timer */}
        <div
          className={`neo-badge text-xs font-mono font-extrabold transition-all ${
            isLowTime
              ? "bg-red-500 text-white animate-pulse shadow-[2px_2px_0px_#000000]"
              : "bg-white dark:bg-slate-800 text-black dark:text-white"
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
            className="lg:hidden neo-badge bg-emerald-300 text-black px-2.5 py-1 text-xs font-extrabold flex items-center gap-1"
            title="View Players"
          >
            <span>👥</span>
            <span>{playersCount}</span>
          </button>
        ) : null}

        <button
          type="button"
          onClick={onOpenSettings}
          className="neo-btn-secondary flex items-center gap-1 px-3 py-1 text-xs font-extrabold"
          title="Settings & Themes"
        >
          <span>⚙️</span>
          <span className="hidden sm:inline">Settings</span>
        </button>

        <button
          type="button"
          onClick={onNewGame}
          className="neo-btn-primary px-3 py-1 text-xs font-extrabold"
        >
          🔄 <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
}
