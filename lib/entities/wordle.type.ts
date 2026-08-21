export type TileStatus = "empty" | "tbd" | "correct" | "present" | "absent";

export interface TileData {
  letter: string;
  status: TileStatus;
}

export interface GuessRow {
  letters: string[];
  statuses: TileStatus[];
  isSubmitted: boolean;
}

export interface PlayerStats {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
  score: number;
  roundsWon: number;
  guesses: TileStatus[][]; // opponent colored tile matrices without revealing letters
  hasSolved: boolean;
  solvedInRow?: number;
  solvedTime?: number;
}

export interface RoomConfig {
  roomId: string;
  passkey?: string;
  isPrivate: boolean;
  wordLength: number; // 4 to 8
  maxChances: number; // 4 to 10
  timeLimitSeconds: number; // 0 = unlimited, 30, 60, 90, 120
  totalRounds: number; // 1 to 10
}

export interface GameState {
  config: RoomConfig;
  currentRound: number;
  targetWord: string;
  targetDefinition?: string;
  userGuesses: GuessRow[];
  currentGuessIndex: number;
  currentLetterIndex: number;
  timeLeft: number;
  gameStatus: "lobby" | "playing" | "round_won" | "round_lost" | "match_finished";
  players: PlayerStats[];
  keyboardStatus: Record<string, TileStatus>;
  invalidWordAlert?: string;
  shakeRowIndex?: number;
}
