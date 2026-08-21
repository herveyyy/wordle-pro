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
    <div className="w-full flex-1 flex items-center justify-center overflow-y-auto py-1 px-2">
      <div className="neo-card w-full max-w-xl bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] p-4 sm:p-6 space-y-3 sm:space-y-4 max-h-[calc(100dvh-5.5rem)] overflow-y-auto my-auto">
        {/* Top Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-2.5 border-black dark:border-white pb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 neo-badge bg-yellow-300 text-black text-[11px] font-black rotate-[-1deg] mb-0.5">
              <span>🎮 Multiplayer Battle Room</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white">
              Room Lobby
            </h2>
          </div>

          {/* Room Code & Copy */}
          <div className="flex items-center gap-2">
            <div className="rounded-xl border-2 border-black dark:border-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 text-center shadow-[2px_2px_0px_#000]">
              <span className="text-[9px] font-black uppercase text-slate-600 dark:text-slate-300 block leading-none">
                Code
              </span>
              <span className="font-mono text-sm font-black text-black dark:text-white tracking-wider">
                {config.roomId}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="neo-btn-secondary px-3 py-2 text-xs font-black flex items-center gap-1 shadow-[2.5px_2.5px_0px_#000]"
              title="Copy invite URL"
            >
              <span>{copied ? "✓ Copied!" : "📋 Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Passkey Info if Private */}
        {config.isPrivate && config.passkey ? (
          <div className="flex items-center justify-between rounded-xl border-2 border-black dark:border-white bg-amber-100 dark:bg-slate-800 p-2 text-xs font-black text-black dark:text-white shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2">
              <span>🔒 Passkey:</span>
              <span className="font-mono bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-black text-xs font-black">
                {config.passkey}
              </span>
            </div>
            <span className="neo-badge bg-emerald-300 text-black text-[10px] py-0.5">Private</span>
          </div>
        ) : null}

        {/* Match Rules Summary Stickers */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black uppercase text-black dark:text-white block">
            Match Rules
          </label>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-black">
            <div className="rounded-xl border-2 border-black dark:border-white bg-yellow-100 dark:bg-slate-800 p-1.5 text-center shadow-[2px_2px_0px_#000]">
              <span className="text-[9px] text-slate-700 dark:text-slate-300 block">Length</span>
              <span className="text-black dark:text-white text-xs font-black">{config.wordLength}L</span>
            </div>

            <div className="rounded-xl border-2 border-black dark:border-white bg-pink-100 dark:bg-slate-800 p-1.5 text-center shadow-[2px_2px_0px_#000]">
              <span className="text-[9px] text-slate-700 dark:text-slate-300 block">Chances</span>
              <span className="text-black dark:text-white text-xs font-black">{config.maxChances} Tries</span>
            </div>

            <div className="rounded-xl border-2 border-black dark:border-white bg-cyan-100 dark:bg-slate-800 p-1.5 text-center shadow-[2px_2px_0px_#000]">
              <span className="text-[9px] text-slate-700 dark:text-slate-300 block">Timer</span>
              <span className="text-black dark:text-white text-xs font-black">
                {config.timeLimitSeconds === 0 ? "∞" : `${config.timeLimitSeconds}s`}
              </span>
            </div>

            <div className="rounded-xl border-2 border-black dark:border-white bg-purple-100 dark:bg-slate-800 p-1.5 text-center shadow-[2px_2px_0px_#000]">
              <span className="text-[9px] text-slate-700 dark:text-slate-300 block">Rounds</span>
              <span className="text-black dark:text-white text-xs font-black">
                {config.totalRounds === 1 ? "1 Round" : `Best of ${config.totalRounds}`}
              </span>
            </div>
          </div>
        </div>

        {/* Player Roster */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-black text-black dark:text-white">
            <span>👥 Players In Lobby ({players.length})</span>
            <span className="neo-badge bg-emerald-300 text-black text-[9px] py-0.5">
              Live WebRTC Mesh
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-32 sm:max-h-36 overflow-y-auto pr-1">
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
                  className={`flex items-center justify-between rounded-xl border-2 border-black dark:border-white ${cardBg} p-2 shadow-[2px_2px_0px_#000]`}
                >
                  <div className="flex items-center gap-2">
                    {p.avatar ? (
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="size-7 rounded-full border-2 border-black"
                      />
                    ) : (
                      <div className="size-7 rounded-full border-2 border-black bg-white dark:bg-slate-700 flex items-center justify-center font-black text-[10px]">
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-black text-black dark:text-white flex items-center gap-1">
                        <span>{p.name}</span>
                        {p.isHost ? <span title="Host">👑</span> : null}
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-600 dark:text-slate-300">
                        {p.id.startsWith("bot-") ? "AI Player" : "Human Player"}
                      </span>
                    </div>
                  </div>

                  <span className="neo-badge bg-emerald-300 text-black text-[9px] py-0.5">
                    Ready ✓
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t-2 border-black dark:border-white space-y-2.5">
          {isHost ? (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={onStartMatch}
                className="neo-btn-primary w-full py-3 text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000] text-center"
              >
                🚀 START MATCH FOR ALL PLAYERS →
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                className="neo-btn-cyan w-full sm:w-auto px-4 py-3 text-xs font-black whitespace-nowrap shadow-[2.5px_2.5px_0px_#000]"
              >
                ⚙️ Rules
              </button>
            </div>
          ) : (
            <div className="rounded-xl border-2 border-black dark:border-white bg-yellow-100 dark:bg-slate-800 p-2.5 text-center space-y-0.5 shadow-[2.5px_2.5px_0px_#000]">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-black dark:text-white">
                <span className="animate-spin text-sm">⏳</span>
                <span>Waiting for Host to start match...</span>
              </div>
              <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                You will automatically jump into round 1 when the host starts.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between text-xs font-black">
            <Link
              href="/"
              className="neo-btn-pill px-3 py-1 text-[11px] font-black text-black dark:text-white hover:bg-red-100"
            >
              ← Leave Lobby
            </Link>

            <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
              Fair WebRTC P2P Sync
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
