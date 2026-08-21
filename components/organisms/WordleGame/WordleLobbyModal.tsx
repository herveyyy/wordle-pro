"use client";

import React, { useState, useEffect } from "react";
import { RoomConfig } from "@/lib/entities/wordle.type";
import { useThemeEditor } from "@/components/molecules/ThemeEditor/themeEditor.hooks";
import { THEME_PRESETS, ThemePreset, ThemeMode, GlowIntensity, PulseSpeed } from "@/components/molecules/ThemeEditor/themeEditor.types";

export function generateRandomPasskey(): string {
  const words = ["PRO", "WORD", "VIP", "CHAMP", "GUESS", "SOLO", "DUEL", "ACE", "STAR", "GRID", "NEO", "CYBER"];
  const prefix = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(100 + Math.random() * 900);
  return `${prefix}-${num}`;
}

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
  const [passkey, setPasskey] = useState<string>(
    currentConfig.passkey || generateRandomPasskey()
  );

  // Sync state whenever modal opens or currentConfig updates
  useEffect(() => {
    if (isOpen) {
      setWordLength(currentConfig.wordLength);
      setMaxChances(currentConfig.maxChances);
      setTimeLimitSeconds(currentConfig.timeLimitSeconds);
      setTotalRounds(currentConfig.totalRounds);
      setBotCount(currentConfig.botCount ?? 2);
      setBotDifficulty(currentConfig.botDifficulty ?? "medium");
      setIsPrivate(currentConfig.isPrivate);
      setPasskey(currentConfig.passkey || generateRandomPasskey());
    }
  }, [isOpen, currentConfig]);

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
      passkey: isPrivate ? (passkey.trim().toUpperCase() || generateRandomPasskey()) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="neo-card w-full max-w-lg p-5 sm:p-7 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-2.5 border-(--border-color) pb-3 shrink-0">
          <div>
            <h3 className="neo-title text-xl sm:text-2xl font-black">
              Game & Room Settings
            </h3>
            <p className="neo-subtitle text-xs font-bold mt-0.5">
              Configure battle rules, bot AI, and passkeys
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="neo-btn-pink size-9 flex items-center justify-center text-sm font-black"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2.5 mb-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("match")}
            className={`neo-btn-pill py-2.5 text-xs font-black transition-all ${activeTab === "match" ? "neo-btn-pill-active" : ""
              }`}
          >
            ⚙️ Match & Bots
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("theme")}
            className={`neo-btn-pill py-2.5 text-xs font-black transition-all ${activeTab === "theme" ? "neo-btn-pill-active" : ""
              }`}
          >
            🎨 Colors & Theme
          </button>
        </div>

        {/* Content Tabs */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
          {activeTab === "match" ? (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* 1. Word Length */}
              <div className="neo-subcard p-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="neo-title">🔤 Word Length</span>
                  <span className="neo-badge bg-emerald-300 text-black text-[11px] py-0.5">{wordLength} Letters</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {[4, 5, 6, 7, 8].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setWordLength(l)}
                      className={`neo-btn-pill py-2 text-xs font-black ${wordLength === l ? "neo-btn-pill-active" : ""
                        }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Max Chances */}
              <div className="neo-subcard p-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="neo-title">🎯 Guess Chances</span>
                  <span className="neo-badge bg-pink-300 text-black text-[11px] py-0.5">{maxChances} Tries</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[4, 6, 8, 10].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setMaxChances(c)}
                      className={`neo-btn-pill py-2 text-xs font-black ${maxChances === c ? "neo-btn-pill-active" : ""
                        }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Turn Time Limit */}
              <div className="neo-subcard p-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="neo-title">⏱️ Turn Timer</span>
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
                      className={`neo-btn-pill py-2 text-xs font-black ${timeLimitSeconds === t.val ? "neo-btn-pill-active" : ""
                        }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Total Rounds */}
              <div className="neo-subcard p-3 space-y-1.5">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="neo-title">🏆 Match Rounds</span>
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
                      className={`neo-btn-pill py-2 text-xs font-black ${totalRounds === r ? "neo-btn-pill-active" : ""
                        }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Bot Limits & AI Difficulty */}
              <div className="neo-subcard p-3 space-y-2">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="neo-title">🤖 Bot AI Competitors</span>
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
                      className={`neo-btn-pill py-2 text-xs font-black ${botCount === count ? "neo-btn-pill-active" : ""
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
                        className={`neo-btn-pill py-1.5 text-xs font-black ${botDifficulty === diff.id ? "neo-btn-pill-active" : ""
                          }`}
                      >
                        {diff.label}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* 6. Passkey & Privacy Customizer */}
              <div className="neo-subcard p-3 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="neo-title">🔒 Room Passkey Protection</span>
                  <button
                    type="button"
                    onClick={togglePrivate}
                    className={`neo-btn-pill px-3.5 py-1.5 text-xs font-black ${isPrivate ? "neo-btn-pill-active" : ""
                      }`}
                  >
                    {isPrivate ? "🔒 Passkey Required" : "🌐 Open / Public"}
                  </button>
                </div>

                {isPrivate ? (
                  <div className="space-y-1.5 pt-1">
                    <label className="neo-subtitle text-[11px] font-bold block">
                      Custom Passkey (Type your own or roll a random one):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={passkey}
                        onChange={(e) => setPasskey(e.target.value.toUpperCase())}
                        placeholder="e.g. SECRET99"
                        className="flex-1 rounded-xl border-2 border-(--border-color) bg-white dark:bg-slate-800 px-3 py-2 font-mono font-black uppercase text-black dark:text-white placeholder:text-slate-400 focus:outline-none shadow-[2px_2px_0px_#000]"
                        maxLength={12}
                      />
                      <button
                        type="button"
                        onClick={() => setPasskey(generateRandomPasskey())}
                        className="neo-btn-secondary px-3.5 py-2 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_#000] whitespace-nowrap"
                        title="Generate a random passkey"
                      >
                        <span>🎲 Roll Random</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="neo-btn-primary w-full py-3.5 text-sm font-black shadow-[4px_4px_0px_#000]"
              >
                💾 Apply Match Rules
              </button>
            </form>
          ) : (
            /* Visual Theme Studio inside Settings */
            <div className="space-y-3.5">
              {/* Mode */}
              <div className="neo-subcard p-3 space-y-1.5">
                <label className="neo-title text-xs font-black uppercase block">
                  Display Mode
                </label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: "light", label: "☀️ Light" },
                    { id: "dark", label: "🌙 Dark" },
                    { id: "oled", label: "🌌 OLED" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id as ThemeMode)}
                      className={`neo-btn-pill py-2 text-xs font-black ${themeConfig.mode === m.id ? "neo-btn-pill-active" : ""
                        }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presets */}
              <div className="neo-subcard p-3 space-y-1.5">
                <label className="neo-title text-xs font-black uppercase block">
                  Vibrant Presets
                </label>
                <div className="grid grid-cols-1 gap-1.5 pt-1">
                  {Object.values(THEME_PRESETS).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreset(p.id)}
                      className={`neo-btn-pill flex items-center justify-between p-2.5 text-xs font-black ${themeConfig.preset === p.id && !themeConfig.customPrimary
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
              <div className="neo-subcard p-3 space-y-1.5">
                <label className="neo-title text-xs font-black uppercase block">
                  Custom Papercut Colors
                </label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="rounded-xl border-2 border-(--border-color) bg-white dark:bg-slate-800 p-2.5 shadow-[2px_2px_0px_#000]">
                    <span className="neo-subtitle text-[10px] font-bold block mb-1">Primary Color</span>
                    <input
                      type="color"
                      value={themeConfig.customPrimary || THEME_PRESETS[themeConfig.preset].primary}
                      onChange={(e) =>
                        setCustomColors(
                          e.target.value,
                          themeConfig.customSecondary || THEME_PRESETS[themeConfig.preset].secondary
                        )
                      }
                      className="size-7 cursor-pointer rounded-lg border-2 border-(--border-color) p-0"
                    />
                  </div>

                  <div className="rounded-xl border-2 border-(--border-color) bg-white dark:bg-slate-800 p-2.5 shadow-[2px_2px_0px_#000]">
                    <span className="neo-subtitle text-[10px] font-bold block mb-1">Accent Color</span>
                    <input
                      type="color"
                      value={themeConfig.customSecondary || THEME_PRESETS[themeConfig.preset].secondary}
                      onChange={(e) =>
                        setCustomColors(
                          themeConfig.customPrimary || THEME_PRESETS[themeConfig.preset].primary,
                          e.target.value
                        )
                      }
                      className="size-7 cursor-pointer rounded-lg border-2 border-(--border-color) p-0"
                    />
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                type="button"
                onClick={resetTheme}
                className="neo-btn-pill w-full py-3 text-xs font-black"
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
