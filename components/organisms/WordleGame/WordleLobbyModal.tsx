"use client";

import React, { useState } from "react";
import { RoomConfig } from "@/lib/entities/wordle.type";
import { useThemeEditor } from "@/components/molecules/ThemeEditor/themeEditor.hooks";
import { THEME_PRESETS, ThemePreset, ThemeMode, GlowIntensity, PulseSpeed } from "@/components/molecules/ThemeEditor/themeEditor.types";

interface WordleLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentConfig: RoomConfig;
  onApplyConfig: (config: RoomConfig) => void;
}

export function WordleLobbyModal({
  isOpen,
  onClose,
  currentConfig,
  onApplyConfig,
}: WordleLobbyModalProps) {
  const [activeTab, setActiveTab] = useState<"match" | "theme">("match");

  // Match Config state
  const [wordLength, setWordLength] = useState<number>(currentConfig.wordLength);
  const [maxChances, setMaxChances] = useState<number>(currentConfig.maxChances);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number>(
    currentConfig.timeLimitSeconds
  );
  const [totalRounds, setTotalRounds] = useState<number>(currentConfig.totalRounds);
  const [botCount, setBotCount] = useState<number>(currentConfig.botCount ?? 2);
  const [botDifficulty, setBotDifficulty] = useState<"easy" | "medium" | "pro" | "off">(
    currentConfig.botDifficulty ?? "medium"
  );
  const [isPrivate, setIsPrivate] = useState<boolean>(currentConfig.isPrivate);
  const [passkey, setPasskey] = useState<string>(currentConfig.passkey || "PRO777");

  // Theme Studio hooks
  const {
    config: themeConfig,
    setPreset,
    setMode,
    setGlowIntensity,
    setPulseSpeed,
    setCustomColors,
    resetTheme,
  } = useThemeEditor();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyConfig({
      ...currentConfig,
      wordLength,
      maxChances,
      timeLimitSeconds,
      totalRounds,
      botCount,
      botDifficulty,
      isPrivate,
      passkey: isPrivate ? passkey : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="neo-card w-full max-w-lg bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] p-5 sm:p-7 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-black dark:border-white pb-3 shrink-0">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-black dark:text-white">
              Game & Room Settings
            </h3>
            <p className="text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
              Configure battle rules, bot AI, and visual colors
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="neo-btn-pink size-8 flex items-center justify-center text-sm font-extrabold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("match")}
            className={`neo-btn-pill py-2 text-xs font-extrabold transition-all ${
              activeTab === "match" ? "neo-btn-pill-active" : ""
            }`}
          >
            ⚙️ Match & Bots
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("theme")}
            className={`neo-btn-pill py-2 text-xs font-extrabold transition-all ${
              activeTab === "theme" ? "neo-btn-pill-active" : ""
            }`}
          >
            🎨 Colors & Theme
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto pr-1">
          {activeTab === "match" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Word Length */}
              <div className="space-y-1.5 rounded-2xl border-2 border-black dark:border-white bg-yellow-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between text-xs font-extrabold text-black dark:text-white">
                  <span>🔤 Word Length</span>
                  <span className="neo-badge bg-emerald-300 text-black text-[11px] py-0.5">{wordLength} Letters</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[4, 5, 6, 7, 8].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setWordLength(l)}
                      className={`neo-btn-pill py-1.5 text-xs font-extrabold ${
                        wordLength === l ? "neo-btn-pill-active" : ""
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Max Chances */}
              <div className="space-y-1.5 rounded-2xl border-2 border-black dark:border-white bg-pink-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between text-xs font-extrabold text-black dark:text-white">
                  <span>🎯 Guess Chances</span>
                  <span className="neo-badge bg-pink-300 text-black text-[11px] py-0.5">{maxChances} Tries</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[4, 6, 8, 10].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setMaxChances(c)}
                      className={`neo-btn-pill py-1.5 text-xs font-extrabold ${
                        maxChances === c ? "neo-btn-pill-active" : ""
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Turn Time Limit */}
              <div className="space-y-1.5 rounded-2xl border-2 border-black dark:border-white bg-cyan-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between text-xs font-extrabold text-black dark:text-white">
                  <span>⏱️ Turn Timer</span>
                  <span className="neo-badge bg-cyan-300 text-black text-[11px] py-0.5">
                    {timeLimitSeconds === 0 ? "Unlimited" : `${timeLimitSeconds}s`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
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
                      className={`neo-btn-pill py-1.5 text-xs font-extrabold ${
                        timeLimitSeconds === t.val ? "neo-btn-pill-active" : ""
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Total Rounds */}
              <div className="space-y-1.5 rounded-2xl border-2 border-black dark:border-white bg-purple-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <div className="flex justify-between text-xs font-extrabold text-black dark:text-white">
                  <span>🏆 Match Rounds</span>
                  <span className="neo-badge bg-purple-300 text-black text-[11px] py-0.5">
                    {totalRounds === 1 ? "1 Round" : `Best of ${totalRounds}`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[1, 3, 5, 10].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTotalRounds(r)}
                      className={`neo-btn-pill py-1.5 text-xs font-extrabold ${
                        totalRounds === r ? "neo-btn-pill-active" : ""
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Bot Limits & AI Difficulty */}
              <div className="space-y-2 rounded-2xl border-2 border-black dark:border-white bg-amber-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
                  <span>🤖 Bot AI Competitors</span>
                  <span className="neo-badge bg-amber-300 text-black text-[11px] py-0.5">
                    {botCount === 0 || botDifficulty === "off"
                      ? "0 (P2P Humans Only)"
                      : `${botCount} Bots (${botDifficulty.toUpperCase()})`}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[0, 1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setBotCount(count)}
                      className={`neo-btn-pill py-1.5 text-xs font-extrabold ${
                        botCount === count ? "neo-btn-pill-active" : ""
                      }`}
                    >
                      {count === 0 ? "0 (Off)" : `${count} Bot${count > 1 ? "s" : ""}`}
                    </button>
                  ))}
                </div>

                {botCount > 0 ? (
                  <div className="grid grid-cols-4 gap-1.5 pt-1.5">
                    {[
                      { id: "easy", label: "Easy" },
                      { id: "medium", label: "Medium" },
                      { id: "pro", label: "Pro AI" },
                      { id: "off", label: "Disable" },
                    ].map((diff) => (
                      <button
                        key={diff.id}
                        type="button"
                        onClick={() => setBotDifficulty(diff.id as any)}
                        className={`neo-btn-pill py-1 text-xs font-extrabold ${
                          botDifficulty === diff.id ? "neo-btn-pill-active" : ""
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* 6. Passkey & Privacy */}
              <div className="rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 space-y-2 shadow-[2px_2px_0px_#000]">
                <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
                  <span>🔒 Passkey Lock</span>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(!isPrivate)}
                    className={`neo-btn-pill px-3 py-1 text-xs font-extrabold ${
                      isPrivate ? "neo-btn-pill-active" : ""
                    }`}
                  >
                    {isPrivate ? "🔒 Enabled" : "🌐 Public"}
                  </button>
                </div>

                {isPrivate ? (
                  <div className="flex items-center gap-2 text-xs font-extrabold text-black dark:text-white pt-1">
                    <span>KEY:</span>
                    <input
                      type="text"
                      value={passkey}
                      onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                      className="rounded-xl border-2 border-black bg-white px-3 py-1 font-mono font-extrabold uppercase text-black focus:outline-none shadow-[2px_2px_0px_#000]"
                      maxLength={8}
                    />
                  </div>
                ) : null}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="neo-btn-primary w-full py-3.5 text-sm font-extrabold shadow-[4px_4px_0px_#000]"
              >
                💾 Apply Match Rules
              </button>
            </form>
          ) : (
            /* Visual Theme Studio inside Settings */
            <div className="space-y-4">
              {/* Mode */}
              <div className="space-y-1.5 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <label className="text-xs font-extrabold uppercase text-black dark:text-white block">
                  Display Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "light", label: "☀️ Light" },
                    { id: "dark", label: "🌙 Dark" },
                    { id: "oled", label: "🌌 OLED" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as ThemeMode)}
                      className={`neo-btn-pill py-2 text-xs font-extrabold ${
                        themeConfig.mode === m.id ? "neo-btn-pill-active" : ""
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="space-y-1.5 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <label className="text-xs font-extrabold uppercase text-black dark:text-white block">
                  Vibrant Presets
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.values(THEME_PRESETS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreset(p.id)}
                      className={`neo-btn-pill flex items-center justify-between p-2.5 text-xs font-extrabold ${
                        themeConfig.preset === p.id && !themeConfig.customPrimary
                          ? "neo-btn-pill-active"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span
                            className="size-4 rounded-full border border-black shadow-xs"
                            style={{ backgroundColor: p.primary }}
                          />
                          <span
                            className="size-4 rounded-full border border-black shadow-xs"
                            style={{ backgroundColor: p.secondary }}
                          />
                        </div>
                        <span>{p.name}</span>
                      </div>
                      {themeConfig.preset === p.id && !themeConfig.customPrimary ? (
                        <span className="neo-badge bg-white text-black text-[10px] py-0.5">Active ✓</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="space-y-1.5 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
                <label className="text-xs font-extrabold uppercase text-black dark:text-white block">
                  Custom Papercut Colors
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                    <span className="text-[10px] font-bold block mb-1">Primary Color</span>
                    <input
                      type="color"
                      value={themeConfig.customPrimary || THEME_PRESETS[themeConfig.preset].primary}
                      onChange={(e) =>
                        setCustomColors(
                          e.target.value,
                          themeConfig.customSecondary || THEME_PRESETS[themeConfig.preset].secondary
                        )
                      }
                      className="size-7 cursor-pointer rounded-lg border-2 border-black p-0"
                    />
                  </div>

                  <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                    <span className="text-[10px] font-bold block mb-1">Accent Color</span>
                    <input
                      type="color"
                      value={themeConfig.customSecondary || THEME_PRESETS[themeConfig.preset].secondary}
                      onChange={(e) =>
                        setCustomColors(
                          themeConfig.customPrimary || THEME_PRESETS[themeConfig.preset].primary,
                          e.target.value
                        )
                      }
                      className="size-7 cursor-pointer rounded-lg border-2 border-black p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={resetTheme}
                className="neo-btn-pill w-full py-2.5 text-xs font-extrabold"
              >
                🔄 Reset Theme to Defaults
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
