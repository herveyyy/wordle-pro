"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface WordleJoinRoomCardProps {
  isAuthenticated?: boolean;
}

export function WordleJoinRoomCard({ isAuthenticated = false }: WordleJoinRoomCardProps) {
  const [roomId, setRoomId] = useState("");
  const [passkey, setPasskey] = useState("");
  const router = useRouter();

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
    <div className="comic-card relative w-full overflow-hidden rounded-3xl bg-surface-container-low/98 p-6 shadow-2xl backdrop-blur-xl md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className="inline-block rounded-lg bg-secondary/20 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-secondary">
            🔑 Multiplayer Match
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-extrabold text-on-surface mt-1">
            Join Existing Room
          </h3>
        </div>
        <span className="rounded-full border-2 border-emerald-500/30 bg-emerald-500/15 px-3.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          {isAuthenticated ? "✓ Verified Gamer" : "🔒 Sign In Required"}
        </span>
      </div>

      <p className="text-xs text-on-surface-muted mb-5">
        Have a room code or passkey from a friend or Discord server? Enter it below to jump directly into their match.
      </p>

      <form onSubmit={handleJoin} className="grid gap-3.5 sm:grid-cols-[1fr_1fr_auto]">
        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-muted block mb-1">
            Room Code
          </label>
          <input
            type="text"
            placeholder="e.g. PRO-892"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
            className="w-full rounded-2xl border-2 border-primary/30 bg-surface-container-lowest px-4 py-3 font-mono text-sm font-extrabold uppercase text-on-surface placeholder:text-on-surface-muted/50 focus:outline-none focus:border-primary shadow-xs"
          />
        </div>

        <div>
          <label className="text-[11px] font-extrabold uppercase tracking-wider text-on-surface-muted block mb-1">
            Passkey (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. SECRET"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value.toUpperCase())}
            className="w-full rounded-2xl border-2 border-secondary/30 bg-surface-container-lowest px-4 py-3 font-mono text-sm font-extrabold uppercase text-secondary placeholder:text-on-surface-muted/50 focus:outline-none focus:border-secondary shadow-xs"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="comic-btn-primary w-full sm:w-auto px-7 py-3 text-xs sm:text-sm font-extrabold rounded-2xl"
          >
            {isAuthenticated ? "🚀 Join Room →" : "🔒 Sign In & Join →"}
          </button>
        </div>
      </form>
    </div>
  );
}
