"use client";

import React, { useState } from "react";
import Link from "next/link";
import { RoomConfig, PlayerStats } from "@/lib/entities/wordle.type";

interface WordleLobbyWaitingProps {
  config: RoomConfig;
  players: PlayerStats[];
  isHost: boolean;
  onStartMatch: () => void;
  onOpenSettings: () => void;
}

export function WordleLobbyWaiting({
  config,
  players,
  isHost,
  onStartMatch,
  onOpenSettings,
}: WordleLobbyWaitingProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/play?room=${encodeURIComponent(config.roomId)}${
        config.passkey ? `&passkey=${encodeURIComponent(config.passkey)}` : ""
      }`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-3 sm:p-6">
      <div className="neo-card w-full max-w-2xl bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] p-5 sm:p-8 space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b-3 border-black dark:border-white pb-4">
          <div>
            <div className="inline-flex items-center gap-2 neo-badge bg-yellow-300 text-black text-xs font-black rotate-[-1deg] mb-1">
              <span>🎮 Multiplayer Battle Room</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-black dark:text-white">
              Room Lobby
            </h2>
          </div>

          {/* Room Code & Copy */}
          <div className="flex items-center gap-2">
            <div className="rounded-2xl border-2.5 border-black dark:border-white bg-slate-100 dark:bg-slate-800 px-4 py-2 text-center shadow-[3px_3px_0px_#000]">
              <span className="text-[10px] font-black uppercase text-slate-600 dark:text-slate-300 block">
                Room Code
              </span>
              <span className="font-mono text-base font-black text-black dark:text-white tracking-widest">
                {config.roomId}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="neo-btn-secondary px-3.5 py-3 text-xs font-black flex items-center gap-1.5 shadow-[3px_3px_0px_#000]"
              title="Copy invite URL"
            >
              <span>{copied ? "✓ Copied!" : "📋 Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Passkey Info if Private */}
        {config.isPrivate && config.passkey ? (
          <div className="flex items-center justify-between rounded-2xl border-2.5 border-black dark:border-white bg-amber-100 dark:bg-slate-800 p-3 text-xs font-black text-black dark:text-white shadow-[3px_3px_0px_#000]">
            <div className="flex items-center gap-2">
              <span>🔒 Passkey Locked:</span>
              <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded-lg border-2 border-black">
                {config.passkey}
              </span>
            </div>
            <span className="neo-badge bg-emerald-300 text-black text-[10px]">Private Room</span>
          </div>
        ) : null}

        {/* Match Rules Summary Stickers */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-black dark:text-white block">
            Match Battle Rules
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-black">
            <div className="rounded-2xl border-2 border-black dark:border-white bg-yellow-100 dark:bg-slate-800 p-2.5 text-center shadow-[2.5px_2.5px_0px_#000]">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 block">Word Length</span>
              <span className="text-black dark:text-white text-sm font-black">{config.wordLength} Letters</span>
            </div>

            <div className="rounded-2xl border-2 border-black dark:border-white bg-pink-100 dark:bg-slate-800 p-2.5 text-center shadow-[2.5px_2.5px_0px_#000]">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 block">Guess Chances</span>
              <span className="text-black dark:text-white text-sm font-black">{config.maxChances} Tries</span>
            </div>

            <div className="rounded-2xl border-2 border-black dark:border-white bg-cyan-100 dark:bg-slate-800 p-2.5 text-center shadow-[2.5px_2.5px_0px_#000]">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 block">Turn Timer</span>
              <span className="text-black dark:text-white text-sm font-black">
                {config.timeLimitSeconds === 0 ? "Unlimited" : `${config.timeLimitSeconds}s`}
              </span>
            </div>

            <div className="rounded-2xl border-2 border-black dark:border-white bg-purple-100 dark:bg-slate-800 p-2.5 text-center shadow-[2.5px_2.5px_0px_#000]">
              <span className="text-[10px] text-slate-700 dark:text-slate-300 block">Rounds</span>
              <span className="text-black dark:text-white text-sm font-black">
                {config.totalRounds === 1 ? "1 Round" : `Best of ${config.totalRounds}`}
              </span>
            </div>
          </div>
        </div>

        {/* Player Roster */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black text-black dark:text-white">
            <span>👥 Connected Players ({players.length})</span>
            <span className="neo-badge bg-emerald-300 text-black text-[10px] py-0.5">
              <span className="size-2 rounded-full bg-emerald-600 animate-ping inline-block mr-1" />
              Live WebRTC Mesh
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-48 overflow-y-auto pr-1">
            {players.map((p, idx) => {
              const bgColors = [
                "bg-emerald-100 dark:bg-slate-800",
                "bg-cyan-100 dark:bg-slate-800",
                "bg-purple-100 dark:bg-slate-800",
                "bg-amber-100 dark:bg-slate-800",
                "bg-pink-100 dark:bg-slate-800",
              ];
              const cardBg = bgColors[idx % bgColors.length];

              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between rounded-2xl border-2 border-black dark:border-white ${cardBg} p-3 shadow-[2.5px_2.5px_0px_#000]`}
                >
                  <div className="flex items-center gap-2.5">
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="size-8 rounded-full border-2 border-black"
                      />
                    ) : (
                      <div className="size-8 rounded-full border-2 border-black bg-white dark:bg-slate-700 flex items-center justify-center font-black text-xs">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-black text-black dark:text-white flex items-center gap-1">
                        <span>{p.name}</span>
                        {p.isHost ? <span title="Host">👑</span> : null}
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300">
                        {p.id.startsWith("bot-") ? "AI Player" : "Human Player"}
                      </span>
                    </div>
                  </div>

                  <span className="neo-badge bg-emerald-300 text-black text-[10px] py-0.5">
                    Ready ✓
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t-2.5 border-black dark:border-white space-y-3">
          {isHost ? (
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onStartMatch}
                className="neo-btn-primary w-full py-4 text-sm font-black shadow-[4px_4px_0px_#000] text-center"
              >
                🚀 START MATCH FOR ALL PLAYERS →
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                className="neo-btn-cyan w-full sm:w-auto px-5 py-4 text-xs font-black whitespace-nowrap shadow-[3px_3px_0px_#000]"
              >
                ⚙️ Room Rules
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-black dark:border-white bg-yellow-100 dark:bg-slate-800 p-4 text-center space-y-1 shadow-[3px_3px_0px_#000]">
              <div className="flex items-center justify-center gap-2 text-sm font-black text-black dark:text-white">
                <span className="animate-spin text-lg">⏳</span>
                <span>Waiting for Host to start match...</span>
              </div>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                You will automatically jump into round 1 when the host starts.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-black pt-1">
            <Link
              href="/"
              className="neo-btn-pill px-4 py-1.5 text-xs font-black text-black dark:text-white hover:bg-red-100"
            >
              ← Leave Lobby
            </Link>

            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
              Fair WebRTC P2P Sync
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
