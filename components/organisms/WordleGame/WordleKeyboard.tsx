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
        return "bg-emerald-500 text-white shadow-emerald-500/30";
      case "present":
        return "bg-amber-500 text-white shadow-amber-500/30";
      case "absent":
        return "bg-slate-400 dark:bg-slate-700 text-slate-200 dark:text-slate-400 opacity-60";
      default:
        return "bg-surface-container-high hover:bg-surface-container-highest text-on-surface";
    }
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-1.5 sm:gap-2 px-2 py-3 select-none">
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
                className={`flex h-12 sm:h-14 items-center justify-center rounded-xl font-display font-bold transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 ${
                  isSpecial
                    ? "px-3 sm:px-4 text-xs sm:text-sm bg-surface-container-high/80 text-on-surface"
                    : "flex-1 text-base sm:text-lg"
                } ${getKeyStyle(key)}`}
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
