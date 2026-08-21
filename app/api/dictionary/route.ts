import { NextResponse } from "next/server";
import { DICTIONARY_SET } from "@/lib/domain/services/wordle.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get("word");

  if (!word || typeof word !== "string") {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const clean = word.trim().toUpperCase();
  if (clean.length < 4 || clean.length > 8 || !/^[A-Z]+$/.test(clean)) {
    return NextResponse.json({ valid: false });
  }

  // 1. In-memory Set check
  if (DICTIONARY_SET.has(clean)) {
    return NextResponse.json({ valid: true });
  }

  // 2. Server-side fetch to Free Dictionary API (no CORS restrictions)
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${clean.toLowerCase()}`,
      { next: { revalidate: 86400 } }
    );

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0]?.word) {
        DICTIONARY_SET.add(clean);
        return NextResponse.json({
          valid: true,
          definition: data[0]?.meanings?.[0]?.definitions?.[0]?.definition,
        });
      }
    }
  } catch (err) {
    // If external API times out or fails, return false gracefully
  }

  return NextResponse.json({ valid: false });
}
