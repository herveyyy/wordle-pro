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
  | "HOST_CONFIG_SYNC";

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
  timestamp: number;
}

export class WebRtcGameChannel {
  private channelName: string;
  private channel: BroadcastChannel | null = null;
  private onMessageCallback: ((msg: WebRtcGameMessage) => void) | null = null;

  constructor(roomId: string) {
    this.channelName = `wordle_pro_webrtc_${roomId.toUpperCase()}`;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel(this.channelName);
        this.channel.onmessage = (event: MessageEvent<WebRtcGameMessage>) => {
          if (this.onMessageCallback && event.data) {
            this.onMessageCallback(event.data);
          }
        };
      } catch (err) {
        console.warn("WebRTC broadcast channel initialization:", err);
      }
    }
  }

  public subscribe(callback: (msg: WebRtcGameMessage) => void) {
    this.onMessageCallback = callback;
  }

  public broadcast(msg: Omit<WebRtcGameMessage, "timestamp">) {
    const fullMsg: WebRtcGameMessage = {
      ...msg,
      timestamp: Date.now(),
    };

    if (this.channel) {
      try {
        this.channel.postMessage(fullMsg);
      } catch (err) {
        console.warn("Failed to broadcast WebRTC P2P game packet:", err);
      }
    }
  }

  public destroy() {
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
