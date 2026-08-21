"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ThemeConfig,
  ThemePreset,
  ThemeMode,
  GlowIntensity,
  PulseSpeed,
  THEME_PRESETS,
} from "./themeEditor.types";

const THEME_STORAGE_KEY = "wordle_pro_theme_config";

const DEFAULT_THEME: ThemeConfig = {
  preset: "emerald",
  mode: "light",
  glowIntensity: "medium",
  pulseSpeed: "normal",
};

export function useThemeEditor() {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConfig(parsed);
        applyTheme(parsed);
      } else {
        applyTheme(DEFAULT_THEME);
      }
    } catch {
      applyTheme(DEFAULT_THEME);
    }
  }, []);

  const applyTheme = useCallback((theme: ThemeConfig) => {
    const root = document.documentElement;

    // Apply data attributes for Tailwind / CSS selectors
    root.setAttribute("data-theme", theme.preset);
    root.setAttribute("data-mode", theme.mode);
    root.setAttribute("data-glow", theme.glowIntensity);
    root.setAttribute("data-speed", theme.pulseSpeed);

    if (theme.mode === "dark") {
      root.classList.add("dark");
      root.style.setProperty("--surface", "#0f172a");
      root.style.setProperty("--on-surface", "#ffffff");
      root.style.setProperty("--card-bg", "#0f172a");
      root.style.setProperty("--card-text", "#ffffff");
      root.style.setProperty("--subcard-bg", "#1e293b");
      root.style.setProperty("--border-color", "#ffffff");
      root.style.setProperty("--shadow-color", "#000000");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--surface-container-low", "#1e293b");
      root.style.setProperty("--surface-container-lowest", "#0f172a");
      root.style.setProperty("--surface-container-high", "#334155");
      root.style.setProperty("--surface-container-highest", "#475569");
      root.style.setProperty("--on-surface-muted", "#cbd5e1");
      root.style.setProperty("--neo-border", "#ffffff");
      root.style.setProperty("--glow-opacity", theme.glowIntensity === "high" ? "0.9" : theme.glowIntensity === "low" ? "0.3" : "0.6");
    } else if (theme.mode === "oled") {
      root.classList.add("dark");
      root.style.setProperty("--surface", "#000000");
      root.style.setProperty("--on-surface", "#ffffff");
      root.style.setProperty("--card-bg", "#000000");
      root.style.setProperty("--card-text", "#ffffff");
      root.style.setProperty("--subcard-bg", "#111111");
      root.style.setProperty("--border-color", "#ffffff");
      root.style.setProperty("--shadow-color", "#000000");
      root.style.setProperty("--text-muted", "#a1a1aa");
      root.style.setProperty("--surface-container-low", "#111111");
      root.style.setProperty("--surface-container-lowest", "#000000");
      root.style.setProperty("--surface-container-high", "#222222");
      root.style.setProperty("--surface-container-highest", "#333333");
      root.style.setProperty("--on-surface-muted", "#d4d4d8");
      root.style.setProperty("--neo-border", "#ffffff");
      root.style.setProperty("--glow-opacity", theme.glowIntensity === "high" ? "0.9" : theme.glowIntensity === "low" ? "0.3" : "0.6");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("--surface", "#fefce8");
      root.style.setProperty("--on-surface", "#000000");
      root.style.setProperty("--card-bg", "#ffffff");
      root.style.setProperty("--card-text", "#000000");
      root.style.setProperty("--subcard-bg", "#f8fafc");
      root.style.setProperty("--border-color", "#000000");
      root.style.setProperty("--shadow-color", "#000000");
      root.style.setProperty("--text-muted", "#334155");
      root.style.setProperty("--surface-container-low", "#ffffff");
      root.style.setProperty("--surface-container-lowest", "#ffffff");
      root.style.setProperty("--surface-container-high", "#f8fafc");
      root.style.setProperty("--surface-container-highest", "#f1f5f9");
      root.style.setProperty("--on-surface-muted", "#334155");
      root.style.setProperty("--neo-border", "#000000");
      root.style.setProperty("--glow-opacity", theme.glowIntensity === "high" ? "0.3" : theme.glowIntensity === "low" ? "0.1" : "0.2");
    }

    const preset = THEME_PRESETS[theme.preset];

    // Apply custom colors if specified, otherwise preset
    const primary = theme.customPrimary || preset.primary;
    const secondary = theme.customSecondary || preset.secondary;

    root.style.setProperty("--primary", primary);
    root.style.setProperty("--secondary", secondary);
    root.style.setProperty("--glow-1", preset.glow1);
    root.style.setProperty("--glow-2", preset.glow2);

    // Pulse duration
    const pulseDurations: Record<PulseSpeed, string> = {
      slow: "8s",
      normal: "4s",
      fast: "2s",
    };
    root.style.setProperty("--pulse-duration", pulseDurations[theme.pulseSpeed]);
  }, []);

  const updateConfig = useCallback(
    (newConfig: Partial<ThemeConfig>) => {
      setConfig((prev) => {
        const updated = { ...prev, ...newConfig };
        applyTheme(updated);
        try {
          localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
    },
    [applyTheme]
  );

  const setPreset = useCallback(
    (preset: ThemePreset) => {
      updateConfig({
        preset,
        customPrimary: undefined,
        customSecondary: undefined,
      });
    },
    [updateConfig]
  );

  const setMode = useCallback(
    (mode: ThemeMode) => {
      updateConfig({ mode });
    },
    [updateConfig]
  );

  const setGlowIntensity = useCallback(
    (glowIntensity: GlowIntensity) => {
      updateConfig({ glowIntensity });
    },
    [updateConfig]
  );

  const setPulseSpeed = useCallback(
    (pulseSpeed: PulseSpeed) => {
      updateConfig({ pulseSpeed });
    },
    [updateConfig]
  );

  const setCustomColors = useCallback(
    (primary: string, secondary: string) => {
      updateConfig({ customPrimary: primary, customSecondary: secondary });
    },
    [updateConfig]
  );

  const resetTheme = useCallback(() => {
    updateConfig(DEFAULT_THEME);
  }, [updateConfig]);

  return {
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
  };
}
