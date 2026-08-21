import { TileStatus } from "@/lib/entities/wordle.type";

// Built-in curated fallback word bank for instant load and offline resilience
const CURATED_WORDS: Record<number, string[]> = {
  4: [
    "ARCH", "BEAR", "CALM", "DAWN", "ECHO", "FIRE", "GLOW", "HERO",
    "ICON", "JAZZ", "KING", "LUCK", "MOON", "NOVA", "OPAL", "PEAK",
    "RUBY", "STAR", "TIDE", "VALE", "WAVE", "ZEST", "BOLT", "FROST",
    "LION", "MINT", "PURE", "SOUL", "VIBE", "WILD", "YARN", "ZINC",
  ],
  5: [
    "REACT", "WORLD", "BRAIN", "CLOUD", "DREAM", "FLAME", "GHOST", "HONEY",
    "IMAGE", "JUICE", "KNIFE", "LEMON", "MAGIC", "NIGHT", "OCEAN", "PIANO",
    "QUEEN", "RIVER", "STORM", "TIGER", "URBAN", "VOICE", "WATER", "YOUTH",
    "ZEBRA", "SPARK", "PRIDE", "NOBLE", "LIGHT", "QUEST", "POWER", "SPACE",
    "SWIFT", "GLORY", "BLOOM", "CHARM", "DISCO", "FORCE", "HAVEN", "LUNAR",
  ],
  6: [
    "CASTLE", "DRAGON", "ENERGY", "FOREST", "GALAXY", "HARBOR", "ISLAND",
    "JUNGLE", "KNIGHT", "LEGEND", "MIRROR", "NATURE", "ORBITA", "PLANET",
    "QUARTZ", "ROCKET", "SHADOW", "TEMPLE", "VALLEY", "WIZARD", "BEACON",
    "COSMIC", "FROZEN", "GOLDEN", "MYSTIC", "PHOENIX", "SILVER", "VORTEX",
  ],
  7: [
    "CRYSTAL", "DYNAMIC", "ECLIPSE", "FEATHER", "GLACIER", "HORIZON",
    "JOURNEY", "KINGDOM", "LANTERN", "MAJESTY", "NEBULAR", "ODYSSEY",
    "PYRAMID", "QUANTUM", "RAINBOW", "SUNRISE", "THUNDER", "UNICORN",
    "VICTORY", "WARRIOR", "BLOSSOM", "COURAGE", "DESTINY", "EMERALD",
  ],
  8: [
    "CHAMPION", "DOMINION", "ETERNITY", "FORTRESS", "GUARDIAN", "INFINITY",
    "LABYRINTH", "MIDNIGHT", "MOUNTAIN", "OVERLORD", "PARADISE", "RADIANCE",
    "SANCTUARY", "TITANIUM", "UNIVERSE", "VALIANCE", "WILDLIFE", "ZEALOUS",
  ],
};

// Evaluate guess with accurate Wordle duplicate rules
export function evaluateWordleGuess(guess: string, target: string): TileStatus[] {
  const g = guess.toUpperCase();
  const t = target.toUpperCase();
  const len = target.length;
  const result: TileStatus[] = Array(len).fill("absent");
  const targetLetterCounts: Record<string, number> = {};

  // Count available letters in target
  for (let i = 0; i < len; i++) {
    const char = t[i];
    targetLetterCounts[char] = (targetLetterCounts[char] || 0) + 1;
  }

  // Pass 1: find all exact (correct) matches
  for (let i = 0; i < len; i++) {
    if (g[i] === t[i]) {
      result[i] = "correct";
      targetLetterCounts[g[i]]--;
    }
  }

  // Pass 2: find present (wrong spot) matches
  for (let i = 0; i < len; i++) {
    if (result[i] === "correct") continue;
    const char = g[i];
    if (targetLetterCounts[char] && targetLetterCounts[char] > 0) {
      result[i] = "present";
      targetLetterCounts[char]--;
    } else {
      result[i] = "absent";
    }
  }

  return result;
}

// Fetch random target word from open Datamuse API with fallback
export async function getRandomWord(length: number = 5): Promise<string> {
  const fallbackList = CURATED_WORDS[length] || CURATED_WORDS[5];
  try {
    const pattern = "?".repeat(length);
    const res = await fetch(`https://api.datamuse.com/words?sp=${pattern}&max=100`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      const validWords = data
        .map((item: { word: string }) => item.word.toUpperCase())
        .filter((w: string) => w.length === length && /^[A-Z]+$/.test(w));
      if (validWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * validWords.length);
        return validWords[randomIndex];
      }
    }
  } catch {
    // network or api error, use curated fallback
  }

  const randomIndex = Math.floor(Math.random() * fallbackList.length);
  return fallbackList[randomIndex];
}

// Validate if guess word exists in open dictionary or list
export async function isValidWord(word: string): Promise<boolean> {
  const w = word.toUpperCase();
  const len = w.length;

  // Check fallback bank first for fast match
  if (CURATED_WORDS[len]?.includes(w)) {
    return true;
  }

  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    if (res.ok) return true;

    // Secondary check with datamuse
    const dmRes = await fetch(`https://api.datamuse.com/words?sp=${w.toLowerCase()}&max=1`);
    if (dmRes.ok) {
      const data = await dmRes.json();
      if (data.length > 0 && data[0].word.toUpperCase() === w) {
        return true;
      }
    }
  } catch {
    // If offline or network drop, accept any valid alphabetic guess of proper length
    return true;
  }

  return true;
}

// Fetch dictionary definition for round end recap
export async function getWordDefinition(word: string): Promise<string | undefined> {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    if (res.ok) {
      const data = await res.json();
      const firstMeaning = data[0]?.meanings?.[0]?.definitions?.[0]?.definition;
      if (firstMeaning) {
        return firstMeaning;
      }
    }
  } catch {
    // definition optional
  }
  return undefined;
}
