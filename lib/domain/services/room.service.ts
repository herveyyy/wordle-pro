import { getRoomUseCase } from "../usecases/room/get_room.usecase";
import { createRoomUseCase, CreateRoomInput } from "../usecases/room/create_room.usecase";
import { fetchWordsForRoom } from "./wordle.service";
import { DbRoom } from "@/lib/entities/room.type";
import { RoomConfig } from "@/lib/entities/wordle.type";

export async function getOrCreateRoom(
  config: Partial<RoomConfig> & { roomId: string; hostId?: string }
): Promise<{ room: DbRoom; words: string[] }> {
  const cleanRoomId = config.roomId.trim().toUpperCase();

  // 1. Check if room exists in Database
  const existing = await getRoomUseCase(cleanRoomId);
  if (existing && existing.words && existing.words.length > 0) {
    return {
      room: existing,
      words: existing.words,
    };
  }

  // 2. Room does not exist yet: fetch word sequence for match from KushCreates API
  const wordLength = Number(config.wordLength) || 5;
  const totalRounds = Number(config.totalRounds) || 3;
  const maxChances = Number(config.maxChances) || 6;
  const timeLimitSeconds = config.timeLimitSeconds !== undefined ? Number(config.timeLimitSeconds) : 60;
  const botCount = config.botCount !== undefined ? Number(config.botCount) : 2;
  const botDifficulty = botCount === 0 ? "off" : config.botDifficulty || "medium";
  const isPrivate = Boolean(config.isPrivate || config.passkey);
  const passkey = config.passkey || null;

  const generatedWords = await fetchWordsForRoom(wordLength, totalRounds);

  // 3. Save room configuration & words to DB
  const roomData: CreateRoomInput = {
    id: cleanRoomId,
    wordLength,
    maxChances,
    timeLimitSeconds,
    totalRounds,
    botCount,
    botDifficulty,
    isPrivate,
    passkey,
    words: generatedWords,
    hostId: config.hostId || null,
  };

  const created = await createRoomUseCase(roomData);

  return {
    room: created,
    words: generatedWords,
  };
}
