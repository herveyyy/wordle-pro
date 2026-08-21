"use client";

import React, { useState } from "react";
import { FuturisticBackdrop } from "@/components/molecules/FuturisticBackdrop/FuturisticBackdrop";
import { WordleSidebar } from "./WordleSidebar";
import { WordleToolbar } from "./WordleToolbar";
import { WordleGrid } from "./WordleGrid";
import { WordleKeyboard } from "./WordleKeyboard";
import { WordleGameOverModal } from "./WordleGameOverModal";
import { WordleLobbyModal } from "./WordleLobbyModal";
import { WordleLobbyWaiting } from "./WordleLobbyWaiting";
import { useWordleGame } from "./wordleGame.hooks";
import { RoomConfig } from "@/lib/entities/wordle.type";

interface WordleGameProps {
  initialConfig?: RoomConfig;
  initialWords?: string[];
  playerName?: string;
  playerAvatar?: string;
  onExit?: () => void;
}

export function WordleGame({
  initialConfig,
  initialWords,
  playerName = "Alex",
  playerAvatar,
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
    startMatch,
    applyRoomConfig,
  } = useWordleGame(initialConfig, playerName, playerAvatar, initialWords);

  const [isMobilePlayersOpen, setIsMobilePlayersOpen] = useState(false);

  const showGameOverModal =
    gameStatus === "round_won" ||
    gameStatus === "round_lost" ||
    gameStatus === "match_finished";

  return (
    <div className="relative h-screen w-screen h-[100dvh] max-h-[100dvh] overflow-hidden bg-surface p-2 sm:p-4 md:p-6 font-(family-name:--font-comic-relief) flex flex-col justify-between select-none">
      {/* Dynamic Pulsing Light Background */}
      <FuturisticBackdrop />

      {/* Main Game Arena Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-between overflow-hidden gap-2 sm:gap-3">
        {/* Top Toolbar Header */}
        <WordleToolbar
          config={config}
          currentRound={currentRound}
          timeLeft={timeLeft}
          playersCount={players.length}
          isLobby={gameStatus === "lobby"}
          onOpenSettings={() => setIsLobbyModalOpen(true)}
          onNewGame={resetMatch}
          onExit={onExit}
          onTogglePlayers={() => setIsMobilePlayersOpen(true)}
        />

        {/* Invalid Word Toast Alert */}
        {invalidWordAlert ? (
          <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 rounded-2xl bg-secondary px-5 py-2.5 text-xs font-black text-black border-2.5 border-black shadow-[4px_4px_0px_#000] animate-in fade-in zoom-in-90 duration-150">
            ⚠️ {invalidWordAlert}
          </div>
        ) : null}

        {/* Main Content Stage: Lobby Waiting Room OR Active Game Arena */}
        {gameStatus === "lobby" ? (
          <WordleLobbyWaiting
            config={config}
            players={players}
            isHost={players.find((p) => p.id === "user-1")?.isHost ?? true}
            onStartMatch={startMatch}
            onOpenSettings={() => setIsLobbyModalOpen(true)}
          />
        ) : (
          <div className="flex flex-1 items-stretch gap-4 overflow-hidden min-h-0">
            {/* Left Player Sidebar (Desktop / Tablet lg+ view) */}
            <div className="hidden lg:flex w-72 xl:w-80 shrink-0 h-full overflow-hidden">
              <WordleSidebar
                players={players}
                currentPlayerId="user-1"
                wordLength={config.wordLength}
                maxChances={config.maxChances}
              />
            </div>

            {/* Center Play Area (Board + Keyboard) */}
            <main className="neo-card flex flex-1 flex-col items-center justify-between p-3 sm:p-4 bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[5px_5px_0px_#000000] dark:shadow-[5px_5px_0px_#ffffff] overflow-hidden h-full">
              {/* Wordle Letter Grid */}
              <div className="w-full flex-1 flex items-center justify-center my-auto">
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
        )}
      </div>

      {/* Mobile Players Modal / Drawer (< lg screens) */}
      {isMobilePlayersOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-150 lg:hidden">
          <div className="relative w-full max-w-sm max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setIsMobilePlayersOpen(false)}
              className="neo-btn-pink absolute top-3 right-3 z-20 size-8 flex items-center justify-center text-xs font-black"
            >
              ✕
            </button>
            <WordleSidebar
              players={players}
              currentPlayerId="user-1"
              wordLength={config.wordLength}
              maxChances={config.maxChances}
            />
          </div>
        </div>
      ) : null}

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
