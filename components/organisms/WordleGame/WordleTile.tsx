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
        return "bg-emerald-400 text-black border-3 border-black shadow-[3px_3px_0px_#000000] dark:border-white dark:shadow-[3px_3px_0px_#ffffff]";
      case "present":
        return "bg-amber-300 text-black border-3 border-black shadow-[3px_3px_0px_#000000] dark:border-white dark:shadow-[3px_3px_0px_#ffffff]";
      case "absent":
        return "bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 border-3 border-black shadow-[3px_3px_0px_#000000] dark:border-white dark:shadow-[3px_3px_0px_#ffffff]";
      case "tbd":
        return "bg-white dark:bg-slate-800 text-black dark:text-white border-3 border-black dark:border-white shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff] animate-tile-pop scale-105";
      case "empty":
      default:
        return isCurrent
          ? "bg-white dark:bg-slate-800 text-black dark:text-white border-3 border-black dark:border-white shadow-[3px_3px_0px_#000000] dark:shadow-[3px_3px_0px_#ffffff]"
          : "bg-white/80 dark:bg-slate-800/80 text-black/50 dark:text-white/50 border-2 sm:border-3 border-black/30 dark:border-white/30 shadow-[2px_2px_0px_rgba(0,0,0,0.15)]";
    }
  };

  const getResponsiveSize = () => {
    if (wordLength >= 8 || maxChances >= 8) {
      return "h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-sm sm:text-base md:text-lg rounded-lg";
    }
    if (wordLength === 7) {
      return "h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 text-base sm:text-lg md:text-xl rounded-xl";
    }
    if (wordLength === 6) {
      return "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 text-lg sm:text-xl md:text-2xl rounded-xl";
    }
    return "h-11 w-11 sm:h-12 sm:w-12 md:h-13 md:w-13 text-xl sm:text-2xl md:text-3xl rounded-xl";
  };

  return (
    <div
      className={`flex items-center justify-center font-display font-extrabold uppercase aspect-square shrink-0 select-none transition-all duration-150 ${getResponsiveSize()} ${getStatusStyles()} ${
        isRevealed ? "animate-tile-flip" : ""
      }`}
      style={isRevealed ? { animationDelay: `${delayIndex * 120}ms` } : undefined}
    >
      {letter}
    </div>
  );
}
