"use client";

import React from "react";
import { PlayerStats, RoomConfig } from "@/lib/entities/wordle.type";

interface WordleGameOverModalProps {
  status: "round_won" | "round_lost" | "match_finished";
  targetWord: string;
  targetDefinition?: string;
  currentRound: number;
  config: RoomConfig;
  players: PlayerStats[];
  onNextRound: () => void;
  onNewMatch: () => void;
}

export function WordleGameOverModal({
  status,
  targetWord,
  targetDefinition,
  currentRound,
  config,
  players,
  onNextRound,
  onNewMatch,
}: WordleGameOverModalProps) {
  const isMatchEnd = status === "match_finished" || currentRound >= config.totalRounds;
  const isWon = status === "round_won";

  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="futuristic-frame w-full max-w-lg overflow-hidden rounded-3xl border border-primary/30 bg-surface-container-lowest/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-center">
        {/* Banner */}
        <div className="mb-4">
          <span className="text-4xl sm:text-5xl block mb-2">
            {isMatchEnd
              ? winner?.id === players[0]?.id
                ? "🏆"
                : "👑"
              : isWon
                ? "🎉"
                : "💔"}
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-on-surface">
            {isMatchEnd
              ? "Match Complete!"
              : isWon
                ? "Round Won!"
                : "Round Over!"}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-on-surface-muted">
            {isMatchEnd
              ? `Winner: ${winner?.name} with ${winner?.score} points!`
              : `Round ${currentRound} of ${config.totalRounds}`}
          </p>
        </div>

        {/* Revealed Word */}
        <div className="my-5 rounded-2xl bg-surface-container-high/60 p-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-muted block mb-1">
            Target Word
          </span>
          <div className="flex justify-center gap-1.5 my-2">
            {targetWord.split("").map((letter, i) => (
              <span
                key={i}
                className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 font-display text-xl font-bold uppercase text-white shadow-sm"
              >
                {letter}
              </span>
            ))}
          </div>

          {targetDefinition ? (
            <p className="mt-2 text-xs italic text-on-surface-muted">
              "{targetDefinition}"
            </p>
          ) : null}
        </div>

        {/* Players Standings */}
        <div className="my-5 space-y-2 text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-on-surface-muted block mb-2">
            Room Standings
          </span>
          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {sortedPlayers.map((p, index) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-surface-container-high/40 px-3.5 py-2 text-xs font-semibold text-on-surface"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-primary font-bold">#{index + 1}</span>
                  <span>{p.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-secondary font-bold">{p.roundsWon} wins</span>
                  <span className="font-extrabold text-primary">{p.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {!isMatchEnd && (status === "round_won" || status === "round_lost") ? (
            <button
              type="button"
              onClick={onNextRound}
              className="w-full sm:w-auto rounded-2xl bg-primary px-8 py-3 font-display text-sm font-bold text-on-primary shadow-lg shadow-primary/25 hover:bg-primary-container transition-all"
            >
              Next Round ({currentRound + 1}/{config.totalRounds}) →
            </button>
          ) : null}

          <button
            type="button"
            onClick={onNewMatch}
            className="w-full sm:w-auto rounded-2xl bg-surface-container-high px-8 py-3 font-display text-sm font-bold text-on-surface hover:bg-surface-container-highest transition-all"
          >
            {isMatchEnd ? "Start New Match" : "Restart Game"}
          </button>
        </div>
      </div>
    </div>
  );
}
