import { database } from "@/database";
import { room } from "@/database/schema";
import { eq } from "drizzle-orm";
import { DbRoom } from "@/lib/entities/room.type";

export async function getRoomUseCase(roomId: string): Promise<DbRoom | null> {
  try {
    const rows = await database.select().from(room).where(eq(room.id, roomId)).limit(1);
    if (!rows || rows.length === 0) return null;

    const r = rows[0];
    let parsedWords: string[] = [];
    try {
      parsedWords = JSON.parse(r.words);
    } catch {
      parsedWords = [];
    }

    return {
      id: r.id,
      wordLength: r.wordLength,
      maxChances: r.maxChances,
      timeLimitSeconds: r.timeLimitSeconds,
      totalRounds: r.totalRounds,
      botCount: r.botCount,
      botDifficulty: r.botDifficulty as any,
      isPrivate: r.isPrivate,
      passkey: r.passkey,
      words: parsedWords,
      hostId: r.hostId,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  } catch (error) {
    console.warn("getRoomUseCase error:", error);
    return null;
  }
}
