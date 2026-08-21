"use client";

import React from "react";
import { TileStatus } from "@/lib/entities/wordle.type";

interface WordleKeyboardProps {
  onKey: (key: string) => void;
  keyboardStatus: Record<string, TileStatus>;
  disabled?: boolean;
}

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export function WordleKeyboard({ onKey, keyboardStatus, disabled = false }: WordleKeyboardProps) {
  const getKeyStyle = (key: string) => {
    const status = keyboardStatus[key];
    switch (status) {
      case "correct":
        return "bg-emerald-500 text-white border-emerald-400 shadow-md shadow-emerald-500/30";
      case "present":
        return "bg-amber-500 text-white border-amber-400 shadow-md shadow-amber-500/30";
      case "absent":
        return "bg-slate-600/70 dark:bg-slate-700/80 text-slate-300 dark:text-slate-400 border-slate-600/50 opacity-60";
      default:
        return "bg-surface-container-high dark:bg-surface-container-highest/80 hover:bg-surface-container-highest hover:border-primary/50 text-on-surface border border-primary/25 dark:border-primary/35 shadow-xs";
    }
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-1.5 px-2 py-2 select-none shrink-0">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex w-full justify-center gap-1 sm:gap-1.5">
          {row.map((key) => {
            const isSpecial = key === "ENTER" || key === "BACKSPACE";
            const label = key === "BACKSPACE" ? "⌫" : key === "ENTER" ? "ENTER" : key;

            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onKey(key)}
                className={`flex h-10 sm:h-11 md:h-12 items-center justify-center rounded-xl font-display font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-40 touch-manipulation select-none cursor-pointer ${
                  isSpecial
                    ? "px-3 sm:px-4 text-[11px] sm:text-xs tracking-wider"
                    : "flex-1 text-sm sm:text-base md:text-lg"
                } ${getKeyStyle(key)}`}
                style={{ WebkitTapHighlightColor: "transparent" }}
              >
                {label}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
