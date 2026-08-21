export type ThemePreset = "emerald" | "violet" | "cyan" | "sunset" | "crimson";

export type ThemeMode = "light" | "dark" | "oled";

export type GlowIntensity = "low" | "medium" | "high";

export type PulseSpeed = "slow" | "normal" | "fast";

export interface ThemeConfig {
  preset: ThemePreset;
  mode: ThemeMode;
  customPrimary?: string;
  customSecondary?: string;
  glowIntensity: GlowIntensity;
  pulseSpeed: PulseSpeed;
}

export interface PresetDetails {
  id: ThemePreset;
  name: string;
  primary: string;
  secondary: string;
  glow1: string;
  glow2: string;
  accentBadge: string;
}

export const THEME_PRESETS: Record<ThemePreset, PresetDetails> = {
  emerald: {
    id: "emerald",
    name: "Wordle Emerald",
    primary: "#0a5c66",
    secondary: "#c76a1a",
    glow1: "#10b981",
    glow2: "#f59e0b",
    accentBadge: "bg-emerald-500",
  },
  violet: {
    id: "violet",
    name: "Cyber Violet",
    primary: "#5865F2",
    secondary: "#ec4899",
    glow1: "#5865F2",
    glow2: "#ec4899",
    accentBadge: "bg-[#5865F2]",
  },
  cyan: {
    id: "cyan",
    name: "Ocean Frost",
    primary: "#0284c7",
    secondary: "#06b6d4",
    glow1: "#38bdf8",
    glow2: "#06b6d4",
    accentBadge: "bg-sky-500",
  },
  sunset: {
    id: "sunset",
    name: "Solar Flare",
    primary: "#ea580c",
    secondary: "#eab308",
    glow1: "#f97316",
    glow2: "#eab308",
    accentBadge: "bg-orange-500",
  },
  crimson: {
    id: "crimson",
    name: "Arcade Crimson",
    primary: "#e11d48",
    secondary: "#f59e0b",
    glow1: "#f43f5e",
    glow2: "#f59e0b",
    accentBadge: "bg-rose-500",
  },
};
