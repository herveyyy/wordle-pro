"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  GameState,
  RoomConfig,
  GuessRow,
  TileStatus,
  PlayerStats,
} from "@/lib/entities/wordle.type";
import {
  getRandomWord,
  evaluateWordleGuess,
  isValidWord,
  getWordDefinition,
} from "@/lib/domain/services/wordle.service";

const DEFAULT_CONFIG: RoomConfig = {
  roomId: "PRO-892",
  passkey: "PRO777",
  isPrivate: true,
  wordLength: 5,
  maxChances: 6,
  timeLimitSeconds: 60,
  totalRounds: 3,
};

const INITIAL_PLAYERS: PlayerStats[] = [
  {
    id: "user-1",
    name: "Alex (You)",
    score: 0,
    roundsWon: 0,
    guesses: [],
    hasSolved: false,
  },
  {
    id: "bot-1",
    name: "CyberBot_X",
    score: 0,
    roundsWon: 0,
    guesses: [],
    hasSolved: false,
  },
  {
    id: "bot-2",
    name: "Nova_Word",
    score: 0,
    roundsWon: 0,
    guesses: [],
    hasSolved: false,
  },
];

export function useWordleGame(initialConfig: RoomConfig = DEFAULT_CONFIG, playerName: string = "Alex") {
  const [config, setConfig] = useState<RoomConfig>(initialConfig);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [targetWord, setTargetWord] = useState<string>("");
  const [targetDefinition, setTargetDefinition] = useState<string | undefined>();
  const [userGuesses, setUserGuesses] = useState<GuessRow[]>([]);
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialConfig.timeLimitSeconds);
  const [gameStatus, setGameStatus] = useState<GameState["gameStatus"]>("playing");
  const [players, setPlayers] = useState<PlayerStats[]>(() => [
    { ...INITIAL_PLAYERS[0], name: `${playerName} (You)` },
    INITIAL_PLAYERS[1],
    INITIAL_PLAYERS[2],
  ]);
  const [keyboardStatus, setKeyboardStatus] = useState<Record<string, TileStatus>>({});
  const [invalidWordAlert, setInvalidWordAlert] = useState<string | undefined>();
  const [shakeRowIndex, setShakeRowIndex] = useState<number | undefined>();
  const [isLobbyModalOpen, setIsLobbyModalOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a round with a new target word
  const initRound = useCallback(
    async (roundNum: number, currentCfg: RoomConfig) => {
      const word = await getRandomWord(currentCfg.wordLength, currentCfg.roomId, roundNum);
      setTargetWord(word);
      setTargetDefinition(undefined);
      setCurrentRound(roundNum);
      setCurrentGuessIndex(0);
      setCurrentLetterIndex(0);
      setTimeLeft(currentCfg.timeLimitSeconds);
      setKeyboardStatus({});
      setInvalidWordAlert(undefined);
      setShakeRowIndex(undefined);
      setGameStatus("playing");

      // Initialize empty guesses rows
      const emptyRows: GuessRow[] = Array.from({ length: currentCfg.maxChances }).map(
        () => ({
          letters: [],
          statuses: [],
          isSubmitted: false,
        })
      );
      setUserGuesses(emptyRows);

      // Reset round status for players but preserve overall score
      setPlayers((prev) =>
        prev.map((p) => ({
          ...p,
          guesses: [],
          hasSolved: false,
          solvedInRow: undefined,
        }))
      );
    },
    []
  );

  // Start fresh game / first round on mount or config change
  useEffect(() => {
    initRound(1, config);
  }, [config, initRound]);

  // Turn Countdown Timer
  useEffect(() => {
    if (gameStatus !== "playing" || config.timeLimitSeconds === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time ran out for this round
          handleRoundTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStatus, config.timeLimitSeconds]);

  // Handle timeout
  const handleRoundTimeout = useCallback(async () => {
    setGameStatus(currentRound >= config.totalRounds ? "match_finished" : "round_lost");
    if (targetWord) {
      const def = await getWordDefinition(targetWord);
      setTargetDefinition(def);
    }
  }, [currentRound, config.totalRounds, targetWord]);

  // Bot Opponent Simulation
  useEffect(() => {
    if (gameStatus !== "playing") {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
      return;
    }

    botIntervalRef.current = setInterval(() => {
      setPlayers((prev) => {
        return prev.map((p) => {
          if (p.id === "user-1" || p.hasSolved || p.guesses.length >= config.maxChances) {
            return p;
          }

          // Generate simulated guess results (without letters)
          const currentGuessNum = p.guesses.length + 1;
          const isWinningGuess =
            Math.random() < 0.28 || currentGuessNum === config.maxChances - 1;

          let newRowStatuses: TileStatus[];
          if (isWinningGuess) {
            newRowStatuses = Array(config.wordLength).fill("correct");
          } else {
            // Mixed colored tiles
            newRowStatuses = Array.from({ length: config.wordLength }).map(() => {
              const r = Math.random();
              return r > 0.55 ? "correct" : r > 0.25 ? "present" : "absent";
            });
          }

          const hasSolved = isWinningGuess;
          const addedScore = hasSolved ? Math.max(80, 220 - currentGuessNum * 30) : 0;

          return {
            ...p,
            guesses: [...p.guesses, newRowStatuses],
            hasSolved,
            solvedInRow: hasSolved ? currentGuessNum : undefined,
            score: p.score + addedScore,
            roundsWon: hasSolved ? p.roundsWon + 1 : p.roundsWon,
          };
        });
      });
    }, 5500);

    return () => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    };
  }, [gameStatus, config.maxChances, config.wordLength]);

  // Shake row feedback
  const triggerRowShake = useCallback((message: string) => {
    setShakeRowIndex(currentGuessIndex);
    setInvalidWordAlert(message);
    setTimeout(() => {
      setShakeRowIndex(undefined);
      setInvalidWordAlert(undefined);
    }, 1600);
  }, [currentGuessIndex]);

  // Handle typing key input
  const handleKey = useCallback(
    async (key: string) => {
      if (gameStatus !== "playing") return;

      const upperKey = key.toUpperCase();

      if (upperKey === "BACKSPACE") {
        if (currentLetterIndex > 0) {
          setUserGuesses((prev) => {
            const next = [...prev];
            const activeRow = { ...next[currentGuessIndex] };
            const newLetters = [...activeRow.letters];
            newLetters.pop();
            activeRow.letters = newLetters;
            next[currentGuessIndex] = activeRow;
            return next;
          });
          setCurrentLetterIndex((prev) => prev - 1);
        }
        return;
      }

      if (upperKey === "ENTER") {
        const activeRow = userGuesses[currentGuessIndex];
        if (!activeRow || activeRow.letters.length < config.wordLength) {
          triggerRowShake(`Word must be ${config.wordLength} letters`);
          return;
        }

        const guessWord = activeRow.letters.join("").toUpperCase();

        // Validate word
        const valid = await isValidWord(guessWord);
        if (!valid) {
          triggerRowShake("Not in valid dictionary");
          return;
        }

        // Evaluate guess
        const statuses = evaluateWordleGuess(guessWord, targetWord);

        // Update keyboard colors
        setKeyboardStatus((prev) => {
          const next = { ...prev };
          statuses.forEach((status, i) => {
            const letter = activeRow.letters[i];
            const currentPriority = next[letter];
            if (status === "correct" || currentPriority !== "correct") {
              if (status === "present" && currentPriority === "correct") {
                // keep correct
              } else {
                next[letter] = status;
              }
            }
          });
          return next;
        });

        // Update User Guesses row
        const updatedRow: GuessRow = {
          letters: activeRow.letters,
          statuses,
          isSubmitted: true,
        };

        const nextGuesses = [...userGuesses];
        nextGuesses[currentGuessIndex] = updatedRow;
        setUserGuesses(nextGuesses);

        // Update user player stats in sidebar
        const isSolved = guessWord === targetWord;
        const guessNumber = currentGuessIndex + 1;
        const roundPoints = isSolved ? Math.max(100, 250 - (guessNumber - 1) * 35) : 0;

        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === "user-1") {
              return {
                ...p,
                guesses: [...p.guesses, statuses],
                hasSolved: isSolved,
                solvedInRow: isSolved ? guessNumber : undefined,
                score: p.score + roundPoints,
                roundsWon: isSolved ? p.roundsWon + 1 : p.roundsWon,
              };
            }
            return p;
          })
        );

        if (isSolved) {
          // Solved round!
          const def = await getWordDefinition(targetWord);
          setTargetDefinition(def);
          setGameStatus(
            currentRound >= config.totalRounds ? "match_finished" : "round_won"
          );
        } else if (guessNumber >= config.maxChances) {
          // Out of chances
          const def = await getWordDefinition(targetWord);
          setTargetDefinition(def);
          setGameStatus(
            currentRound >= config.totalRounds ? "match_finished" : "round_lost"
          );
        } else {
          // Advance to next row
          setCurrentGuessIndex((prev) => prev + 1);
          setCurrentLetterIndex(0);
        }

        return;
      }

      // Alphabet key
      if (/^[A-Z]$/.test(upperKey)) {
        if (currentLetterIndex < config.wordLength) {
          setUserGuesses((prev) => {
            const next = [...prev];
            const activeRow = { ...next[currentGuessIndex] };
            const newLetters = [...activeRow.letters, upperKey];
            activeRow.letters = newLetters;
            next[currentGuessIndex] = activeRow;
            return next;
          });
          setCurrentLetterIndex((prev) => prev + 1);
        }
      }
    },
    [
      gameStatus,
      currentLetterIndex,
      currentGuessIndex,
      config.wordLength,
      config.maxChances,
      config.totalRounds,
      userGuesses,
      targetWord,
      currentRound,
      triggerRowShake,
    ]
  );

  // Global physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Enter") {
        e.preventDefault();
        handleKey("ENTER");
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleKey("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        handleKey(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKey]);

  // Advance to next round
  const nextRound = useCallback(() => {
    initRound(currentRound + 1, config);
  }, [currentRound, config, initRound]);

  // Restart match from round 1
  const resetMatch = useCallback(() => {
    setPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        score: 0,
        roundsWon: 0,
        guesses: [],
        hasSolved: false,
      }))
    );
    initRound(1, config);
  }, [config, initRound]);

  // Apply new room config
  const applyRoomConfig = useCallback(
    (newConfig: RoomConfig) => {
      setConfig(newConfig);
      setPlayers((prev) =>
        prev.map((p) => ({
          ...p,
          score: 0,
          roundsWon: 0,
          guesses: [],
          hasSolved: false,
        }))
      );
      initRound(1, newConfig);
    },
    [initRound]
  );

  return {
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
  };
}
