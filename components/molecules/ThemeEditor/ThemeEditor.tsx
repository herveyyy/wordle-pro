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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in duration-150">
      <div className="futuristic-frame w-[360px] sm:w-[420px] max-h-[85vh] overflow-hidden rounded-3xl border border-primary/30 bg-surface-container-lowest/95 p-6 shadow-2xl backdrop-blur-2xl flex flex-col">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-primary/10 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎨</span>
            <div>
              <h3 className="font-display text-base font-bold text-on-surface">
                Theme & Glow Studio
              </h3>
              <p className="text-[11px] text-on-surface-muted">
                Custom neon colors & pulsing ambient lights
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetTheme}
              className="rounded-lg bg-surface-container-high px-2.5 py-1 text-[11px] font-semibold text-on-surface-muted hover:text-primary transition-colors"
              title="Reset to defaults"
            >
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex size-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface-muted hover:text-on-surface transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {/* 1. Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
              Display Mode
            </label>
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-surface-container-high/60 p-1.5">
              {[
                { id: "light", label: "☀️ Light" },
                { id: "dark", label: "🌙 Dark" },
                { id: "oled", label: "🌌 OLED" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id as ThemeMode)}
                  className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                    config.mode === m.id
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-on-surface-muted hover:text-on-surface"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Preset Themes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
              Vibrant Presets
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.values(THEME_PRESETS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`flex items-center justify-between rounded-2xl p-2.5 text-xs font-bold transition-all border ${
                    config.preset === p.id && !config.customPrimary
                      ? "border-primary bg-primary/10 shadow-xs"
                      : "border-transparent bg-surface-container-high/40 hover:bg-surface-container-high/80 text-on-surface"
                  }`}
                >
                  <div className="flex items-center gap-3">
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

                  {config.preset === p.id && !config.customPrimary ? (
                    <span className="text-[11px] font-extrabold text-primary">Active ✓</span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Custom Color Hex */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
              Custom Neon Colors
            </label>
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-surface-container-high/40 p-2.5">
              <div>
                <span className="text-[10px] font-semibold text-on-surface-muted block mb-1">
                  Primary Neon
                </span>
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
                    className="size-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <span className="font-mono text-xs font-semibold text-on-surface">
                    {config.customPrimary || THEME_PRESETS[config.preset].primary}
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
                    value={config.customSecondary || THEME_PRESETS[config.preset].secondary}
                    onChange={(e) =>
                      setCustomColors(
                        config.customPrimary || THEME_PRESETS[config.preset].primary,
                        e.target.value
                      )
                    }
                    className="size-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <span className="font-mono text-xs font-semibold text-on-surface">
                    {config.customSecondary || THEME_PRESETS[config.preset].secondary}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Pulsing Light Glow Intensity */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-on-surface-muted">
                Pulsing Light Glow
              </label>
              <span className="font-bold text-primary capitalize">{config.glowIntensity}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-container-high/60 p-1">
              {[
                { id: "low", label: "Subtle" },
                { id: "medium", label: "Vibrant" },
                { id: "high", label: "Hyper Glow" },
              ].map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGlowIntensity(g.id as GlowIntensity)}
                  className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                    config.glowIntensity === g.id
                      ? "bg-primary text-on-primary shadow-xs"
                      : "text-on-surface-muted hover:text-on-surface"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Light Pulse Speed */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold uppercase tracking-wider text-on-surface-muted">
                Light Pulse Speed
              </label>
              <span className="font-bold text-secondary capitalize">{config.pulseSpeed}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-container-high/60 p-1">
              {[
                { id: "slow", label: "Chill (8s)" },
                { id: "normal", label: "Smooth (4s)" },
                { id: "fast", label: "Fast (2s)" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setPulseSpeed(s.id as PulseSpeed)}
                  className={`rounded-xl py-1.5 text-xs font-bold transition-all ${
                    config.pulseSpeed === s.id
                      ? "bg-secondary text-on-secondary shadow-xs"
                      : "text-on-surface-muted hover:text-on-surface"
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
