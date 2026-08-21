"use client";

import React, { useState } from "react";

export function WordleHeroPreview() {
  const [activeTab, setActiveTab] = useState<"game" | "room">("game");

  return (
    <div className="neo-card relative w-full overflow-hidden bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] p-5 sm:p-7">
      {/* Header Bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-black dark:border-white pb-3">
        <div className="flex items-center gap-2">
          <span className="size-3.5 rounded-full border-2 border-black bg-red-400 shadow-xs" />
          <span className="size-3.5 rounded-full border-2 border-black bg-yellow-400 shadow-xs" />
          <span className="size-3.5 rounded-full border-2 border-black bg-emerald-400 shadow-xs" />
          <div className="ml-2 neo-badge bg-yellow-300 text-black text-xs font-extrabold py-0.5">
            <span>🔒 Room #WORDLE-902</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab("game")}
            className={`neo-btn-pill px-3 py-1 text-xs font-extrabold ${
              activeTab === "game" ? "neo-btn-pill-active" : ""
            }`}
          >
            Live Battle
          </button>
          <button
            onClick={() => setActiveTab("room")}
            className={`neo-btn-pill px-3 py-1 text-xs font-extrabold ${
              activeTab === "room" ? "neo-btn-pill-active" : ""
            }`}
          >
            Room Settings
          </button>
        </div>
      </div>

      {activeTab === "game" ? (
        <div className="space-y-4">
          {/* Game Status Bar */}
          <div className="grid grid-cols-3 gap-2 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 p-2.5 text-center text-xs font-extrabold text-black dark:text-white shadow-[2px_2px_0px_#000]">
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-bold">Round:</span>{" "}
              <span className="neo-badge bg-emerald-300 text-black text-[10px] py-0.5 ml-1">2 / 3</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-bold">Length:</span>{" "}
              <span className="neo-badge bg-cyan-300 text-black text-[10px] py-0.5 ml-1">6 Letters</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 font-bold">Timer:</span>{" "}
              <span className="neo-badge bg-amber-300 text-black text-[10px] py-0.5 ml-1">00:38</span>
            </div>
          </div>

          {/* Letter Tiles Grid */}
          <div className="flex flex-col items-center gap-2 py-2">
            {/* Row 1 - Previous guess */}
            <div className="flex gap-2">
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
                  className={`flex size-10 sm:size-12 items-center justify-center rounded-xl font-display text-lg sm:text-xl font-extrabold uppercase border-2 border-black shadow-[2.5px_2.5px_0px_#000000] text-black ${
                    tile.status === "correct"
                      ? "bg-emerald-400"
                      : tile.status === "present"
                        ? "bg-amber-300"
                        : "bg-slate-200"
                  }`}
                >
                  {tile.letter}
                </div>
              ))}
            </div>

            {/* Row 2 - Winning Guess */}
            <div className="flex gap-2">
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
                  className="flex size-10 sm:size-12 items-center justify-center rounded-xl bg-emerald-400 font-display text-lg sm:text-xl font-extrabold uppercase text-black border-2 border-black shadow-[3px_3px_0px_#000000] animate-bounce"
                  style={{ animationDelay: `${i * 80}ms`, animationIterationCount: 2 }}
                >
                  {tile.letter}
                </div>
              ))}
            </div>

            {/* Row 3 - Empty slot */}
            <div className="flex gap-2 opacity-50">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex size-10 sm:size-12 items-center justify-center rounded-xl border-2 border-black bg-white dark:bg-slate-800 shadow-[2px_2px_0px_#000000]"
                />
              ))}
            </div>
          </div>

          {/* Player Live Scoreboard */}
          <div className="flex items-center justify-between rounded-2xl border-2 border-black dark:border-white bg-yellow-50 dark:bg-slate-800 px-3.5 py-2 text-xs font-extrabold text-black dark:text-white shadow-[2px_2px_0px_#000]">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500 border border-black animate-pulse" />
              <span>Alex (You)</span>
              <span className="neo-badge bg-emerald-300 text-black text-[10px] py-0.5">
                SOLVED +100pts
              </span>
            </div>
            <div className="text-slate-600 dark:text-slate-400 font-bold">
              <span>Opponent: Guess 3/6...</span>
            </div>
          </div>
        </div>
      ) : (
        /* Room Settings Tab */
        <div className="space-y-3 py-1 text-xs">
          <div className="rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800 p-3.5 shadow-[2px_2px_0px_#000]">
            <h4 className="font-display font-extrabold text-black dark:text-white text-sm">Custom Match Rules</h4>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                <span className="text-slate-600 font-bold block text-[10px]">Word Length</span>
                <strong className="text-xs">4 — 8 Letters</strong>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                <span className="text-slate-600 font-bold block text-[10px]">Guess Chances</span>
                <strong className="text-xs">6 Guesses</strong>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                <span className="text-slate-600 font-bold block text-[10px]">Turn Time Limit</span>
                <strong className="text-xs">60 Seconds</strong>
              </div>
              <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                <span className="text-slate-600 font-bold block text-[10px]">Rounds per Match</span>
                <strong className="text-xs">Best of 3</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border-2 border-black bg-emerald-100 p-2.5 text-xs text-black font-extrabold shadow-[2px_2px_0px_#000]">
            <span>✨ KushCreates Dictionary API</span>
            <span className="neo-badge bg-emerald-400 text-black text-[10px] py-0.5">
              100,000+ Words
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
