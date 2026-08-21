import { database } from "@/database";
import { room } from "@/database/schema";
import { DbRoom } from "@/lib/entities/room.type";

export interface CreateRoomInput {
  id: string;
  wordLength: number;
  maxChances: number;
  timeLimitSeconds: number;
  totalRounds: number;
  botCount: number;
  botDifficulty: "easy" | "medium" | "pro" | "off";
  isPrivate: boolean;
  passkey?: string | null;
  words: string[];
  hostId?: string | null;
}

export async function createRoomUseCase(input: CreateRoomInput): Promise<DbRoom> {
  const jsonWords = JSON.stringify(input.words);

  try {
    await database
      .insert(room)
      .values({
        id: input.id,
        wordLength: input.wordLength,
        maxChances: input.maxChances,
        timeLimitSeconds: input.timeLimitSeconds,
        totalRounds: input.totalRounds,
        botCount: input.botCount,
        botDifficulty: input.botDifficulty,
        isPrivate: input.isPrivate,
        passkey: input.passkey || null,
        words: jsonWords,
        hostId: input.hostId || null,
      })
      .onConflictDoUpdate({
        target: room.id,
        set: {
          wordLength: input.wordLength,
          maxChances: input.maxChances,
          timeLimitSeconds: input.timeLimitSeconds,
          totalRounds: input.totalRounds,
          botCount: input.botCount,
          botDifficulty: input.botDifficulty,
          isPrivate: input.isPrivate,
          passkey: input.passkey || null,
          words: jsonWords,
          updatedAt: new Date(),
        },
      });
  } catch (error) {
    console.warn("createRoomUseCase insert/update error:", error);
  }

  return {
    id: input.id,
    wordLength: input.wordLength,
    maxChances: input.maxChances,
    timeLimitSeconds: input.timeLimitSeconds,
    totalRounds: input.totalRounds,
    botCount: input.botCount,
    botDifficulty: input.botDifficulty,
    isPrivate: input.isPrivate,
    passkey: input.passkey,
    words: input.words,
    hostId: input.hostId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
