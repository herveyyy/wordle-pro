import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/domain/services/auth.service";
import { getOrCreateRoom } from "@/lib/domain/services/room.service";
import { WordleGame } from "@/components/organisms/WordleGame/WordleGame";
import { RoomConfig } from "@/lib/entities/wordle.type";

type PlayPageProps = {
  searchParams: Promise<{
    letters?: string;
    chances?: string;
    timer?: string;
    rounds?: string;
    passkey?: string;
    room?: string;
    bots?: string;
    diff?: string;
  }>;
};

async function PlayContent({ searchParams }: PlayPageProps) {
  const session = await getSession();
  const params = await searchParams;

  if (!session) {
    const search = new URLSearchParams();
    if (params.letters) search.set("letters", params.letters);
    if (params.chances) search.set("chances", params.chances);
    if (params.timer) search.set("timer", params.timer);
    if (params.rounds) search.set("rounds", params.rounds);
    if (params.passkey) search.set("passkey", params.passkey);
    if (params.room) search.set("room", params.room);
    if (params.bots !== undefined) search.set("bots", params.bots);
    if (params.diff !== undefined) search.set("diff", params.diff);

    const queryString = search.toString();
    const callbackURL = queryString ? `/play?${queryString}` : "/play";
    redirect(`/sign-in?callbackURL=${encodeURIComponent(callbackURL)}`);
  }

  const parsedBotCount = params.bots !== undefined ? parseInt(params.bots, 10) : 2;
  const validBotCount = isNaN(parsedBotCount) ? 0 : Math.max(0, Math.min(4, parsedBotCount));

  const requestedConfig = {
    roomId: params.room || "PRO-892",
    passkey: params.passkey || "PRO777",
    isPrivate: Boolean(params.passkey),
    wordLength: Number(params.letters) || 5,
    maxChances: Number(params.chances) || 6,
    timeLimitSeconds: params.timer !== undefined ? Number(params.timer) : 60,
    totalRounds: Number(params.rounds) || 3,
    botCount: validBotCount,
    botDifficulty: (validBotCount === 0 ? "off" : (params.diff as any) || "medium") as any,
    hostId: session.user.id,
  };

  // Load from DB (or generate via KushCreates API and save to DB)
  const { room: dbRoom, words: roomWords } = await getOrCreateRoom(requestedConfig);

  const initialConfig: RoomConfig = {
    roomId: dbRoom.id,
    passkey: dbRoom.passkey || undefined,
    isPrivate: dbRoom.isPrivate,
    wordLength: dbRoom.wordLength,
    maxChances: dbRoom.maxChances,
    timeLimitSeconds: dbRoom.timeLimitSeconds,
    totalRounds: dbRoom.totalRounds,
    botCount: dbRoom.botCount,
    botDifficulty: dbRoom.botDifficulty,
    useWebRtc: true,
  };

  const playerName = session.user.name || "Player";
  const playerAvatar = session.user.image || undefined;

  return (
    <WordleGame
      initialConfig={initialConfig}
      initialWords={roomWords}
      playerName={playerName}
      playerAvatar={playerAvatar}
    />
  );
}


function PlayFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-1">
          {["W", "O", "R", "D", "L", "E"].map((l, i) => (
            <span
              key={i}
              className="flex size-10 items-center justify-center rounded-xl bg-primary font-display text-lg font-bold text-on-primary animate-bounce"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {l}
            </span>
          ))}
        </div>
        <p className="text-sm font-semibold text-on-surface-muted">
          Loading Wordle PRO Arena...
        </p>
      </div>
    </div>
  );
}

export default function PlayPage({ searchParams }: PlayPageProps) {
  return (
    <Suspense fallback={<PlayFallback />}>
      <PlayContent searchParams={searchParams} />
    </Suspense>
  );
}
