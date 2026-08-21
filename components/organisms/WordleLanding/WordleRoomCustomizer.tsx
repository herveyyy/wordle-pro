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
    <div className="comic-card relative w-full overflow-hidden rounded-3xl bg-surface-container-low/98 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Header Banner */}
      <div className="mb-5 flex flex-col gap-2 border-b-2 border-primary/20 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-lg bg-secondary/20 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-secondary">
            🎮 Room Builder Engine
          </span>
          <h3 className="font-display text-xl font-extrabold text-on-surface sm:text-2xl mt-1">
            Custom Match Rules
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-full border-2 border-emerald-500/40 bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-xs">
          <span className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>WebRTC P2P Sync</span>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Letter Length */}
        <div className="space-y-2 rounded-2xl border-2 border-primary/20 bg-surface-container-high/60 p-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-on-surface">🔤 Word Length</span>
            <span className="rounded-lg bg-primary/20 px-2 py-0.5 text-primary font-extrabold">
              {letters} Letters
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[4, 5, 6, 7, 8].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setLetters(count)}
                className={`comic-btn-pill rounded-xl py-2 text-xs font-bold ${
                  letters === count ? "comic-btn-pill-active" : ""
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Turn Time Limit */}
        <div className="space-y-2 rounded-2xl border-2 border-secondary/20 bg-surface-container-high/60 p-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-on-surface">⏱️ Time Limit</span>
            <span className="rounded-lg bg-secondary/20 px-2 py-0.5 text-secondary font-extrabold">
              {timer}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {["30s", "60s", "90s", "∞"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimer(t)}
                className={`comic-btn-pill rounded-xl py-2 text-xs font-bold ${
                  timer === t ? "comic-btn-pill-active" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Guesses / Chances */}
        <div className="space-y-2 rounded-2xl border-2 border-primary/20 bg-surface-container-high/60 p-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-on-surface">🎯 Guess Chances</span>
            <span className="rounded-lg bg-primary/20 px-2 py-0.5 text-primary font-extrabold">
              {chances} Tries
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[4, 6, 8, 10].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChances(c)}
                className={`comic-btn-pill rounded-xl py-2 text-xs font-bold ${
                  chances === c ? "comic-btn-pill-active" : ""
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Match Rounds */}
        <div className="space-y-2 rounded-2xl border-2 border-purple-500/20 bg-surface-container-high/60 p-3 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-on-surface">🏆 Match Length</span>
            <span className="rounded-lg bg-purple-500/20 px-2 py-0.5 text-purple-600 dark:text-purple-400 font-extrabold">
              {rounds === 1 ? "1 Round" : `Best of ${rounds}`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[1, 3, 5, 10].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRounds(r)}
                className={`comic-btn-pill rounded-xl py-2 text-xs font-bold ${
                  rounds === r ? "comic-btn-pill-active" : ""
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Bot Competitors Options */}
        <div className="space-y-2 rounded-2xl border-2 border-rose-500/20 bg-surface-container-high/60 p-3 shadow-sm sm:col-span-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-on-surface">🤖 Bot AI Competitors</span>
            <span className="rounded-lg bg-rose-500/20 px-2 py-0.5 text-rose-600 dark:text-rose-400 font-extrabold">
              {bots === 0 ? "0 (Humans Only)" : `${bots} Bots (${botDiff.toUpperCase()})`}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {[0, 1, 2, 3, 4].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBots(b)}
                className={`comic-btn-pill rounded-xl py-2 text-xs font-bold ${
                  bots === b ? "comic-btn-pill-active" : ""
                }`}
              >
                {b === 0 ? "0 (Off)" : `${b} Bot${b > 1 ? "s" : ""}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Passkey & Launch CTA */}
      <div className="mt-5 flex flex-col gap-3 rounded-2xl border-2 border-primary/20 bg-surface-container-high/40 p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`comic-btn-pill flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold ${
              isPrivate ? "comic-btn-pill-active" : ""
            }`}
          >
            {isPrivate ? "🔒 Passkey Locked" : "🌐 Public Room"}
          </button>
          {isPrivate ? (
            <div className="flex items-center gap-1.5 rounded-xl border-2 border-secondary/40 bg-surface-container-lowest px-3 py-1 text-xs font-bold">
              <span className="text-secondary text-[11px]">KEY:</span>
              <input
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                className="w-20 font-mono font-extrabold text-secondary focus:outline-none uppercase text-xs"
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
              className="comic-btn-primary flex items-center justify-center gap-2 rounded-2xl px-7 py-3 text-xs sm:text-sm font-extrabold"
            >
              {isAuthenticated ? "🚀 Launch Room With Rules →" : "🔒 Sign in with Discord →"}
            </Link>
          );
        })()}
      </div>
    </div>
  );
}
