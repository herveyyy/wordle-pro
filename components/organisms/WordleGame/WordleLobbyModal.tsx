"use client";

import React, { useState } from "react";
import { RoomConfig } from "@/lib/entities/wordle.type";
import { useThemeEditor } from "@/components/molecules/ThemeEditor/themeEditor.hooks";
import { THEME_PRESETS, ThemeMode, GlowIntensity, PulseSpeed } from "@/components/molecules/ThemeEditor/themeEditor.types";

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
  const [activeTab, setActiveTab] = useState<"match" | "theme">("match");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="comic-card w-full max-w-lg overflow-hidden rounded-3xl bg-surface-container-lowest/98 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-primary/20 pb-3 shrink-0">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-on-surface">
              Game & Room Settings
            </h3>
            <p className="text-[11px] sm:text-xs text-on-surface-muted">
              Configure battle rules, bot AI, and visual colors
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-7 sm:size-8 items-center justify-center rounded-full bg-surface-container-high text-xs sm:text-sm font-bold text-on-surface-muted hover:text-on-surface"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-surface-container-high/60 p-1 mb-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("match")}
            className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
              activeTab === "match"
                ? "bg-primary text-on-primary shadow-xs"
                : "text-on-surface-muted hover:text-on-surface"
            }`}
          >
            ⚙️ Match & Bots
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("theme")}
            className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
              activeTab === "theme"
                ? "bg-secondary text-on-secondary shadow-xs"
                : "text-on-surface-muted hover:text-on-surface"
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
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-muted">Word Length</span>
                  <span className="text-primary">{wordLength} Letters</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[4, 5, 6, 7, 8].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setWordLength(l)}
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                        wordLength === l
                          ? "bg-primary text-on-primary shadow-xs scale-105"
                          : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Max Chances */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-muted">Guess Chances</span>
                  <span className="text-secondary">{maxChances} Tries</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[4, 6, 8, 10].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setMaxChances(c)}
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                        maxChances === c
                          ? "bg-secondary text-on-secondary shadow-xs scale-105"
                          : "bg-surface-container-high text-on-surface-muted hover:text-secondary"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Turn Time Limit */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-muted">Turn Timer</span>
                  <span className="text-primary">
                    {timeLimitSeconds === 0 ? "Unlimited" : `${timeLimitSeconds}s`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
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
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                        timeLimitSeconds === t.val
                          ? "bg-primary text-on-primary shadow-xs scale-105"
                          : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Total Rounds */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-on-surface-muted">Match Rounds</span>
                  <span className="text-primary">
                    {totalRounds === 1 ? "1 Round" : `Best of ${totalRounds}`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 3, 5, 10].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setTotalRounds(r)}
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                        totalRounds === r
                          ? "bg-primary text-on-primary shadow-xs scale-105"
                          : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Bot Limits & AI Difficulty */}
              <div className="space-y-2 rounded-2xl bg-surface-container-high/40 p-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-on-surface">🤖 Bot AI Competitors</span>
                  <span className="text-primary font-bold">
                    {botCount === 0 || botDifficulty === "off"
                      ? "0 (P2P Humans Only)"
                      : `${botCount} Bots (${botDifficulty.toUpperCase()})`}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-1">
                  {[0, 1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setBotCount(count)}
                      className={`rounded-xl py-1 text-xs font-bold transition-all ${
                        botCount === count
                          ? "bg-primary text-on-primary shadow-xs"
                          : "bg-surface-container-high text-on-surface-muted hover:text-primary"
                      }`}
                    >
                      {count === 0 ? "0 (Off)" : `${count} Bot${count > 1 ? "s" : ""}`}
                    </button>
                  ))}
                </div>

                {botCount > 0 ? (
                  <div className="grid grid-cols-4 gap-1 pt-1">
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
                        className={`rounded-xl py-1 text-xs font-bold transition-all ${
                          botDifficulty === diff.id
                            ? "bg-secondary text-on-secondary shadow-xs"
                            : "bg-surface-container-high text-on-surface-muted hover:text-secondary"
                        }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* 6. Passkey & Privacy */}
              <div className="rounded-2xl bg-surface-container-high/40 p-3 space-y-2">
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
                      className="rounded-xl border border-primary/20 bg-surface-container-lowest px-3 py-1 font-mono font-bold uppercase text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      maxLength={8}
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl bg-surface-container-high px-4 py-2 text-xs font-bold text-on-surface-muted hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-primary px-5 py-2 font-display text-xs font-bold text-on-primary shadow-md hover:bg-primary-container"
                >
                  Apply & Restart Match →
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Display Mode */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
                  Display Mode
                </label>
                <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-container-high/60 p-1">
                  {[
                    { id: "light", label: "☀️ Light" },
                    { id: "dark", label: "🌙 Dark" },
                    { id: "oled", label: "🌌 OLED" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as ThemeMode)}
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                        themeConfig.mode === m.id
                          ? "bg-primary text-on-primary shadow-xs"
                          : "text-on-surface-muted hover:text-on-surface"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Presets */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
                  Vibrant Presets
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {Object.values(THEME_PRESETS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreset(p.id)}
                      className={`flex items-center justify-between rounded-2xl p-2.5 text-xs font-bold transition-all border ${
                        themeConfig.preset === p.id && !themeConfig.customPrimary
                          ? "border-primary bg-primary/10 shadow-xs"
                          : "border-transparent bg-surface-container-high/40 hover:bg-surface-container-high/80 text-on-surface"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-1">
                          <span
                            className="size-4 rounded-full shadow-xs"
                            style={{ backgroundColor: p.primary }}
                          />
                          <span
                            className="size-4 rounded-full shadow-xs"
                            style={{ backgroundColor: p.secondary }}
                          />
                        </div>
                        <span className="font-semibold text-on-surface">{p.name}</span>
                      </div>

                      {themeConfig.preset === p.id && !themeConfig.customPrimary ? (
                        <span className="text-[10px] font-extrabold text-primary">Active ✓</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Pickers */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
                  Custom Colors
                </label>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-container-high/40 p-2.5">
                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-muted block mb-1">
                      Primary Neon
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeConfig.customPrimary || THEME_PRESETS[themeConfig.preset].primary}
                        onChange={(e) =>
                          setCustomColors(
                            e.target.value,
                            themeConfig.customSecondary || THEME_PRESETS[themeConfig.preset].secondary
                          )
                        }
                        className="size-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-xs font-semibold text-on-surface">
                        {themeConfig.customPrimary || THEME_PRESETS[themeConfig.preset].primary}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold text-on-surface-muted block mb-1">
                      Accent Glow
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={themeConfig.customSecondary || THEME_PRESETS[themeConfig.preset].secondary}
                        onChange={(e) =>
                          setCustomColors(
                            themeConfig.customPrimary || THEME_PRESETS[themeConfig.preset].primary,
                            e.target.value
                          )
                        }
                        className="size-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                      />
                      <span className="font-mono text-xs font-semibold text-on-surface">
                        {themeConfig.customSecondary || THEME_PRESETS[themeConfig.preset].secondary}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pulsing Light Glow */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-bold uppercase tracking-wider text-on-surface-muted">
                    Pulsing Light Glow
                  </label>
                  <span className="font-bold text-primary capitalize">{themeConfig.glowIntensity}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-container-high/60 p-1">
                  {[
                    { id: "low", label: "Subtle" },
                    { id: "medium", label: "Vibrant" },
                    { id: "high", label: "Hyper Glow" },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGlowIntensity(g.id as GlowIntensity)}
                      className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                        themeConfig.glowIntensity === g.id
                          ? "bg-primary text-on-primary shadow-xs"
                          : "text-on-surface-muted hover:text-on-surface"
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={resetTheme}
                  className="rounded-2xl bg-surface-container-high px-4 py-2 text-xs font-bold text-on-surface-muted hover:text-primary"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-2xl bg-primary px-5 py-2 font-display text-xs font-bold text-on-primary shadow-md"
                >
                  Done ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
