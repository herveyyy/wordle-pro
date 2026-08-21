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
        return "bg-emerald-400 text-black border-2 border-black shadow-[2px_2px_0px_#000000] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]";
      case "present":
        return "bg-amber-300 text-black border-2 border-black shadow-[2px_2px_0px_#000000] dark:border-white dark:shadow-[2px_2px_0px_#ffffff]";
      case "absent":
        return "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-2 border-black/50 opacity-60 shadow-none";
      default:
        return "bg-white dark:bg-slate-800 text-black dark:text-white border-2 border-black dark:border-white shadow-[2.5px_2.5px_0px_#000000] dark:shadow-[2.5px_2.5px_0px_#ffffff] hover:bg-yellow-200 dark:hover:bg-slate-700";
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
                className={`flex h-10 sm:h-11 md:h-12 items-center justify-center rounded-xl font-display font-extrabold transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-40 touch-manipulation select-none cursor-pointer ${
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
