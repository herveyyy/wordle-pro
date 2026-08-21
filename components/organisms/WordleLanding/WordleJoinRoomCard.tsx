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
    <div className="neo-card relative w-full overflow-hidden bg-white dark:bg-slate-900 border-3 border-black dark:border-white shadow-[8px_8px_0px_#000000] dark:shadow-[8px_8px_0px_#ffffff] p-6 sm:p-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b-2.5 border-black dark:border-white pb-3">
        <div>
          <span className="neo-badge bg-yellow-300 text-black text-xs font-black rotate-[-1deg]">
            🔑 Multiplayer Match
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-black text-black dark:text-white mt-1">
            Join Existing Room
          </h3>
        </div>
        <span className="neo-badge bg-emerald-300 text-black text-xs font-black">
          {isAuthenticated ? "✓ Verified Player" : "🔒 Sign In Required"}
        </span>
      </div>

      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-5">
        Have a room code or passkey from a friend or Discord server? Enter it below to jump directly into the lobby.
      </p>

      <form onSubmit={handleJoin} className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs font-black uppercase text-black dark:text-white block mb-1">
              Room Code
            </label>
            <input
              type="text"
              placeholder="e.g. PRO-892"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              className="w-full rounded-2xl border-2.5 border-black bg-white dark:bg-slate-800 px-4 py-3 font-mono text-sm font-black uppercase text-black dark:text-white placeholder:text-slate-400 focus:outline-none shadow-[3px_3px_0px_#000]"
              required
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-black dark:text-white block mb-1">
              Passkey (If Private)
            </label>
            <input
              type="text"
              placeholder="e.g. SECRET"
              value={passkey}
              onChange={(e) => setPasskey(e.target.value.toUpperCase())}
              className="w-full rounded-2xl border-2.5 border-black bg-white dark:bg-slate-800 px-4 py-3 font-mono text-sm font-black uppercase text-black dark:text-white placeholder:text-slate-400 focus:outline-none shadow-[3px_3px_0px_#000]"
            />
          </div>
        </div>

        <button
          type="submit"
          className="neo-btn-primary w-full py-4 text-sm font-black shadow-[4px_4px_0px_#000] text-center"
        >
          {isAuthenticated ? "🚀 Enter Match Lobby →" : "🔒 Sign In with Discord & Join →"}
        </button>
      </form>
    </div>
  );
}
