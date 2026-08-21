"use client";

import React, { useState } from "react";
import Link from "next/link";
import { generateRandomPasskey } from "@/components/organisms/WordleGame/WordleLobbyModal";

export function WordleRoomCustomizer({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [letters, setLetters] = useState<number>(5);
  const [timer, setTimer] = useState<string>("60s");
  const [chances, setChances] = useState<number>(6);
  const [rounds, setRounds] = useState<number>(3);
  const [bots, setBots] = useState<number>(2);
  const [botDiff, setBotDiff] = useState<string>("medium");
  const [isPrivate, setIsPrivate] = useState<boolean>(true);
  const [passkey, setPasskey] = useState<string>(() => generateRandomPasskey());

  const togglePrivate = () => {
    if (!isPrivate) {
      setIsPrivate(true);
      if (!passkey) {
        setPasskey(generateRandomPasskey());
      }
    } else {
      setIsPrivate(false);
    }
  };

  return (
    <div className="neo-card relative w-full overflow-hidden p-5 sm:p-7">
      {/* Header Banner */}
      <div className="mb-5 flex flex-col gap-2 border-b-2.5 border-(--border-color) pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="neo-badge bg-yellow-300 text-black text-xs font-black rotate-[-1deg]">
            🎮 Room Builder Engine
          </span>
          <h3 className="neo-title text-xl sm:text-2xl font-black mt-1">
            Custom Match Rules
          </h3>
        </div>
        <div className="neo-badge bg-emerald-300 text-black text-xs font-black">
          <span className="size-2 rounded-full bg-emerald-600 animate-ping inline-block mr-1" />
          <span>WebRTC P2P Sync</span>
        </div>
      </div>

      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {/* 1. Letter Length */}
        <div className="neo-subcard p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="neo-title">🔤 Word Length</span>
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
                className={`neo-btn-pill py-2 text-xs font-black ${
                  letters === count ? "neo-btn-pill-active" : ""
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Turn Time Limit */}
        <div className="neo-subcard p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="neo-title">⏱️ Time Limit</span>
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
                className={`neo-btn-pill py-2 text-xs font-black ${
                  timer === t ? "neo-btn-pill-active" : ""
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Guesses / Chances */}
        <div className="neo-subcard p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="neo-title">🎯 Guess Chances</span>
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
                className={`neo-btn-pill py-2 text-xs font-black ${
                  chances === c ? "neo-btn-pill-active" : ""
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Match Rounds */}
        <div className="neo-subcard p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="neo-title">🏆 Match Length</span>
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
                className={`neo-btn-pill py-2 text-xs font-black ${
                  rounds === r ? "neo-btn-pill-active" : ""
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Bot Competitors Options */}
        <div className="neo-subcard p-3 space-y-2 sm:col-span-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="neo-title">🤖 Bot AI Competitors</span>
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
                className={`neo-btn-pill py-2 text-xs font-black ${
                  bots === b ? "neo-btn-pill-active" : ""
                }`}
              >
                {b === 0 ? "0 (Off)" : `${b} Bot${b > 1 ? "s" : ""}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Passkey Customizer & Launch CTA */}
      <div className="mt-5 flex flex-col gap-3 neo-subcard p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={togglePrivate}
            className={`neo-btn-pill px-3.5 py-2 text-xs font-black ${
              isPrivate ? "neo-btn-pill-active" : ""
            }`}
          >
            {isPrivate ? "🔒 Passkey Protected" : "🌐 Public Room"}
          </button>

          {isPrivate ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                placeholder="e.g. SECRET123"
                className="w-32 rounded-xl border-2 border-(--border-color) bg-white dark:bg-slate-800 px-3 py-1.5 font-mono font-black uppercase text-black dark:text-white text-xs focus:outline-none shadow-[2px_2px_0px_#000]"
                maxLength={12}
              />
              <button
                type="button"
                onClick={() => setPasskey(generateRandomPasskey())}
                className="neo-btn-secondary px-3 py-1.5 text-xs font-black flex items-center gap-1 shadow-[2px_2px_0px_#000] whitespace-nowrap"
                title="Generate random passkey"
              >
                <span>🎲 Roll Random</span>
              </button>
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
              className="neo-btn-primary flex items-center justify-center gap-2 px-7 py-3 text-xs sm:text-sm font-black shadow-[3px_3px_0px_#000]"
            >
              {isAuthenticated ? "🚀 Launch Room With Rules →" : "🔒 Sign in with Discord →"}
            </Link>
          );
        })()}
      </div>
    </div>
  );
}
