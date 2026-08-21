"use server";

import { getOrCreateRoom } from "../services/room.service";
import { RoomConfig } from "@/lib/entities/wordle.type";
import { auth } from "../services/auth.service";

export async function getOrCreateRoomAction(config: Partial<RoomConfig> & { roomId: string }) {
  try {
    const session = await auth();
    const hostId = session?.user?.id;

    const result = await getOrCreateRoom({
      ...config,
      hostId,
    });

    return {
      ok: true,
      data: result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load room from database";
    return {
      ok: false,
      error: message,
    };
  }
}
