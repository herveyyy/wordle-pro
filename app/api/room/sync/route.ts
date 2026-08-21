import { NextRequest, NextResponse } from "next/server";
import { database } from "@/database";
import { room, roomPlayer, roomEvent } from "@/database/schema";
import { eq, and, gte, lt } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      roomId: rawRoomId,
      player,
      action,
      payload,
      sinceTimestamp = Date.now() - 10000,
    } = body;

    if (!rawRoomId || !player?.id) {
      return NextResponse.json({ error: "Missing roomId or player" }, { status: 400 });
    }

    const roomId = String(rawRoomId).trim().toUpperCase();
    const playerId = String(player.id).trim();
    const recordId = `${roomId}_${playerId}`;

    // 1. Handle player leave
    if (action === "LEAVE") {
      await database.delete(roomPlayer).where(eq(roomPlayer.id, recordId));
      return NextResponse.json({ ok: true });
    }

    // 2. Upsert player presence & state
    const cleanGuesses = Array.isArray(player.guesses) ? JSON.stringify(player.guesses) : "[]";
    const now = new Date();

    await database
      .insert(roomPlayer)
      .values({
        id: recordId,
        roomId,
        userId: playerId,
        name: player.name || "Player",
        avatar: player.avatar || null,
        isHost: Boolean(player.isHost),
        isReady: player.isReady !== undefined ? Boolean(player.isReady) : true,
        score: Number(player.score) || 0,
        roundsWon: Number(player.roundsWon) || 0,
        guesses: cleanGuesses,
        hasSolved: Boolean(player.hasSolved),
        solvedInRow: player.solvedInRow ? Number(player.solvedInRow) : null,
        lastActiveAt: now,
      })
      .onConflictDoUpdate({
        target: roomPlayer.id,
        set: {
          name: player.name || "Player",
          avatar: player.avatar || null,
          isHost: Boolean(player.isHost),
          isReady: player.isReady !== undefined ? Boolean(player.isReady) : true,
          score: Number(player.score) || 0,
          roundsWon: Number(player.roundsWon) || 0,
          guesses: cleanGuesses,
          hasSolved: Boolean(player.hasSolved),
          solvedInRow: player.solvedInRow ? Number(player.solvedInRow) : null,
          lastActiveAt: now,
        },
      });

    // 3. If room-level broadcast event (MATCH_START, HOST_CONFIG_SYNC, HOST_NEXT_ROUND, HOST_RESET_MATCH)
    if (
      action &&
      [
        "MATCH_START",
        "HOST_CONFIG_SYNC",
        "HOST_NEXT_ROUND",
        "HOST_RESET_MATCH",
      ].includes(action)
    ) {
      const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      await database.insert(roomEvent).values({
        id: eventId,
        roomId,
        senderId: playerId,
        type: action,
        payload: payload ? JSON.stringify(payload) : null,
        createdAt: now,
      });

      // If config sync, update DB room settings
      if (action === "HOST_CONFIG_SYNC" && payload?.config) {
        const cfg = payload.config;
        await database
          .update(room)
          .set({
            wordLength: cfg.wordLength,
            maxChances: cfg.maxChances,
            timeLimitSeconds: cfg.timeLimitSeconds,
            totalRounds: cfg.totalRounds,
            botCount: cfg.botCount,
            botDifficulty: cfg.botDifficulty,
            isPrivate: cfg.isPrivate,
            passkey: cfg.passkey || null,
            updatedAt: now,
          })
          .where(eq(room.id, roomId));
      }
    }

    // 4. Fetch all active players in this room (active in last 12 seconds)
    const activeCutoff = new Date(Date.now() - 12000);
    const activePlayerRows = await database
      .select()
      .from(roomPlayer)
      .where(and(eq(roomPlayer.roomId, roomId), gte(roomPlayer.lastActiveAt, activeCutoff)));

    const activePlayers = activePlayerRows.map((r) => {
      let parsedGuesses = [];
      try {
        parsedGuesses = JSON.parse(r.guesses);
      } catch {
        parsedGuesses = [];
      }
      return {
        id: r.userId,
        name: r.name,
        avatar: r.avatar || undefined,
        isHost: r.isHost,
        isReady: r.isReady,
        score: r.score,
        roundsWon: r.roundsWon,
        guesses: parsedGuesses,
        hasSolved: r.hasSolved,
        solvedInRow: r.solvedInRow || undefined,
      };
    });

    // 5. Fetch recent events for this room
    const sinceDate = new Date(Math.max(sinceTimestamp, Date.now() - 15000));
    const eventRows = await database
      .select()
      .from(roomEvent)
      .where(and(eq(roomEvent.roomId, roomId), gte(roomEvent.createdAt, sinceDate)))
      .orderBy(roomEvent.createdAt);

    const events = eventRows.map((e) => {
      let parsedPayload;
      try {
        parsedPayload = e.payload ? JSON.parse(e.payload) : undefined;
      } catch {
        parsedPayload = undefined;
      }
      return {
        id: e.id,
        type: e.type,
        senderId: e.senderId,
        payload: parsedPayload,
        timestamp: new Date(e.createdAt).getTime(),
      };
    });

    // 6. Asynchronous cleanup of ancient records (> 2 minutes old)
    const ancientCutoff = new Date(Date.now() - 120000);
    database
      .delete(roomPlayer)
      .where(and(eq(roomPlayer.roomId, roomId), lt(roomPlayer.lastActiveAt, ancientCutoff)))
      .catch(() => {});
    database
      .delete(roomEvent)
      .where(and(eq(roomEvent.roomId, roomId), lt(roomEvent.createdAt, ancientCutoff)))
      .catch(() => {});

    return NextResponse.json({
      ok: true,
      serverTime: Date.now(),
      players: activePlayers,
      events,
    });
  } catch (error) {
    console.error("Room sync error:", error);
    return NextResponse.json({ error: "Failed to sync room" }, { status: 500 });
  }
}
