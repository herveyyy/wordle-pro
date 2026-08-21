"use client";

import React, { useState } from "react";
import Link from "next/link";

export function WordleRoomCustomizer({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [letters, setLetters] = useState<number>(5);
  const [timer, setTimer] = useState<string>("60s");
  const [chances, setChances] = useState<number>(6);
  const [rounds, setRounds] = useState<number>(3);
  const [bots, setBots] = useState<number>(2);
  const [botDiff, setBotDiff] = useState<string>("medium");
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [passkey, setPasskey] = useState<string>("PRO777");

  return (
    <div className="neo-card relative w-full overflow-hidden bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] p-5 sm:p-7">
      {/* Header Banner */}
      <div className="mb-5 flex flex-col gap-2 border-b-2 border-black dark:border-white pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="neo-badge bg-yellow-300 text-black text-xs font-extrabold rotate-[-1deg]">
            🎮 Room Builder Engine
          </span>
          <h3 className="font-display text-xl font-extrabold text-black dark:text-white sm:text-2xl mt-1">
            Custom Match Rules
          </h3>
        </div>
        <div className="neo-badge bg-emerald-300 text-black text-xs font-extrabold">
          <span className="size-2.5 rounded-full bg-emerald-600 animate-ping" />
          <span>WebRTC P2P Sync</span>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Letter Length */}
        <div className="space-y-2 rounded-2xl border-2 border-black dark:border-white bg-yellow-50 dark:bg-slate-800/80 p-3 shadow-[2.5px_2.5px_0px_#000]">
          <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
            <span>🔤 Word Length</span>
            <span className="neo-badge bg-emerald-300 text-black text-[11px] py-0.5">
              {letters} Letters
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[4, 5, 6, 7, 8].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setLetters(count)}
                className={`neo-btn-pill py-2 text-xs font-extrabold ${
                  letters === count ? "neo-btn-pill-active" : ""
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Turn Time Limit */}
        <div className="space-y-2 rounded-2xl border-2 border-black dark:border-white bg-cyan-50 dark:bg-slate-800/80 p-3 shadow-[2.5px_2.5px_0px_#000]">
          <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
            <span>⏱️ Time Limit</span>
            <span className="neo-badge bg-cyan-300 text-black text-[11px] py-0.5">
              {timer}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {["30s", "60s", "90s", "∞"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimer(t)}
                className={`neo-btn-pill py-2 text-xs font-extrabold ${
                  timer === t ? "neo-btn-pill-active" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Guesses / Chances */}
        <div className="space-y-2 rounded-2xl border-2 border-black dark:border-white bg-pink-50 dark:bg-slate-800/80 p-3 shadow-[2.5px_2.5px_0px_#000]">
          <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
            <span>🎯 Guess Chances</span>
            <span className="neo-badge bg-pink-300 text-black text-[11px] py-0.5">
              {chances} Tries
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[4, 6, 8, 10].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChances(c)}
                className={`neo-btn-pill py-2 text-xs font-extrabold ${
                  chances === c ? "neo-btn-pill-active" : ""
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Match Rounds */}
        <div className="space-y-2 rounded-2xl border-2 border-black dark:border-white bg-purple-50 dark:bg-slate-800/80 p-3 shadow-[2.5px_2.5px_0px_#000]">
          <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
            <span>🏆 Match Length</span>
            <span className="neo-badge bg-purple-300 text-black text-[11px] py-0.5">
              {rounds === 1 ? "1 Round" : `Best of ${rounds}`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[1, 3, 5, 10].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRounds(r)}
                className={`neo-btn-pill py-2 text-xs font-extrabold ${
                  rounds === r ? "neo-btn-pill-active" : ""
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Bot Competitors Options */}
        <div className="space-y-2 rounded-2xl border-2 border-black dark:border-white bg-amber-50 dark:bg-slate-800/80 p-3 shadow-[2.5px_2.5px_0px_#000] sm:col-span-2">
          <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
            <span>🤖 Bot AI Competitors</span>
            <span className="neo-badge bg-amber-300 text-black text-[11px] py-0.5">
              {bots === 0 ? "0 (Humans Only)" : `${bots} Bots (${botDiff.toUpperCase()})`}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[0, 1, 2, 3, 4].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBots(b)}
                className={`neo-btn-pill py-2 text-xs font-extrabold ${
                  bots === b ? "neo-btn-pill-active" : ""
                }`}
              >
                {b === 0 ? "0 (Off)" : `${b} Bot${b > 1 ? "s" : ""}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Passkey & Launch CTA */}
      <div className="mt-5 flex flex-col gap-3 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:flex-row sm:items-center sm:justify-between shadow-[3px_3px_0px_#000]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`neo-btn-pill px-3.5 py-1.5 text-xs font-extrabold ${
              isPrivate ? "neo-btn-pill-active" : ""
            }`}
          >
            {isPrivate ? "🔒 Passkey Locked" : "🌐 Public Room"}
          </button>
          {isPrivate ? (
            <div className="flex items-center gap-1.5 rounded-xl border-2 border-black bg-white px-3 py-1 text-xs font-extrabold text-black shadow-[2px_2px_0px_#000]">
              <span className="text-[11px]">KEY:</span>
              <input
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                className="w-20 font-mono font-extrabold uppercase text-black focus:outline-none text-xs"
                maxLength={8}
              />
            </div>
          ) : null}
        </div>

        {(() => {
          const numericTimer = timer === "∞" ? 0 : parseInt(timer, 10);
          const playUrl = `/play?letters=${letters}&chances=${chances}&timer=${numericTimer}&rounds=${rounds}&bots=${bots}&diff=${botDiff}${
            isPrivate && passkey ? `&passkey=${encodeURIComponent(passkey)}` : ""
          }`;

          const targetHref = isAuthenticated
            ? playUrl
            : `/sign-in?callbackURL=${encodeURIComponent(playUrl)}`;

          return (
            <Link
              href={targetHref}
              className="neo-btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-extrabold shadow-[4px_4px_0px_#000]"
            >
              {isAuthenticated ? "🚀 Launch Room With Rules →" : "🔒 Sign in with Discord →"}
            </Link>
          );
        })()}
      </div>
    </div>
  );
}
