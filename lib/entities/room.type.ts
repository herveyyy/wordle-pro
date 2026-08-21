import { RoomConfig } from "./wordle.type";

export interface DbRoom {
  id: string;
  wordLength: number;
  maxChances: number;
  timeLimitSeconds: number;
  totalRounds: number;
  botCount: number;
  botDifficulty: "easy" | "medium" | "pro" | "off";
  isPrivate: boolean;
  passkey?: string | null;
  words: string[]; // Decoded JSON list of words
  hostId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
