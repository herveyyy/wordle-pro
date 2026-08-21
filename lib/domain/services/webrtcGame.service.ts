"use client";

import { PlayerStats, TileStatus, RoomConfig } from "@/lib/entities/wordle.type";

export type WebRtcMessageType =
  | "PEER_JOIN"
  | "PEER_LEAVE"
  | "PEER_READY"
  | "PEER_GUESS"
  | "PEER_SOLVED"
  | "MATCH_START"
  | "HOST_NEXT_ROUND"
  | "HOST_RESET_MATCH"
  | "HOST_CONFIG_SYNC"
  | "ROOM_PLAYERS_SYNC";

export interface WebRtcGameMessage {
  type: WebRtcMessageType;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  round?: number;
  guessStatuses?: TileStatus[];
  score?: number;
  solvedInRow?: number;
  config?: RoomConfig;
  players?: PlayerStats[];
  timestamp: number;
}

export interface PlayerSyncData {
  id: string;
  name: string;
  avatar?: string;
  isHost?: boolean;
  isReady?: boolean;
  score?: number;
  roundsWon?: number;
  guesses?: TileStatus[][];
  hasSolved?: boolean;
  solvedInRow?: number;
}

export class WebRtcGameChannel {
  private roomId: string;
  private channelName: string;
  private channel: BroadcastChannel | null = null;
  private onMessageCallback: ((msg: WebRtcGameMessage) => void) | null = null;
  private syncInterval: NodeJS.Timeout | null = null;
  private lastProcessedTimestamp: number = Date.now() - 10000;
  private processedEventIds: Set<string> = new Set();
  private currentPlayer: PlayerSyncData | null = null;

  constructor(roomId: string) {
    this.roomId = roomId.toUpperCase();
    this.channelName = `wordle_pro_webrtc_${this.roomId}`;

    // 1. Initialize local BroadcastChannel (for instant same-browser multi-tab testing)
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event: MessageEvent<WebRtcGameMessage>) => {
          if (this.onMessageCallback && event.data) {
            this.onMessageCallback(event.data);
          }
        };
      } catch (err) {
        console.warn("BroadcastChannel init warning:", err);
      }
    }

    // 2. Start Cloud Poller (every 1.5s) for real cross-device / internet sync
    if (typeof window !== "undefined") {
      this.syncInterval = setInterval(() => {
        this.performCloudSync();
      }, 1500);
    }
  }

  public setLocalPlayer(player: PlayerSyncData) {
    this.currentPlayer = player;
  }

  public subscribe(callback: (msg: WebRtcGameMessage) => void) {
    this.onMessageCallback = callback;
  }

  public async performCloudSync(action?: string, payload?: any) {
    if (!this.currentPlayer || typeof window === "undefined") return;

    try {
      const res = await fetch("/api/room/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: this.roomId,
          player: this.currentPlayer,
          action,
          payload,
          sinceTimestamp: this.lastProcessedTimestamp,
        }),
      });

      if (!res.ok) return;
      const data = await res.json();

      // Process new events from other players
      if (data.events && Array.isArray(data.events)) {
        for (const evt of data.events) {
          if (this.processedEventIds.has(evt.id)) continue;
          this.processedEventIds.add(evt.id);

          if (evt.timestamp > this.lastProcessedTimestamp) {
            this.lastProcessedTimestamp = evt.timestamp;
          }

          if (evt.senderId !== this.currentPlayer.id && this.onMessageCallback) {
            this.onMessageCallback({
              type: evt.type as WebRtcMessageType,
              roomId: this.roomId,
              senderId: evt.senderId,
              senderName: "Player",
              config: evt.payload?.config,
              round: evt.payload?.round,
              timestamp: evt.timestamp,
            });
          }
        }
      }

      // Sync active players in room
      if (data.players && Array.isArray(data.players) && this.onMessageCallback) {
        this.onMessageCallback({
          type: "ROOM_PLAYERS_SYNC",
          roomId: this.roomId,
          senderId: "server",
          senderName: "Server",
          players: data.players,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      console.warn("Cloud sync warning:", err);
    }
  }

  public broadcast(msg: Omit<WebRtcGameMessage, "timestamp">) {
    const fullMsg: WebRtcGameMessage = {
      ...msg,
      timestamp: Date.now(),
    };

    // Broadcast to local tabs
    if (this.channel) {
      try {
        this.channel.postMessage(fullMsg);
      } catch (err) {
        console.warn("Failed to post message to BroadcastChannel:", err);
      }
    }

    // Immediately trigger cloud sync for fast cross-network delivery
    this.performCloudSync(msg.type, {
      config: msg.config,
      round: msg.round,
      guessStatuses: msg.guessStatuses,
      score: msg.score,
      solvedInRow: msg.solvedInRow,
    });
  }

  public destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    // Inform server of leave
    if (this.currentPlayer && typeof window !== "undefined") {
      fetch("/api/room/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: this.roomId,
          player: this.currentPlayer,
          action: "LEAVE",
        }),
      }).catch(() => {});
    }

    if (this.channel) {
      try {
        this.channel.close();
      } catch {
        // ignore
      }
      this.channel = null;
    }
    this.onMessageCallback = null;
  }
}
