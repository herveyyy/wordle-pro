"use client";

import React from "react";
import { TileStatus } from "@/lib/entities/wordle.type";

interface WordleTileProps {
  letter?: string;
  status: TileStatus;
  isRevealed?: boolean;
  delayIndex?: number;
  isCurrent?: boolean;
  wordLength?: number;
  maxChances?: number;
}

export function WordleTile({
  letter = "",
  status,
  isRevealed = false,
  delayIndex = 0,
  isCurrent = false,
  wordLength = 5,
  maxChances = 6,
}: WordleTileProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "correct":
        return "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30";
      case "present":
        return "bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/30";
      case "absent":
        return "bg-slate-500/80 dark:bg-slate-700 text-slate-100 dark:text-slate-300 border-slate-600 dark:border-slate-600";
      case "tbd":
        return "border-primary bg-surface-container-highest text-on-surface scale-105 shadow-md shadow-primary/20";
      case "empty":
      default:
        return isCurrent
          ? "border-primary/60 bg-surface-container-high text-on-surface shadow-xs"
          : "border-primary/25 dark:border-primary/35 bg-surface-container-low/80 dark:bg-surface-container-high/30 text-on-surface-muted";
    }
  };

  const getResponsiveSize = () => {
    if (wordLength >= 8 || maxChances >= 8) {
      return "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-sm sm:text-base md:text-lg rounded-lg border-2";
    }
    if (wordLength === 7) {
      return "h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 text-base sm:text-lg md:text-xl rounded-xl border-2";
    }
    if (wordLength === 6) {
      return "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 text-lg sm:text-xl md:text-2xl rounded-xl border-2";
    }
    return "h-11 w-11 sm:h-12 sm:w-12 md:h-13 md:w-13 text-xl sm:text-2xl md:text-3xl rounded-xl border-2";
  };

  return (
    <div
      className={`flex items-center justify-center font-display font-extrabold uppercase aspect-square shrink-0 select-none transition-all duration-200 ${getResponsiveSize()} ${getStatusStyles()} ${
        isRevealed ? "animate-in zoom-in-75 duration-300" : ""
      }`}
      style={isRevealed ? { transitionDelay: `${delayIndex * 60}ms` } : undefined}
    >
      {letter}
    </div>
  );
}
