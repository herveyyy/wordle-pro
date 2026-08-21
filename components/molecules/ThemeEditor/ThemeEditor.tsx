"use client";

import React, { useEffect } from "react";
import { useThemeEditor } from "./themeEditor.hooks";
import { THEME_PRESETS, ThemePreset, ThemeMode, GlowIntensity, PulseSpeed } from "./themeEditor.types";

export function ThemeEditor() {
  const {
    config,
    isOpen,
    isMounted,
    setIsOpen,
    setPreset,
    setMode,
    setGlowIntensity,
    setPulseSpeed,
    setCustomColors,
    resetTheme,
  } = useThemeEditor();

  // Listen for global open-theme-studio events
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-theme-studio", handleOpen);
    return () => window.removeEventListener("open-theme-studio", handleOpen);
  }, [setIsOpen]);

  if (!isMounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="neo-card w-[360px] sm:w-[420px] max-h-[85vh] overflow-hidden bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[6px_6px_0px_#000000] dark:shadow-[6px_6px_0px_#ffffff] p-5 sm:p-6 flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-2 border-black dark:border-white pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <div>
              <h3 className="font-display text-base font-extrabold text-black dark:text-white">
                Theme & Glow Studio
              </h3>
              <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Custom papercut colors & ambient lighting
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetTheme}
              className="neo-btn-pill px-2.5 py-1 text-[11px] font-extrabold"
              title="Reset to defaults"
            >
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="neo-btn-pink size-8 flex items-center justify-center text-sm font-extrabold"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
          {/* 1. Mode Selector */}
          <div className="space-y-1 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
            <label className="text-xs font-extrabold uppercase text-black dark:text-white block">
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
                  onClick={() => setMode(m.id as ThemeMode)}
                  className={`neo-btn-pill py-2 text-xs font-extrabold ${
                    config.mode === m.id ? "neo-btn-pill-active" : ""
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Preset Themes */}
          <div className="space-y-1 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
            <label className="text-xs font-extrabold uppercase text-black dark:text-white block">
              Vibrant Presets
            </label>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {Object.values(THEME_PRESETS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`neo-btn-pill flex items-center justify-between p-2.5 text-xs font-extrabold ${
                    config.preset === p.id && !config.customPrimary
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

                  {config.preset === p.id && !config.customPrimary ? (
                    <span className="neo-badge bg-white text-black text-[10px] py-0.5">Active ✓</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Custom Color Hex */}
          <div className="space-y-1 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
            <label className="text-xs font-extrabold uppercase text-black dark:text-white block">
              Custom Papercut Colors
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                <span className="text-[10px] font-bold block mb-1">Primary Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.customPrimary || THEME_PRESETS[config.preset].primary}
                    onChange={(e) =>
                      setCustomColors(
                        e.target.value,
                        config.customSecondary || THEME_PRESETS[config.preset].secondary
                      )
                    }
                    className="size-7 cursor-pointer rounded-lg border-2 border-black p-0"
                  />
                  <span className="font-mono text-xs font-extrabold">
                    {config.customPrimary || THEME_PRESETS[config.preset].primary}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border-2 border-black bg-white p-2 text-black shadow-[2px_2px_0px_#000]">
                <span className="text-[10px] font-bold block mb-1">Accent Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.customSecondary || THEME_PRESETS[config.preset].secondary}
                    onChange={(e) =>
                      setCustomColors(
                        config.customPrimary || THEME_PRESETS[config.preset].primary,
                        e.target.value
                      )
                    }
                    className="size-7 cursor-pointer rounded-lg border-2 border-black p-0"
                  />
                  <span className="font-mono text-xs font-extrabold">
                    {config.customSecondary || THEME_PRESETS[config.preset].secondary}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Pulsing Light Glow Intensity */}
          <div className="space-y-1 rounded-2xl border-2 border-black dark:border-white bg-slate-50 dark:bg-slate-800/80 p-3 shadow-[2px_2px_0px_#000]">
            <div className="flex items-center justify-between text-xs font-extrabold text-black dark:text-white">
              <span>Pulsing Light Glow</span>
              <span className="neo-badge bg-yellow-300 text-black text-[10px] py-0.5 capitalize">{config.glowIntensity}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { id: "low", label: "Subtle" },
                { id: "medium", label: "Vibrant" },
                { id: "high", label: "Hyper" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGlowIntensity(g.id as GlowIntensity)}
                  className={`neo-btn-pill py-1.5 text-xs font-extrabold ${
                    config.glowIntensity === g.id ? "neo-btn-pill-active" : ""
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
