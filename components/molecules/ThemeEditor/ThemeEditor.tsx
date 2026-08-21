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
      <div className="neo-card w-[360px] sm:w-[440px] max-h-[88vh] p-5 sm:p-6 flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b-2.5 border-(--border-color) pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <div>
              <h3 className="neo-title text-lg font-black">
                Theme Studio
              </h3>
              <p className="neo-subtitle text-xs font-bold">
                Papercut & Neo-Brutalist Color Engine
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetTheme}
              className="neo-btn-pill px-2.5 py-1 text-[11px] font-black"
              title="Reset to defaults"
            >
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="neo-btn-pink size-8 flex items-center justify-center text-xs font-black"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
          {/* 1. Mode Selector */}
          <div className="neo-subcard p-3 space-y-1.5">
            <label className="neo-title text-xs font-black uppercase block">
              Display Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: "light", label: "☀️ Light" },
                { id: "dark", label: "🌙 Dark" },
                { id: "oled", label: "🌌 OLED" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as ThemeMode)}
                  className={`neo-btn-pill py-2 text-xs font-black ${
                    config.mode === m.id ? "neo-btn-pill-active" : ""
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Preset Themes */}
          <div className="neo-subcard p-3 space-y-1.5">
            <label className="neo-title text-xs font-black uppercase block">
              Vibrant Presets
            </label>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              {Object.values(THEME_PRESETS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`neo-btn-pill flex items-center justify-between p-2.5 text-xs font-black ${
                    config.preset === p.id && !config.customPrimary
                      ? "neo-btn-pill-active"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5">
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
          <div className="neo-subcard p-3 space-y-1.5">
            <label className="neo-title text-xs font-black uppercase block">
              Custom Papercut Colors
            </label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="rounded-xl border-2 border-(--border-color) bg-white dark:bg-slate-800 p-2.5 shadow-[2px_2px_0px_#000]">
                <span className="neo-subtitle text-[10px] font-bold block mb-1">
                  Primary Color
                </span>
                <input
                  type="color"
                  value={config.customPrimary || THEME_PRESETS[config.preset].primary}
                  onChange={(e) =>
                    setCustomColors(
                      e.target.value,
                      config.customSecondary || THEME_PRESETS[config.preset].secondary
                    )
                  }
                  className="size-7 cursor-pointer rounded-lg border-2 border-(--border-color) p-0"
                />
              </div>

              <div className="rounded-xl border-2 border-(--border-color) bg-white dark:bg-slate-800 p-2.5 shadow-[2px_2px_0px_#000]">
                <span className="neo-subtitle text-[10px] font-bold block mb-1">
                  Accent Color
                </span>
                <input
                  type="color"
                  value={config.customSecondary || THEME_PRESETS[config.preset].secondary}
                  onChange={(e) =>
                    setCustomColors(
                      config.customPrimary || THEME_PRESETS[config.preset].primary,
                      e.target.value
                    )
                  }
                  className="size-7 cursor-pointer rounded-lg border-2 border-(--border-color) p-0"
                />
              </div>
            </div>
          </div>

          {/* 4. Pulsing Light Glow Intensity */}
          <div className="neo-subcard p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="neo-title uppercase block">
                Pulsing Light Glow
              </label>
              <span className="neo-badge bg-emerald-300 text-black text-[10px] capitalize font-black">
                {config.glowIntensity}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: "low", label: "Subtle" },
                { id: "medium", label: "Vibrant" },
                { id: "high", label: "Hyper" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGlowIntensity(g.id as GlowIntensity)}
                  className={`neo-btn-pill py-1.5 text-xs font-black ${
                    config.glowIntensity === g.id ? "neo-btn-pill-active" : ""
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Light Pulse Speed */}
          <div className="neo-subcard p-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="neo-title uppercase block">
                Light Pulse Speed
              </label>
              <span className="neo-badge bg-amber-300 text-black text-[10px] capitalize font-black">
                {config.pulseSpeed}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: "slow", label: "Chill (8s)" },
                { id: "normal", label: "Smooth (4s)" },
                { id: "fast", label: "Fast (2s)" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPulseSpeed(s.id as PulseSpeed)}
                  className={`neo-btn-pill py-1.5 text-xs font-black ${
                    config.pulseSpeed === s.id ? "neo-btn-pill-active" : ""
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
