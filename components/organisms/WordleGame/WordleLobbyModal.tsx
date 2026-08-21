"use client";

import React, { useState } from "react";
import { RoomConfig } from "@/lib/entities/wordle.type";

interface WordleLobbyModalProps {
  currentConfig: RoomConfig;
  isOpen: boolean;
  onClose: () => void;
  onApplyConfig: (config: RoomConfig) => void;
}

export function WordleLobbyModal({
  currentConfig,
  isOpen,
  onClose,
  onApplyConfig,
}: WordleLobbyModalProps) {
  const [wordLength, setWordLength] = useState<number>(currentConfig.wordLength);
  const [maxChances, setMaxChances] = useState<number>(currentConfig.maxChances);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(
    currentConfig.timeLimitSeconds
  );
  const [totalRounds, setTotalRounds] = useState<number>(currentConfig.totalRounds);
  const [isPrivate, setIsPrivate] = useState<boolean>(currentConfig.isPrivate);
  const [passkey, setPasskey] = useState<string>(currentConfig.passkey || "PRO777");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyConfig({
      ...currentConfig,
      wordLength,
      maxChances,
      timeLimitSeconds,
      totalRounds,
      isPrivate,
      passkey: isPrivate ? passkey : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="futuristic-frame w-full max-w-lg overflow-hidden rounded-3xl border border-primary/30 bg-surface-container-lowest/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-6 flex items-center justify-between border-b border-primary/10 pb-4">
          <div>
            <h3 className="font-display text-xl font-bold text-on-surface">
              Room Battle Settings
            </h3>
            <p className="text-xs text-on-surface-muted">
              Configure word length, guess chances, timers, and passkey
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full bg-surface-container-high text-sm font-bold text-on-surface-muted hover:text-on-surface"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Word Length */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-on-surface-muted">Word Length</span>
              <span className="text-primary">{wordLength} Letters</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[4, 5, 6, 7, 8].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setWordLength(l)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    wordLength === l
                      ? "bg-primary text-on-primary shadow-sm scale-105"
                      : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Max Chances */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-on-surface-muted">Guess Chances</span>
              <span className="text-secondary">{maxChances} Tries</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[4, 6, 8, 10].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setMaxChances(c)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    maxChances === c
                      ? "bg-secondary text-on-secondary shadow-sm scale-105"
                      : "bg-surface-container-high text-on-surface-muted hover:text-secondary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Turn Time Limit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-on-surface-muted">Turn Timer</span>
              <span className="text-primary">
                {timeLimitSeconds === 0 ? "Unlimited" : `${timeLimitSeconds}s`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { label: "30s", val: 30 },
                { label: "60s", val: 60 },
                { label: "90s", val: 90 },
                { label: "∞", val: 0 },
              ].map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTimeLimitSeconds(t.val)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    timeLimitSeconds === t.val
                      ? "bg-primary text-on-primary shadow-sm scale-105"
                      : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Total Rounds */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-on-surface-muted">Match Rounds</span>
              <span className="text-primary">
                {totalRounds === 1 ? "1 Round" : `Best of ${totalRounds}`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 3, 5, 10].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setTotalRounds(r)}
                  className={`rounded-xl py-2 text-xs font-bold transition-all ${
                    totalRounds === r
                      ? "bg-primary text-on-primary shadow-sm scale-105"
                      : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Passkey & Privacy */}
          <div className="rounded-2xl bg-surface-container-high/40 p-3.5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-on-surface">Passkey Lock</span>
              <button
                type="button"
                onClick={() => setIsPrivate(!isPrivate)}
                className={`rounded-xl px-3 py-1 text-xs font-bold transition-all ${
                  isPrivate
                    ? "bg-secondary text-on-secondary"
                    : "bg-surface-container-high text-on-surface-muted"
                }`}
              >
                {isPrivate ? "🔒 Enabled" : "🌐 Public"}
              </button>
            </div>

            {isPrivate ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-on-surface-muted">Passkey:</span>
                <input
                  type="text"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                  className="rounded-xl border border-primary/20 bg-surface-container-lowest px-3 py-1.5 font-mono font-bold uppercase text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  maxLength={8}
                />
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl bg-surface-container-high px-5 py-2.5 text-xs font-bold text-on-surface-muted hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-primary px-6 py-2.5 font-display text-xs font-bold text-on-primary shadow-md hover:bg-primary-container"
            >
              Apply & Restart Match →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
