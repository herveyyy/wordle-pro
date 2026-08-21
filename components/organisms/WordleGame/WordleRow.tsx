"use client";

import React from "react";
import { GuessRow } from "@/lib/entities/wordle.type";
import { WordleTile } from "./WordleTile";

interface WordleRowProps {
  row: GuessRow;
  wordLength: number;
  maxChances?: number;
  isCurrentRow: boolean;
  currentLetterIndex?: number;
  isShaking?: boolean;
}

export function WordleRow({
  row,
  wordLength,
  maxChances = 6,
  isCurrentRow,
  currentLetterIndex = 0,
  isShaking = false,
}: WordleRowProps) {
  const getGap = () => {
    if (wordLength >= 7) return "gap-1 sm:gap-1.5";
    return "gap-1.5 sm:gap-2";
  };

  return (
    <div
      className={`flex items-center justify-center ${getGap()} transition-transform ${
        isShaking ? "animate-bounce duration-150" : ""
      }`}
    >
      {Array.from({ length: wordLength }).map((_, colIndex) => {
        const letter = row.letters[colIndex] || "";
        const status = row.isSubmitted
          ? row.statuses[colIndex]
          : letter
            ? "tbd"
            : "empty";

        return (
          <WordleTile
            key={colIndex}
            letter={letter}
            status={status}
            isRevealed={row.isSubmitted}
            delayIndex={colIndex}
            isCurrent={isCurrentRow && colIndex === currentLetterIndex}
            wordLength={wordLength}
            maxChances={maxChances}
          />
        );
      })}
    </div>
  );
}
