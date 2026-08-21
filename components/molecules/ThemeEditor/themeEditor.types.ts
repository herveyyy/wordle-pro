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
    name: "Neon Emerald",
    primary: "#10b981",
    secondary: "#f59e0b",
    glow1: "#10b981",
    glow2: "#3b82f6",
    accentBadge: "bg-emerald-500",
  },
  violet: {
    id: "violet",
    name: "Cyber Violet",
    primary: "#8b5cf6",
    secondary: "#ec4899",
    glow1: "#8b5cf6",
    glow2: "#ec4899",
    accentBadge: "bg-purple-500",
  },
  cyan: {
    id: "cyan",
    name: "Electric Cyan",
    primary: "#06b6d4",
    secondary: "#3b82f6",
    glow1: "#06b6d4",
    glow2: "#8b5cf6",
    accentBadge: "bg-cyan-500",
  },
  sunset: {
    id: "sunset",
    name: "Solar Flare",
    primary: "#f97316",
    secondary: "#eab308",
    glow1: "#f97316",
    glow2: "#ec4899",
    accentBadge: "bg-orange-500",
  },
  crimson: {
    id: "crimson",
    name: "Arcade Crimson",
    primary: "#f43f5e",
    secondary: "#a855f7",
    glow1: "#f43f5e",
    glow2: "#f59e0b",
    accentBadge: "bg-rose-500",
  },
};
