"use client";

import React from "react";
import { PlayerStats, TileStatus } from "@/lib/entities/wordle.type";

interface WordleSidebarProps {
  players: PlayerStats[];
  currentPlayerId: string;
  wordLength: number;
  maxChances: number;
}

export function WordleSidebar({
  players,
  currentPlayerId,
  wordLength,
  maxChances,
}: WordleSidebarProps) {
  const getMiniTileStyle = (status: TileStatus) => {
    switch (status) {
      case "correct":
        return "bg-emerald-400 border border-black shadow-[1px_1px_0px_#000]";
      case "present":
        return "bg-amber-300 border border-black shadow-[1px_1px_0px_#000]";
      case "absent":
        return "bg-slate-300 dark:bg-slate-700 border border-black/40 opacity-70";
      default:
        return "bg-white dark:bg-slate-800 border border-black/30";
    }
  };

  const PLAYER_THEMES = [
    { bg: "bg-emerald-100 dark:bg-emerald-950/40", badge: "bg-emerald-300 text-black", border: "border-black dark:border-white" },
    { bg: "bg-cyan-100 dark:bg-cyan-950/40", badge: "bg-cyan-300 text-black", border: "border-black dark:border-white" },
    { bg: "bg-purple-100 dark:bg-purple-950/40", badge: "bg-purple-300 text-black", border: "border-black dark:border-white" },
    { bg: "bg-amber-100 dark:bg-amber-950/40", badge: "bg-amber-300 text-black", border: "border-black dark:border-white" },
    { bg: "bg-rose-100 dark:bg-rose-950/40", badge: "bg-rose-300 text-black", border: "border-black dark:border-white" },
  ];

  return (
    <aside className="neo-card flex w-full h-full flex-col justify-between p-3.5 sm:p-4 shrink-0 overflow-hidden bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[4px_4px_0px_#000000] dark:shadow-[4px_4px_0px_#ffffff]">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-emerald-400 border border-black animate-pulse" />
          <h3 className="font-display text-xs sm:text-sm font-extrabold text-black dark:text-white">
            Room Players ({players.length})
          </h3>
        </div>
        <span className="neo-badge bg-yellow-300 text-black text-[10px] uppercase font-extrabold">
          Live Mesh
        </span>
      </div>

      {/* Players List with Smooth Scroll */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 my-2">
        {players.map((player, pIdx) => {
          const isYou = player.id === currentPlayerId;
          const cleanName = player.name.replace(/\s*\(You\)/gi, "").trim();
          const theme = PLAYER_THEMES[pIdx % PLAYER_THEMES.length];

          return (
            <div
              key={player.id}
              className={`rounded-2xl border-2.5 border-black dark:border-white p-2.5 sm:p-3 transition-all shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff] ${theme.bg}`}
            >
              {/* Player Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {player.avatar ? (
                    <img
                      src={player.avatar}
                      alt={cleanName}
                      className="size-8 shrink-0 rounded-xl object-cover border-2 border-black shadow-[1.5px_1.5px_0px_#000]"
                      width={32}
                      height={32}
                    />
                  ) : (
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-white text-black border-2 border-black shadow-[1.5px_1.5px_0px_#000] font-display text-xs font-extrabold">
                      {cleanName[0]?.toUpperCase() || "P"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="block truncate text-xs font-extrabold text-black dark:text-white">
                      {cleanName} {isYou ? "(You)" : ""}
                    </span>
                    <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-300">
                      {player.hasSolved
                        ? `Solved in ${player.solvedInRow || player.guesses.length} tries 🎉`
                        : `${player.guesses.length} of ${maxChances} guesses`}
                    </span>
                  </div>
                </div>

                {/* Score & Round Wins */}
                <div className="text-right shrink-0">
                  <span className="neo-badge bg-white dark:bg-slate-800 text-black dark:text-white text-[11px] font-extrabold block">
                    {player.score} pts
                  </span>
                  <span className="block text-[10px] font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                    {player.roundsWon} 🏆
                  </span>
                </div>
              </div>

              {/* Opponent & Player Mini Guesses Grid (Colored Papercut Tiles) */}
              <div className="flex flex-col items-center gap-0.5 sm:gap-1 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-black/30 p-1.5 shadow-inner">
                {Array.from({ length: maxChances }).map((_, rIndex) => {
                  const rowGuess = player.guesses[rIndex];
                  const hasGuessed = Boolean(rowGuess);
                  const miniSize =
                    maxChances >= 8 || wordLength >= 8
                      ? "size-2.5 sm:size-3 rounded-xs"
                      : "size-3 sm:size-3.5 rounded-xs";

                  return (
                    <div key={rIndex} className="flex gap-0.5 sm:gap-1">
                      {Array.from({ length: wordLength }).map((_, cIndex) => {
                        const status: TileStatus = hasGuessed
                          ? rowGuess[cIndex] || "absent"
                          : "empty";

                        return (
                          <div
                            key={cIndex}
                            className={`${miniSize} transition-all ${getMiniTileStyle(
                              status
                            )}`}
                            title={
                              hasGuessed
                                ? `Guess ${rIndex + 1}: ${status}`
                                : "Pending guess"
                            }
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>

              {/* Status Banner */}
              <div className="mt-1.5 text-center text-[10px] font-bold">
                {player.hasSolved ? (
                  <span className="text-emerald-800 dark:text-emerald-300 font-extrabold">
                    ✓ Word Solved!
                  </span>
                ) : (
                  <span className="text-slate-700 dark:text-slate-300">
                    {isYou ? "Your turn to guess" : "Thinking..."}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
