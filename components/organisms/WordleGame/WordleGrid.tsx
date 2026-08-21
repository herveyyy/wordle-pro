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
  return (
    <div className="flex flex-col items-center justify-center gap-2 sm:gap-2.5 py-4">
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
            isCurrentRow={isCurrentRow}
            currentLetterIndex={currentLetterIndex}
            isShaking={isShaking}
          />
        );
      })}
    </div>
  );
}
