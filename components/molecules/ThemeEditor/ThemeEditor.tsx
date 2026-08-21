"use client";

import React from "react";
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

  if (!isMounted) return null;

  return (
    <aside aria-label="Theme Customizer" className="fixed bottom-6 right-6 z-50">
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 rounded-full border border-primary/30 bg-surface-container-lowest/90 px-4 py-2.5 text-xs font-bold text-on-surface shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-primary active:scale-95"
        title="Open Theme Editor"
      >
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-sm group-hover:rotate-45 transition-transform">
          🎨
        </span>
        <span className="font-display tracking-wide">Theme Editor</span>
        <span className="size-2 rounded-full bg-primary animate-pulse" />
      </button>

      {/* Floating Modal / Drawer */}
      {isOpen ? (
        <div className="futuristic-frame absolute bottom-14 right-0 w-[360px] sm:w-[400px] overflow-hidden rounded-3xl border border-primary/25 bg-surface-container-lowest/95 p-6 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="mb-5 flex items-center justify-between border-b border-primary/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <div>
                <h3 className="font-display text-base font-bold text-on-surface">
                  Theme & Glow Studio
                </h3>
                <p className="text-[11px] text-on-surface-muted">
                  Custom colors & pulsing ambient lights
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

          <div className="max-h-[70vh] space-y-5 overflow-y-auto pr-1">
            {/* 1. Mode Selector */}
            <div className="space-y-2">
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
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-muted hover:text-on-surface"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Preset Themes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
                Theme Presets
              </label>
              <div className="grid grid-cols-1 gap-2">
                {Object.values(THEME_PRESETS).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreset(p.id)}
                    className={`flex items-center justify-between rounded-2xl p-3 text-xs font-bold transition-all border ${
                      config.preset === p.id && !config.customPrimary
                        ? "border-primary bg-primary/10 shadow-sm"
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
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-on-surface-muted">
                Custom Color Pickers
              </label>
              <div className="grid grid-cols-2 gap-3 rounded-2xl bg-surface-container-high/40 p-3">
                <div>
                  <span className="text-[11px] font-semibold text-on-surface-muted block mb-1">
                    Primary Brand
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
                      className="size-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs font-semibold text-on-surface">
                      {config.customPrimary || THEME_PRESETS[config.preset].primary}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-on-surface-muted block mb-1">
                    Accent / Gold
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
                      className="size-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <span className="font-mono text-xs font-semibold text-on-surface">
                      {config.customSecondary || THEME_PRESETS[config.preset].secondary}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Pulsing Light Glow Intensity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-on-surface-muted">
                  Pulsing Light Glow
                </label>
                <span className="font-bold text-primary capitalize">{config.glowIntensity}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-surface-container-high/60 p-1.5">
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
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-muted hover:text-on-surface"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Light Pulse Speed */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold uppercase tracking-wider text-on-surface-muted">
                  Light Pulse Speed
                </label>
                <span className="font-bold text-secondary capitalize">{config.pulseSpeed}</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-surface-container-high/60 p-1.5">
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
                        ? "bg-secondary text-on-secondary shadow-sm"
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
      ) : null}
    </aside>
  );
}
