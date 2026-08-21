"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  GameState,
  RoomConfig,
  GuessRow,
  TileStatus,
  PlayerStats,
  BotDifficulty,
} from "@/lib/entities/wordle.type";
import {
  getRandomWord,
  evaluateWordleGuess,
  isValidWord,
  getWordDefinition,
} from "@/lib/domain/services/wordle.service";
import {
  WebRtcGameChannel,
  WebRtcGameMessage,
} from "@/lib/domain/services/webrtcGame.service";

const DEFAULT_CONFIG: RoomConfig = {
  roomId: "PRO-892",
  passkey: "PRO777",
  isPrivate: true,
  wordLength: 5,
  maxChances: 6,
  timeLimitSeconds: 60,
  totalRounds: 3,
  botCount: 2,
  botDifficulty: "medium",
  useWebRtc: true,
};

const BOT_NAMES = ["CyberBot_X", "Nova_Word", "Matrix_AI", "Synapse_Bot"];

export function useWordleGame(
  initialConfig: RoomConfig = DEFAULT_CONFIG,
  playerName: string = "Alex",
  playerAvatar?: string
) {
  const [config, setConfig] = useState<RoomConfig>(initialConfig);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [targetWord, setTargetWord] = useState<string>("");
  const [targetDefinition, setTargetDefinition] = useState<string | undefined>();
  const [userGuesses, setUserGuesses] = useState<GuessRow[]>([]);
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialConfig.timeLimitSeconds);
  const [gameStatus, setGameStatus] = useState<GameState["gameStatus"]>("playing");
  const [players, setPlayers] = useState<PlayerStats[]>(() => {
    const list: PlayerStats[] = [
      {
        id: "user-1",
        name: `${playerName} (You)`,
        avatar: playerAvatar,
        score: 0,
        roundsWon: 0,
        guesses: [],
        hasSolved: false,
        isHost: true,
      },
    ];

    if (initialConfig.botDifficulty !== "off" && initialConfig.botCount > 0) {
      for (let i = 0; i < Math.min(4, initialConfig.botCount); i++) {
        list.push({
          id: `bot-${i + 1}`,
          name: `${BOT_NAMES[i] || `Bot_${i + 1}`} 🤖`,
          score: 0,
          roundsWon: 0,
          guesses: [],
          hasSolved: false,
        });
      }
    }
    return list;
  });

  const [keyboardStatus, setKeyboardStatus] = useState<Record<string, TileStatus>>({});
  const [invalidWordAlert, setInvalidWordAlert] = useState<string | undefined>();
  const [shakeRowIndex, setShakeRowIndex] = useState<number | undefined>();
  const [isLobbyModalOpen, setIsLobbyModalOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const botIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const webrtcChannelRef = useRef<WebRtcGameChannel | null>(null);

  // WebRTC P2P Real-Time Data Channel Sync
  useEffect(() => {
    if (!config.useWebRtc) return;

    const channel = new WebRtcGameChannel(config.roomId);
    webrtcChannelRef.current = channel;

    // Listen to peer updates in the room
    channel.subscribe((msg: WebRtcGameMessage) => {
      if (msg.senderId === "user-1") return; // ignore self

      if (msg.type === "PEER_JOIN") {
        setPlayers((prev) => {
          if (prev.some((p) => p.id === msg.senderId)) return prev;
          return [
            ...prev,
            {
              id: msg.senderId,
              name: msg.senderName,
              avatar: msg.senderAvatar,
              score: 0,
              roundsWon: 0,
              guesses: [],
              hasSolved: false,
            },
          ];
        });
      } else if (msg.type === "PEER_GUESS" && msg.guessStatuses) {
        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === msg.senderId) {
              return {
                ...p,
                avatar: msg.senderAvatar || p.avatar,
                guesses: [...p.guesses, msg.guessStatuses!],
              };
            }
            return p;
          })
        );
      } else if (msg.type === "PEER_SOLVED") {
        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === msg.senderId) {
              return {
                ...p,
                hasSolved: true,
                solvedInRow: msg.solvedInRow,
                score: p.score + (msg.score || 150),
                roundsWon: p.roundsWon + 1,
              };
            }
            return p;
          })
        );
      }
    });

    // Announce self with Discord avatar
    channel.broadcast({
      type: "PEER_JOIN",
      roomId: config.roomId,
      senderId: "user-1",
      senderName: `${playerName} (You)`,
      senderAvatar: playerAvatar,
    });

    return () => {
      channel.destroy();
      webrtcChannelRef.current = null;
    };
  }, [config.roomId, config.useWebRtc, playerName, playerAvatar]);

  // Initialize a round with a synchronized target word
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

  // Bot Simulation governed by botDifficulty & botCount
  useEffect(() => {
    if (
      gameStatus !== "playing" ||
      config.botDifficulty === "off" ||
      config.botCount === 0
    ) {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
      return;
    }

    const intervalSpeed =
      config.botDifficulty === "pro"
        ? 3500
        : config.botDifficulty === "easy"
          ? 7000
          : 5000;

    botIntervalRef.current = setInterval(() => {
      setPlayers((prev) => {
        return prev.map((p) => {
          if (!p.id.startsWith("bot-") || p.hasSolved || p.guesses.length >= config.maxChances) {
            return p;
          }

          const currentGuessNum = p.guesses.length + 1;
          const winProbability =
            config.botDifficulty === "pro"
              ? 0.45
              : config.botDifficulty === "easy"
                ? 0.18
                : 0.28;

          const isWinningGuess =
            Math.random() < winProbability || currentGuessNum === config.maxChances - 1;

          let newRowStatuses: TileStatus[];
          if (isWinningGuess) {
            newRowStatuses = Array(config.wordLength).fill("correct");
          } else {
            newRowStatuses = Array.from({ length: config.wordLength }).map(() => {
              const r = Math.random();
              return r > 0.55 ? "correct" : r > 0.25 ? "present" : "absent";
            });
          }

          const hasSolved = isWinningGuess;
          const addedScore = hasSolved ? Math.max(80, 240 - currentGuessNum * 30) : 0;

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
    }, intervalSpeed);

    return () => {
      if (botIntervalRef.current) clearInterval(botIntervalRef.current);
    };
  }, [gameStatus, config.maxChances, config.wordLength, config.botDifficulty, config.botCount]);

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

        // Validate word in open dictionary
        const valid = await isValidWord(guessWord);
        if (!valid) {
          triggerRowShake("Not in valid dictionary");
          return;
        }

        // Evaluate guess
        const statuses = evaluateWordleGuess(guessWord, targetWord);

        // Broadcast guess via WebRTC P2P DataChannel (NO letters revealed, only colors)
        if (webrtcChannelRef.current) {
          webrtcChannelRef.current.broadcast({
            type: "PEER_GUESS",
            roomId: config.roomId,
            senderId: "user-1",
            senderName: `${playerName} (You)`,
            round: currentRound,
            guessStatuses: statuses,
          });
        }

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

        // Update user player stats
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
          // Broadcast solve via WebRTC P2P
          if (webrtcChannelRef.current) {
            webrtcChannelRef.current.broadcast({
              type: "PEER_SOLVED",
              roomId: config.roomId,
              senderId: "user-1",
              senderName: `${playerName} (You)`,
              round: currentRound,
              score: roundPoints,
              solvedInRow: guessNumber,
            });
          }

          const def = await getWordDefinition(targetWord);
          setTargetDefinition(def);
          setGameStatus(
            currentRound >= config.totalRounds ? "match_finished" : "round_won"
          );
        } else if (guessNumber >= config.maxChances) {
          const def = await getWordDefinition(targetWord);
          setTargetDefinition(def);
          setGameStatus(
            currentRound >= config.totalRounds ? "match_finished" : "round_lost"
          );
        } else {
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
      config.roomId,
      userGuesses,
      targetWord,
      currentRound,
      playerName,
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

      // Rebuild player roster based on new botCount & botDifficulty
      const updatedList: PlayerStats[] = [
        {
          id: "user-1",
          name: `${playerName} (You)`,
          score: 0,
          roundsWon: 0,
          guesses: [],
          hasSolved: false,
          isHost: true,
        },
      ];

      if (newConfig.botDifficulty !== "off" && newConfig.botCount > 0) {
        for (let i = 0; i < Math.min(4, newConfig.botCount); i++) {
          updatedList.push({
            id: `bot-${i + 1}`,
            name: `${BOT_NAMES[i] || `Bot_${i + 1}`} 🤖`,
            score: 0,
            roundsWon: 0,
            guesses: [],
            hasSolved: false,
          });
        }
      }

      setPlayers(updatedList);
      initRound(1, newConfig);
    },
    [initRound, playerName]
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
