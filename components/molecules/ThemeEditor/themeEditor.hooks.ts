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

    if (theme.mode === "dark" || theme.mode === "oled") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    const preset = THEME_PRESETS[theme.preset];

    // Apply custom colors if specified, otherwise preset
    const primary = theme.customPrimary || preset.primary;
    const secondary = theme.customSecondary || preset.secondary;

    root.style.setProperty("--primary", primary);
    root.style.setProperty("--secondary", secondary);
    root.style.setProperty("--glow-1", preset.glow1);
    root.style.setProperty("--glow-2", preset.glow2);

    // Glow intensity opacity multiplier
    const glowOpacities: Record<GlowIntensity, string> = {
      low: "0.25",
      medium: "0.55",
      high: "0.9",
    };
    root.style.setProperty("--glow-opacity", glowOpacities[theme.glowIntensity]);

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
