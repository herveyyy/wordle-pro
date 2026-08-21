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
        return "bg-emerald-500 shadow-xs";
      case "present":
        return "bg-amber-500 shadow-xs";
      case "absent":
        return "bg-slate-400 dark:bg-slate-700 opacity-60";
      default:
        return "bg-surface-container-high/40 border border-primary/15";
    }
  };

  return (
    <aside className="futuristic-frame flex w-full flex-col gap-4 rounded-3xl border border-primary/20 bg-surface-container-low/95 p-4 shadow-xl backdrop-blur-xl lg:w-72 xl:w-80 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-primary/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-display text-sm font-bold text-on-surface">
            Room Players ({players.length})
          </h3>
        </div>
        <span className="rounded-lg bg-surface-container-high px-2 py-0.5 text-[10px] font-bold text-primary uppercase">
          Live Sync
        </span>
      </div>

      {/* Players List */}
      <div className="flex flex-col gap-3 overflow-y-auto max-h-[75vh] pr-1">
        {players.map((player) => {
          const isYou = player.id === currentPlayerId;

          return (
            <div
              key={player.id}
              className={`rounded-2xl border p-3 transition-all ${
                isYou
                  ? "border-primary/40 bg-primary/5 shadow-sm"
                  : "border-primary/10 bg-surface-container-high/40"
              }`}
            >
              {/* Player Header */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-primary/15 font-display text-xs font-bold text-primary">
                    {player.name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate text-xs font-bold text-on-surface">
                      {player.name} {isYou ? "(You)" : ""}
                    </span>
                    <span className="block text-[10px] text-on-surface-muted">
                      {player.hasSolved
                        ? `Solved in ${player.solvedInRow || player.guesses.length} tries 🎉`
                        : `${player.guesses.length} of ${maxChances} guesses`}
                    </span>
                  </div>
                </div>

                {/* Score & Round Wins */}
                <div className="text-right shrink-0">
                  <span className="block text-xs font-extrabold text-primary">
                    {player.score} pts
                  </span>
                  <span className="block text-[10px] font-bold text-secondary">
                    {player.roundsWon} 🏆
                  </span>
                </div>
              </div>

              {/* Opponent & Player Mini Guesses Grid (Colors Only, NO LETTERS!) */}
              <div className="flex flex-col items-center gap-1 rounded-xl bg-surface-container-highest/40 p-2">
                {Array.from({ length: maxChances }).map((_, rIndex) => {
                  const rowGuess = player.guesses[rIndex];
                  const hasGuessed = Boolean(rowGuess);

                  return (
                    <div key={rIndex} className="flex gap-1">
                      {Array.from({ length: wordLength }).map((_, cIndex) => {
                        const status: TileStatus = hasGuessed
                          ? rowGuess[cIndex] || "absent"
                          : "empty";

                        return (
                          <div
                            key={cIndex}
                            className={`size-4 sm:size-4.5 rounded-md transition-all ${getMiniTileStyle(
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
              <div className="mt-2 text-center text-[10px] font-semibold">
                {player.hasSolved ? (
                  <span className="text-emerald-800 dark:text-emerald-400 font-bold">
                    ✓ Word Solved!
                  </span>
                ) : (
                  <span className="text-on-surface-muted">
                    {isYou ? "Your turn to guess" : "Waiting for next guess..."}
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
