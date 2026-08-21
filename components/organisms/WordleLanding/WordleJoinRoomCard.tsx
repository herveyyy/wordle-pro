"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useButtonStyles } from "@/components/atoms/Button/button.hooks";

interface WordleJoinRoomCardProps {
  isAuthenticated?: boolean;
}

export function WordleJoinRoomCard({ isAuthenticated = false }: WordleJoinRoomCardProps) {
  const [roomId, setRoomId] = useState("");
  const [passkey, setPasskey] = useState("");
  const router = useRouter();
  const primaryBtnClass = useButtonStyles("primary");

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRoom = roomId.trim().toUpperCase() || "PRO-892";
    const search = new URLSearchParams();
    search.set("room", cleanRoom);
    if (passkey.trim()) {
      search.set("passkey", passkey.trim().toUpperCase());
    }

    const playUrl = `/play?${search.toString()}`;

    if (isAuthenticated) {
      router.push(playUrl);
    } else {
      router.push(`/sign-in?callbackURL=${encodeURIComponent(playUrl)}`);
    }
  };

  return (
    <div className="futuristic-frame relative w-full overflow-hidden rounded-3xl border border-primary/20 bg-surface-container-low/95 p-6 shadow-xl backdrop-blur-xl md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
            Multiplayer Match
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-on-surface">
            Join Existing Room
          </h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
          {isAuthenticated ? "✓ Verified Gamer" : "🔒 Sign In Required"}
        </span>
      </div>

      <p className="text-xs text-on-surface-muted mb-5">
        Have a room code or passkey from a friend or Discord server? Enter it below to jump directly into their match.
      </p>

      <form onSubmit={handleJoin} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-muted block mb-1">
            Room Code
          </label>
          <input
            type="text"
            placeholder="e.g. PRO-892"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="w-full rounded-2xl border border-primary/20 bg-surface-container-lowest px-4 py-3 font-mono text-sm font-bold uppercase text-on-surface placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-muted block mb-1">
            Passkey (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. SECRET"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value.toUpperCase())}
            className="w-full rounded-2xl border border-primary/20 bg-surface-container-lowest px-4 py-3 font-mono text-sm font-bold uppercase text-primary placeholder:text-on-surface-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className={`${primaryBtnClass} w-full sm:w-auto px-7 py-3 text-sm font-bold shadow-md`}
          >
            {isAuthenticated ? "Join Room →" : "🔒 Sign In & Join →"}
          </button>
        </div>
      </form>
    </div>
  );
}
