"use client";

import React from "react";
import { TileStatus } from "@/lib/entities/wordle.type";

interface WordleTileProps {
  letter?: string;
  status: TileStatus;
  isRevealed?: boolean;
  delayIndex?: number;
  isCurrent?: boolean;
}

export function WordleTile({
  letter = "",
  status,
  isRevealed = false,
  delayIndex = 0,
  isCurrent = false,
}: WordleTileProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "correct":
        return "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25";
      case "present":
        return "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25";
      case "absent":
        return "bg-slate-400 dark:bg-slate-700 text-slate-100 dark:text-slate-300 border-slate-400 dark:border-slate-700";
      case "tbd":
        return "border-primary/60 bg-surface-container-high text-on-surface scale-105";
      case "empty":
      default:
        return isCurrent
          ? "border-primary/40 bg-surface-container-low/80 text-on-surface"
          : "border-primary/15 bg-surface-container-low/40 text-on-surface-muted";
    }
  };

  return (
    <div
      className={`flex size-12 sm:size-14 md:size-16 items-center justify-center rounded-2xl border-2 font-display text-xl sm:text-2xl md:text-3xl font-extrabold uppercase select-none transition-all duration-300 ${getStatusStyles()} ${
        isRevealed ? "animate-in zoom-in-75 duration-300" : ""
      }`}
      style={isRevealed ? { transitionDelay: `${delayIndex * 100}ms` } : undefined}
    >
      {letter}
    </div>
  );
}
