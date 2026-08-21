"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useButtonStyles } from "@/components/atoms/Button/button.hooks";

export function WordleRoomCustomizer({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [letters, setLetters] = useState<number>(5);
  const [timer, setTimer] = useState<string>("60s");
  const [chances, setChances] = useState<number>(6);
  const [rounds, setRounds] = useState<number>(3);
  const [bots, setBots] = useState<number>(2);
  const [botDiff, setBotDiff] = useState<string>("medium");
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [passkey, setPasskey] = useState<string>("PRO777");

  const primaryBtnClass = useButtonStyles("primary");

  return (
    <div className="futuristic-frame relative w-full overflow-hidden rounded-3xl border border-primary/20 bg-surface-container-low/95 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="mb-6 flex flex-col gap-2 border-b border-primary/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
            Room Builder Engine
          </span>
          <h3 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
            Custom Match Rules
          </h3>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-700">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>WebRTC P2P Sync</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Letter Length */}
        <div className="space-y-2 rounded-2xl bg-surface-container-highest/50 p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-on-surface-muted">Word Length</span>
            <span className="text-primary font-bold">{letters} Letters</span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[4, 5, 6, 7, 8].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setLetters(count)}
                className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                  letters === count
                    ? "bg-primary text-on-primary shadow-sm scale-105"
                    : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Turn Time Limit */}
        <div className="space-y-2 rounded-2xl bg-surface-container-highest/50 p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-on-surface-muted">Time Limit</span>
            <span className="text-secondary font-bold">{timer}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["30s", "60s", "90s", "∞"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTimer(t)}
                className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                  timer === t
                    ? "bg-secondary text-on-secondary shadow-sm scale-105"
                    : "bg-surface-container-high text-on-surface-muted hover:text-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Guesses / Chances */}
        <div className="space-y-2 rounded-2xl bg-surface-container-highest/50 p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-on-surface-muted">Guess Chances</span>
            <span className="text-primary font-bold">{chances} Tries</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[4, 6, 8, 10].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setChances(c)}
                className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                  chances === c
                    ? "bg-primary text-on-primary shadow-sm scale-105"
                    : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Match Rounds */}
        <div className="space-y-2 rounded-2xl bg-surface-container-highest/50 p-3.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-on-surface-muted">Match Length</span>
            <span className="text-primary font-bold">
              {rounds === 1 ? "1 Round" : `Best of ${rounds}`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {[1, 3, 5, 10].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRounds(r)}
                className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                  rounds === r
                    ? "bg-primary text-on-primary shadow-sm scale-105"
                    : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Bot Competitors Options */}
        <div className="space-y-2 rounded-2xl bg-surface-container-highest/50 p-3.5 sm:col-span-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-on-surface-muted">🤖 Bot AI Competitors</span>
            <span className="text-secondary font-bold">
              {bots === 0 ? "Humans Only (WebRTC)" : `${bots} Bots (${botDiff.toUpperCase()})`}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBots(b)}
                className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                  bots === b
                    ? "bg-secondary text-on-secondary shadow-sm scale-105"
                    : "bg-surface-container-high text-on-surface-muted hover:text-secondary"
                }`}
              >
                {b === 0 ? "0 (P2P)" : `${b} Bot${b > 1 ? "s" : ""}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Passkey & Launch CTA */}
      <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-surface-container-highest/30 p-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPrivate(!isPrivate)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              isPrivate
                ? "bg-secondary-container text-secondary"
                : "bg-surface-container-high text-on-surface-muted"
            }`}
          >
            {isPrivate ? "🔒 Passkey" : "🌐 Public"}
          </button>
          {isPrivate ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-surface-container-lowest px-2.5 py-1 border border-primary/20 text-xs">
              <span className="text-on-surface-muted text-[10px]">KEY:</span>
              <input
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                className="w-20 font-mono font-bold text-primary focus:outline-none uppercase text-xs"
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
              className={`${primaryBtnClass} px-6 py-2.5 text-xs font-bold shadow-md`}
            >
              {isAuthenticated ? "Launch Room With These Rules →" : "🔒 Sign in to Launch Room →"}
            </Link>
          );
        })()}
      </div>
    </div>
  );
}
