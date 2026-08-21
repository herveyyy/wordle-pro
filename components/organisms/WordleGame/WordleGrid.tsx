"use client";

import React from "react";
import { GuessRow } from "@/lib/entities/wordle.type";
import { WordleRow } from "./WordleRow";

interface WordleGridProps {
  guesses: GuessRow[];
  wordLength: number;
  maxChances: number;
  currentGuessIndex: number;
  currentLetterIndex: number;
  shakeRowIndex?: number;
}

export function WordleGrid({
  guesses,
  wordLength,
  maxChances,
  currentGuessIndex,
  currentLetterIndex,
  shakeRowIndex,
}: WordleGridProps) {
  const getGridGap = () => {
    if (maxChances >= 8) return "gap-1";
    return "gap-1 sm:gap-1.5";
  };

  return (
    <div className={`flex flex-col items-center justify-center ${getGridGap()} py-1 sm:py-2`}>
      {Array.from({ length: maxChances }).map((_, rowIndex) => {
        const row = guesses[rowIndex] || {
          letters: [],
          statuses: [],
          isSubmitted: false,
        };

        const isCurrentRow = rowIndex === currentGuessIndex;
        const isShaking = shakeRowIndex === rowIndex;

        return (
          <WordleRow
            key={rowIndex}
            row={row}
            wordLength={wordLength}
            maxChances={maxChances}
            isCurrentRow={isCurrentRow}
            currentLetterIndex={currentLetterIndex}
            isShaking={isShaking}
          />
        );
      })}
    </div>
  );
}
