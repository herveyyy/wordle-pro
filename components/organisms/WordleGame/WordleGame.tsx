"use client";

import React from "react";
import { FuturisticBackdrop } from "@/components/molecules/FuturisticBackdrop/FuturisticBackdrop";
import { WordleSidebar } from "./WordleSidebar";
import { WordleToolbar } from "./WordleToolbar";
import { WordleGrid } from "./WordleGrid";
import { WordleKeyboard } from "./WordleKeyboard";
import { WordleGameOverModal } from "./WordleGameOverModal";
import { WordleLobbyModal } from "./WordleLobbyModal";
import { useWordleGame } from "./wordleGame.hooks";
import { RoomConfig } from "@/lib/entities/wordle.type";

interface WordleGameProps {
  initialConfig?: RoomConfig;
  playerName?: string;
  onExit?: () => void;
}

export function WordleGame({
  initialConfig,
  playerName = "Alex",
  onExit = () => {},
}: WordleGameProps) {
  const {
    config,
    currentRound,
    targetWord,
    targetDefinition,
    userGuesses,
    currentGuessIndex,
    currentLetterIndex,
    timeLeft,
    gameStatus,
    players,
    keyboardStatus,
    invalidWordAlert,
    shakeRowIndex,
    isLobbyModalOpen,
    setIsLobbyModalOpen,
    handleKey,
    nextRound,
    resetMatch,
    applyRoomConfig,
  } = useWordleGame(initialConfig, playerName);

  const showGameOverModal =
    gameStatus === "round_won" ||
    gameStatus === "round_lost" ||
    gameStatus === "match_finished";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface py-4 px-3 sm:px-6 md:px-8 font-(family-name:--font-comic-relief)">
      {/* Dynamic Pulsing Light Background */}
      <FuturisticBackdrop />

      {/* Main Game Arena */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4">
        {/* Top Toolbar */}
        <WordleToolbar
          config={config}
          currentRound={currentRound}
          timeLeft={timeLeft}
          onOpenSettings={() => setIsLobbyModalOpen(true)}
          onNewGame={resetMatch}
          onExit={onExit}
        />

        {/* Invalid Word Toast Alert */}
        {invalidWordAlert ? (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-secondary px-6 py-2.5 text-xs font-bold text-on-secondary shadow-xl animate-in fade-in zoom-in-90 duration-150">
            ⚠️ {invalidWordAlert}
          </div>
        ) : null}

        {/* Responsive Arena: Left Sidebar + Center Game Area */}
        <div className="flex flex-col-reverse lg:flex-row items-stretch lg:items-start gap-5">
          {/* Left Player Sidebar (Opponents & Guesses without Letters) */}
          <WordleSidebar
            players={players}
            currentPlayerId="user-1"
            wordLength={config.wordLength}
            maxChances={config.maxChances}
          />

          {/* Center Play Area */}
          <main className="futuristic-frame flex flex-1 flex-col items-center justify-between rounded-3xl border border-primary/20 bg-surface-container-low/95 p-4 sm:p-6 shadow-xl backdrop-blur-xl min-h-[580px]">
            {/* Wordle Letter Grid */}
            <div className="w-full flex-1 flex items-center justify-center">
              <WordleGrid
                guesses={userGuesses}
                wordLength={config.wordLength}
                maxChances={config.maxChances}
                currentGuessIndex={currentGuessIndex}
                currentLetterIndex={currentLetterIndex}
                shakeRowIndex={shakeRowIndex}
              />
            </div>

            {/* Virtual On-screen Keyboard */}
            <WordleKeyboard
              onKey={handleKey}
              keyboardStatus={keyboardStatus}
              disabled={gameStatus !== "playing"}
            />
          </main>
        </div>
      </div>

      {/* Round / Match Recap Modal */}
      {showGameOverModal ? (
        <WordleGameOverModal
          status={gameStatus as "round_won" | "round_lost" | "match_finished"}
          targetWord={targetWord}
          targetDefinition={targetDefinition}
          currentRound={currentRound}
          config={config}
          players={players}
          onNextRound={nextRound}
          onNewMatch={resetMatch}
        />
      ) : null}

      {/* Room Rules & Passkey Customizer Modal */}
      <WordleLobbyModal
        currentConfig={config}
        isOpen={isLobbyModalOpen}
        onClose={() => setIsLobbyModalOpen(false)}
        onApplyConfig={applyRoomConfig}
      />
    </div>
  );
}
