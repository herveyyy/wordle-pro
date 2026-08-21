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
  validateWordOnline,
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
  playerAvatar?: string,
  initialWords?: string[],
  playerId?: string,
  initialIsHost: boolean = true
) {
  const [myPlayerId] = useState<string>(
    () =>
      playerId ||
      (typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `user-${Math.random().toString(36).substring(2, 9)}`)
  );

  const [config, setConfig] = useState<RoomConfig>(initialConfig);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [targetWord, setTargetWord] = useState<string>("");
  const [targetDefinition, setTargetDefinition] = useState<string | undefined>();
  const [userGuesses, setUserGuesses] = useState<GuessRow[]>([]);
  const [currentGuessIndex, setCurrentGuessIndex] = useState<number>(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(initialConfig.timeLimitSeconds);
  const [gameStatus, setGameStatus] = useState<GameState["gameStatus"]>("lobby");
  const [players, setPlayers] = useState<PlayerStats[]>(() => {
    const list: PlayerStats[] = [
      {
        id: myPlayerId,
        name: `${playerName} (You)`,
        avatar: playerAvatar,
        score: 0,
        roundsWon: 0,
        guesses: [],
        hasSolved: false,
        isHost: initialIsHost,
        isReady: true,
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

  // WebRTC & Cloud Real-Time Channel Sync
  useEffect(() => {
    if (!config.useWebRtc) return;

    const channel = new WebRtcGameChannel(config.roomId);
    webrtcChannelRef.current = channel;

    // Register initial local player presence
    channel.setLocalPlayer({
      id: myPlayerId,
      name: `${playerName} (You)`,
      avatar: playerAvatar,
      isHost: initialIsHost,
      isReady: true,
      score: 0,
      roundsWon: 0,
      guesses: [],
      hasSolved: false,
    });

    // Listen to peer updates in the room
    channel.subscribe((msg: WebRtcGameMessage) => {
      if (msg.senderId === myPlayerId) return; // ignore self

      if (msg.type === "PEER_JOIN") {
        setPlayers((prev) => {
          if (prev.some((p) => p.id === msg.senderId)) return prev;
          return [
            ...prev,
            {
              id: msg.senderId,
              name: msg.senderName.replace(" (You)", ""),
              avatar: msg.senderAvatar,
              score: 0,
              roundsWon: 0,
              guesses: [],
              hasSolved: false,
              isReady: true,
            },
          ];
        });
      } else if (msg.type === "ROOM_PLAYERS_SYNC" && msg.players) {
        setPlayers((prev) => {
          const bots = prev.filter((p) => p.id.startsWith("bot-"));
          const selfPlayer = prev.find((p) => p.id === myPlayerId) || {
            id: myPlayerId,
            name: `${playerName} (You)`,
            avatar: playerAvatar,
            score: 0,
            roundsWon: 0,
            guesses: [],
            hasSolved: false,
            isHost: initialIsHost,
            isReady: true,
          };

          const remoteHumans: PlayerStats[] = (msg.players || [])
            .filter((rp) => rp.id !== myPlayerId)
            .map((rp) => {
              const existing = prev.find((p) => p.id === rp.id);
              return {
                id: rp.id,
                name: rp.name.replace(" (You)", ""),
                avatar: rp.avatar || existing?.avatar,
                score: rp.score !== undefined ? rp.score : (existing?.score ?? 0),
                roundsWon: rp.roundsWon !== undefined ? rp.roundsWon : (existing?.roundsWon ?? 0),
                guesses: rp.guesses && rp.guesses.length > 0 ? rp.guesses : (existing?.guesses ?? []),
                hasSolved: rp.hasSolved !== undefined ? rp.hasSolved : (existing?.hasSolved ?? false),
                solvedInRow: rp.solvedInRow !== undefined ? rp.solvedInRow : existing?.solvedInRow,
                isHost: Boolean(rp.isHost),
                isReady: rp.isReady ?? true,
              };
            });

          return [selfPlayer, ...remoteHumans, ...bots];
        });
      } else if (msg.type === "MATCH_START") {
        setGameStatus("playing");
        initRound(1, config, "playing");
      } else if (msg.type === "HOST_CONFIG_SYNC" && msg.config) {
        setConfig(msg.config);
      } else if (msg.type === "HOST_NEXT_ROUND" && msg.round) {
        initRound(msg.round, config, "playing");
      } else if (msg.type === "HOST_RESET_MATCH") {
        setPlayers((prev) =>
          prev.map((p) => ({
            ...p,
            score: 0,
            roundsWon: 0,
            guesses: [],
            hasSolved: false,
          }))
        );
        initRound(1, config, "lobby");
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

    // Announce self
    channel.broadcast({
      type: "PEER_JOIN",
      roomId: config.roomId,
      senderId: myPlayerId,
      senderName: playerName,
      senderAvatar: playerAvatar,
    });

    return () => {
      channel.destroy();
      webrtcChannelRef.current = null;
    };
  }, [config.roomId, config.useWebRtc, playerName, playerAvatar, myPlayerId, initialIsHost]);

  // Initialize a round with the exact server-side room word or seeded target word
  const initRound = useCallback(
    async (roundNum: number, currentCfg: RoomConfig, targetStatus: GameState["gameStatus"] = "playing") => {
      let word = initialWords?.[roundNum - 1];
      if (!word || word.length !== currentCfg.wordLength) {
        word = await getRandomWord(currentCfg.wordLength, currentCfg.roomId, roundNum);
      }
      const cleanWord = word.toUpperCase();
      setTargetWord(cleanWord);
      setTargetDefinition(undefined);
      setCurrentRound(roundNum);
      setCurrentGuessIndex(0);
      setCurrentLetterIndex(0);
      setTimeLeft(currentCfg.timeLimitSeconds);
      setKeyboardStatus({});
      setInvalidWordAlert(undefined);
      setShakeRowIndex(undefined);
      setGameStatus(targetStatus);

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
    [initialWords]
  );

  // Start fresh game / setup initial board in lobby state on mount
  useEffect(() => {
    initRound(1, config, "lobby");
  }, [config, initRound]);

  // Host starts the match
  const startMatch = useCallback(() => {
    setGameStatus("playing");
    initRound(1, config, "playing");
    if (webrtcChannelRef.current) {
      webrtcChannelRef.current.broadcast({
        type: "MATCH_START",
        roomId: config.roomId,
        senderId: myPlayerId,
        senderName: `${playerName} (You)`,
        round: 1,
      });
    }
  }, [config, initRound, playerName, myPlayerId]);

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
        const activeRow = userGuesses[currentGuessIndex];
        const lettersCount = activeRow?.letters?.length || 0;
        if (lettersCount > 0) {
          setUserGuesses((prev) => {
            const next = [...prev];
            const currentLetters = [...next[currentGuessIndex].letters];
            currentLetters.pop();
            next[currentGuessIndex] = {
              ...next[currentGuessIndex],
              letters: currentLetters,
            };
            return next;
          });
          setCurrentLetterIndex(lettersCount - 1);
        }
      } else if (upperKey === "ENTER") {
        const activeRow = userGuesses[currentGuessIndex];
        if (!activeRow || activeRow.letters.length !== config.wordLength) {
          triggerRowShake(`Word must be ${config.wordLength} letters`);
          return;
        }

        const guessWord = activeRow.letters.join("").toUpperCase();

        // Validate dictionary word
        let valid = isValidWord(guessWord, config.wordLength);
        if (!valid) {
          valid = await validateWordOnline(guessWord);
        }
        if (!valid) {
          triggerRowShake("Not in valid dictionary");
          return;
        }

        // Evaluate guess colors
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
          letters: activeRow.letters.slice(0, config.wordLength),
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

        // Broadcast guess via WebRTC & Cloud Channel
        if (webrtcChannelRef.current) {
          webrtcChannelRef.current.broadcast({
            type: "PEER_GUESS",
            roomId: config.roomId,
            senderId: myPlayerId,
            senderName: `${playerName} (You)`,
            senderAvatar: playerAvatar,
            round: currentRound,
            guessStatuses: statuses,
          });
        }

        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === myPlayerId) {
              const updatedGuesses = [...p.guesses, statuses];
              const updatedScore = p.score + roundPoints;
              const updatedRoundsWon = isSolved ? p.roundsWon + 1 : p.roundsWon;

              // Keep local player state synced to cloud
              if (webrtcChannelRef.current) {
                webrtcChannelRef.current.setLocalPlayer({
                  id: myPlayerId,
                  name: `${playerName} (You)`,
                  avatar: playerAvatar,
                  isHost: p.isHost,
                  isReady: true,
                  score: updatedScore,
                  roundsWon: updatedRoundsWon,
                  guesses: updatedGuesses,
                  hasSolved: isSolved,
                  solvedInRow: isSolved ? guessNumber : undefined,
                });
              }

              return {
                ...p,
                guesses: updatedGuesses,
                hasSolved: isSolved,
                solvedInRow: isSolved ? guessNumber : undefined,
                score: updatedScore,
                roundsWon: updatedRoundsWon,
              };
            }
            return p;
          })
        );

        if (isSolved) {
          // Broadcast solve via WebRTC & Cloud
          if (webrtcChannelRef.current) {
            webrtcChannelRef.current.broadcast({
              type: "PEER_SOLVED",
              roomId: config.roomId,
              senderId: myPlayerId,
              senderName: `${playerName} (You)`,
              senderAvatar: playerAvatar,
              round: currentRound,
              score: roundPoints,
              solvedInRow: guessNumber,
            });
          }

          getWordDefinition(targetWord).then((def) => {
            setTargetDefinition(def);
          });

          if (currentRound >= config.totalRounds) {
            setGameStatus("match_finished");
          } else {
            setGameStatus("round_won");
          }
        } else if (guessNumber >= config.maxChances) {
          // Lost this round
          getWordDefinition(targetWord).then((def) => {
            setTargetDefinition(def);
          });

          if (currentRound >= config.totalRounds) {
            setGameStatus("match_finished");
          } else {
            setGameStatus("round_lost");
          }
        } else {
          // Next guess row
          setCurrentGuessIndex((prev) => prev + 1);
          setCurrentLetterIndex(0);
        }
      } else if (/^[A-Z]$/.test(upperKey)) {
        const activeRow = userGuesses[currentGuessIndex];
        const lettersCount = activeRow?.letters?.length || 0;
        if (lettersCount < config.wordLength) {
          setUserGuesses((prev) => {
            const next = [...prev];
            const currentLetters = [...(next[currentGuessIndex]?.letters || [])];
            currentLetters.push(upperKey);
            next[currentGuessIndex] = {
              ...next[currentGuessIndex],
              letters: currentLetters,
            };
            return next;
          });
          setCurrentLetterIndex(lettersCount + 1);
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
      playerAvatar,
      myPlayerId,
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
    const nextR = currentRound + 1;
    initRound(nextR, config);
    if (webrtcChannelRef.current) {
      webrtcChannelRef.current.broadcast({
        type: "HOST_NEXT_ROUND",
        roomId: config.roomId,
        senderId: myPlayerId,
        senderName: `${playerName} (You)`,
        round: nextR,
      });
    }
  }, [currentRound, config, initRound, myPlayerId, playerName]);

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
    if (webrtcChannelRef.current) {
      webrtcChannelRef.current.broadcast({
        type: "HOST_RESET_MATCH",
        roomId: config.roomId,
        senderId: myPlayerId,
        senderName: `${playerName} (You)`,
        round: 1,
      });
    }
  }, [config, initRound, myPlayerId, playerName]);

  // Apply new room config
  const applyRoomConfig = useCallback(
    (newConfig: RoomConfig) => {
      setConfig(newConfig);

      // Keep URL search query in sync with new room config and passkey
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("room", newConfig.roomId);
        url.searchParams.set("letters", String(newConfig.wordLength));
        url.searchParams.set("chances", String(newConfig.maxChances));
        url.searchParams.set("timer", String(newConfig.timeLimitSeconds));
        url.searchParams.set("rounds", String(newConfig.totalRounds));
        url.searchParams.set("bots", String(newConfig.botCount));
        url.searchParams.set("diff", newConfig.botDifficulty);
        if (newConfig.isPrivate && newConfig.passkey) {
          url.searchParams.set("passkey", newConfig.passkey);
        } else {
          url.searchParams.delete("passkey");
        }
        window.history.replaceState({}, "", url.toString());
      }

      // Broadcast updated config to all peers
      if (webrtcChannelRef.current) {
        webrtcChannelRef.current.broadcast({
          type: "HOST_CONFIG_SYNC",
          roomId: newConfig.roomId,
          senderId: myPlayerId,
          senderName: `${playerName} (You)`,
          config: newConfig,
        });
      }

      // Rebuild player roster preserving human players
      setPlayers((prev) => {
        const humans = prev.filter((p) => !p.id.startsWith("bot-"));
        const newBots: PlayerStats[] = [];

        if (newConfig.botDifficulty !== "off" && newConfig.botCount > 0) {
          for (let i = 0; i < Math.min(4, newConfig.botCount); i++) {
            newBots.push({
              id: `bot-${i + 1}`,
              name: `${BOT_NAMES[i] || `Bot_${i + 1}`} 🤖`,
              score: 0,
              roundsWon: 0,
              guesses: [],
              hasSolved: false,
            });
          }
        }
        return [...humans, ...newBots];
      });

      initRound(1, newConfig, gameStatus === "lobby" ? "lobby" : "playing");
    },
    [initRound, playerName, myPlayerId, gameStatus]
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
    myPlayerId,
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
  };
}
