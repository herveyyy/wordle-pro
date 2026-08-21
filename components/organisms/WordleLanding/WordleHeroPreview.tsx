"use client";

import React, { useState } from "react";

export function WordleHeroPreview() {
  const [activeTab, setActiveTab] = useState<"game" | "room">("game");

  return (
    <div className="futuristic-frame relative w-full overflow-hidden rounded-3xl border border-primary/20 bg-surface-container-low/95 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      {/* Header Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-primary/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="flex size-3 rounded-full bg-red-400" />
          <span className="flex size-3 rounded-full bg-yellow-400" />
          <span className="flex size-3 rounded-full bg-emerald-400" />
          <div className="ml-2 flex items-center gap-2 rounded-lg bg-surface-container-high px-3 py-1 text-xs font-semibold text-primary">
            <span>🔒 Room #WORDLE-902</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("game")}
            className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === "game"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-high text-on-surface-muted hover:text-primary"
            }`}
          >
            Live Battle
          </button>
          <button
            onClick={() => setActiveTab("room")}
            className={`rounded-xl px-3 py-1 text-xs font-semibold transition-all ${
              activeTab === "room"
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-surface-container-high text-on-surface-muted hover:text-primary"
            }`}
          >
            Room Settings
          </button>
        </div>
      </div>

      {activeTab === "game" ? (
        <div className="space-y-6">
          {/* Game Status Bar */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-container-highest/60 p-3 text-center text-xs font-medium text-on-surface sm:text-sm">
            <div>
              <span className="text-on-surface-muted">Round:</span>{" "}
              <strong className="text-primary font-bold">2 / 3</strong>
            </div>
            <div>
              <span className="text-on-surface-muted">Length:</span>{" "}
              <strong className="text-secondary font-bold">6 Letters</strong>
            </div>
            <div>
              <span className="text-on-surface-muted">Time Left:</span>{" "}
              <strong className="text-emerald-600 font-bold">00:38</strong>
            </div>
          </div>

          {/* Letter Tiles Grid */}
          <div className="flex flex-col items-center gap-2.5 py-2">
            {/* Row 1 - Previous guess */}
            <div className="flex gap-2 sm:gap-2.5">
              {[
                { letter: "P", status: "correct" },
                { letter: "L", status: "present" },
                { letter: "A", status: "absent" },
                { letter: "N", status: "absent" },
                { letter: "E", status: "correct" },
                { letter: "T", status: "present" },
              ].map((tile, i) => (
                <div
                  key={i}
                  className={`flex size-11 items-center justify-center rounded-xl font-display text-xl font-bold uppercase transition-all duration-300 sm:size-13 sm:text-2xl shadow-sm ${
                    tile.status === "correct"
                      ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-105"
                      : tile.status === "present"
                        ? "bg-amber-500 text-white shadow-amber-500/30"
                        : "bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  {tile.letter}
                </div>
              ))}
            </div>

            {/* Row 2 - Winning Guess */}
            <div className="flex gap-2 sm:gap-2.5">
              {[
                { letter: "P", status: "correct" },
                { letter: "O", status: "correct" },
                { letter: "S", status: "correct" },
                { letter: "T", status: "correct" },
                { letter: "E", status: "correct" },
                { letter: "R", status: "correct" },
              ].map((tile, i) => (
                <div
                  key={i}
                  className="flex size-11 items-center justify-center rounded-xl bg-emerald-500 font-display text-xl font-bold uppercase text-white shadow-md shadow-emerald-500/40 transition-all duration-300 sm:size-13 sm:text-2xl animate-bounce"
                  style={{ animationDelay: `${i * 90}ms`, animationIterationCount: 2 }}
                >
                  {tile.letter}
                </div>
              ))}
            </div>

            {/* Row 3 - Empty slot */}
            <div className="flex gap-2 sm:gap-2.5 opacity-60">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex size-11 items-center justify-center rounded-xl border-2 border-dashed border-primary/30 bg-surface-container-high/40 sm:size-13"
                />
              ))}
            </div>
          </div>

          {/* Player Live Scoreboard */}
          <div className="flex items-center justify-between rounded-2xl bg-surface-container-highest/40 px-4 py-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-on-surface">Alex (You)</span>
              <span className="rounded bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800 text-[11px]">
                SOLVED +100pts
              </span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-muted">
              <span>Opponent: Guess 3/6...</span>
            </div>
          </div>
        </div>
      ) : (
        /* Room Settings Tab */
        <div className="space-y-4 py-2 text-sm">
          <div className="rounded-2xl bg-surface-container-highest/50 p-4">
            <h4 className="font-display font-semibold text-primary">Custom Room Rules</h4>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-surface-container-low p-2.5">
                <span className="text-on-surface-muted block">Word Length</span>
                <strong className="text-sm text-on-surface">4 — 8 Letters</strong>
              </div>
              <div className="rounded-xl bg-surface-container-low p-2.5">
                <span className="text-on-surface-muted block">Guess Chances</span>
                <strong className="text-sm text-on-surface">6 Guesses</strong>
              </div>
              <div className="rounded-xl bg-surface-container-low p-2.5">
                <span className="text-on-surface-muted block">Turn Time Limit</span>
                <strong className="text-sm text-on-surface">60 Seconds</strong>
              </div>
              <div className="rounded-xl bg-surface-container-low p-2.5">
                <span className="text-on-surface-muted block">Rounds per Match</span>
                <strong className="text-sm text-on-surface">Best of 3</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-primary/10 px-4 py-3 text-xs text-primary font-semibold">
            <span>✨ Powered by Open Dictionary API</span>
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] text-white">
              100,000+ Words
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
