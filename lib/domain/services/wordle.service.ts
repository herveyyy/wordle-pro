import { generate } from "random-words";
import * as randomWordsPkg from "random-words";
import { TileStatus } from "@/lib/entities/wordle.type";
import bundledWords from "./dictionary.data.json";

const rawWordList: string[] =
  (randomWordsPkg as any).wordList ||
  (randomWordsPkg as any).wordsList ||
  [];

// Global in-memory dictionary Set for instant O(1) synchronous word validation
export const DICTIONARY_SET = new Set<string>();

// 1. Populate from 15,522 KushCreates official Wordle words
if (Array.isArray(bundledWords)) {
  for (const w of bundledWords) {
    if (typeof w === "string") {
      DICTIONARY_SET.add(w.toUpperCase());
    }
  }
}

// 2. Populate from random-words word list
if (typeof rawWordList !== "undefined" && Array.isArray(rawWordList)) {
  for (const w of rawWordList) {
    if (typeof w === "string" && w.length >= 4 && w.length <= 8) {
      DICTIONARY_SET.add(w.toUpperCase());
    }
  }
}

// Built-in curated fallback word bank for instant offline resilience
const CURATED_WORDS: Record<number, string[]> = {
  4: [
    "ARCH", "BEAR", "CALM", "DAWN", "ECHO", "FIRE", "GLOW", "HERO",
    "ICON", "JAZZ", "KING", "LUCK", "MOON", "NOVA", "OPAL", "PEAK",
    "RUBY", "STAR", "TIDE", "VALE", "WAVE", "ZEST", "BOLT", "FROST",
    "LION", "MINT", "PURE", "SOUL", "VIBE", "WILD", "YARN", "ZINC",
    "MIST", "FLUX", "DARK", "BLUE", "COLD", "WARM", "GOLD", "JUMP",
    "BIRD", "FISH", "TREE", "ROAD", "CITY", "BOOK", "DOOR", "WIND",
    "RAIN", "SNOW", "SAND", "SHIP", "BOAT", "FOOD", "HAND", "FOOT",
    "EYES", "NOSE", "HAIR", "FACE", "HEAD", "MIND", "TIME", "YEAR",
    "DAYS", "WEEK", "HOUR", "GAME", "PLAY", "LOVE", "HOPE", "LIFE",
    "ROCK", "DUST", "LEAF", "BARK", "ROOT", "STEM", "SEED", "CORN",
    "RICE", "MEAT", "MILK", "SALT", "SOUP", "WINE", "BEER", "CAKE",
  ],
  5: [
    "EAGLE", "REACT", "WORLD", "BRAIN", "CLOUD", "DREAM", "FLAME", "GHOST", "HONEY",
    "IMAGE", "JUICE", "KNIFE", "LEMON", "MAGIC", "NIGHT", "OCEAN", "PIANO",
    "QUEEN", "RIVER", "STORM", "TIGER", "URBAN", "VOICE", "WATER", "YOUTH",
    "ZEBRA", "SPARK", "PRIDE", "NOBLE", "LIGHT", "QUEST", "POWER", "SPACE",
    "SWIFT", "GLORY", "BLOOM", "CHARM", "DISCO", "FORCE", "HAVEN", "LUNAR",
    "PLANT", "POSTER", "PLANET", "TRAIN", "HOUSE", "APPLE", "CRANE", "SLATE",
    "AUDIO", "ADIEU", "MONEY", "MUSIC", "PIZZA", "BREAD", "CHAIR", "TABLE",
    "BEACH", "RIVER", "EARTH", "HEART", "SUGAR", "FLOUR", "DRIVE", "STONE",
    "CABLE", "RADIO", "CLOCK", "WATCH", "SHIRT", "PANTS", "SHOES", "SOCKS",
    "PAPER", "RULER", "PAINT", "BRUSH", "SHINE", "FLASH", "BLAST", "SPEED",
    "SMART", "BRAVE", "LUCKY", "HAPPY", "SWEET", "CLEAN", "FRESH", "GREEN",
    "WHITE", "BLACK", "BROWN", "SHARP", "QUICK", "ROUND", "SOLID", "CLEAR",
    "CROWD", "GROUP", "PARTY", "EVENT", "STAGE", "SCENE", "DANCE", "TRACK",
    "SOUND", "NOISE", "TOUCH", "SMELL", "TASTE", "SIGHT", "COLOR", "SHADE",
    "FRAME", "PANEL", "BLOCK", "BRICK", "TOWER", "BRIDGE", "RIDGE", "CLIFF",
  ],
  6: [
    "CASTLE", "DRAGON", "ENERGY", "FOREST", "GALAXY", "HARBOR", "ISLAND",
    "JUNGLE", "KNIGHT", "LEGEND", "MIRROR", "NATURE", "PLANET", "POSTER",
    "QUARTZ", "ROCKET", "SHADOW", "TEMPLE", "VALLEY", "WIZARD", "BEACON",
    "COSMIC", "FROZEN", "GOLDEN", "MYSTIC", "PHOENIX", "SILVER", "VORTEX",
    "STREAM", "SUMMER", "WINTER", "SPRING", "AUTUMN", "BREEZE", "SUNSET",
    "CANYON", "DESERT", "MEADOW", "GARDEN", "FLOWER", "STREAM", "SOURCE",
    "PLAYER", "WINNER", "MASTER", "HEROIC", "ACTION", "CHANCE", "PUZZLE",
    "RIDDLE", "SECRET", "HIDDEN", "ESCAPE", "TARGET", "FLIGHT", "SIGNAL",
    "ENGINE", "SYSTEM", "MATRIX", "VECTOR", "SHIELD", "ARMOR", "WEAPON",
  ],
  7: [
    "CRYSTAL", "DYNAMIC", "ECLIPSE", "FEATHER", "GLACIER", "HORIZON",
    "JOURNEY", "KINGDOM", "LANTERN", "MAJESTY", "ODYSSEY", "PYRAMID",
    "QUANTUM", "RAINBOW", "SUNRISE", "THUNDER", "UNICORN", "VICTORY",
    "WARRIOR", "BLOSSOM", "COURAGE", "DESTINY", "EMERALD", "FIREFLY",
    "MIRACLE", "PHANTOM", "TREASURE", "VAMPYRE", "SPECTER", "COMMAND",
    "BALANCE", "HARMONY", "JUSTICE", "FREEDOM", "LIBERTY", "MYSTERY",
  ],
  8: [
    "CHAMPION", "DOMINION", "ETERNITY", "FORTRESS", "GUARDIAN", "INFINITY",
    "LABYRINTH", "MIDNIGHT", "MOUNTAIN", "OVERLORD", "PARADISE", "RADIANCE",
    "SANCTUARY", "TITANIUM", "UNIVERSE", "VALIANCE", "WILDLIFE", "ZEALOUS",
    "ABSOLUTE", "AIRCRAFT", "ALLIANCE", "ASTRONOM", "BLIZZARD", "CARDINAL",
    "COLOSSAL", "CREATIVE", "DARKNESS", "DIAMONDS", "DISCOVERY", "ELEGANCE",
    "FIREBALL", "LIGHTING", "PLATINUM", "STRATEGY", "SURPRISE", "TRIUMPHS",
  ],
};

// Populate from curated dictionaries
for (const wordList of Object.values(CURATED_WORDS)) {
  for (const w of wordList) {
    DICTIONARY_SET.add(w.toUpperCase());
  }
}

// Deterministic 32-bit integer hash from string seed
function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Pseudo-Random Number Generator (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Fetch a list of unique words for a room matching total rounds from KushCreates API
 * https://random-words-api.kushcreates.com/api?language=en&length=5
 */
export async function fetchWordsForRoom(
  wordLength: number = 5,
  totalRounds: number = 3
): Promise<string[]> {
  try {
    const res = await fetch(
      `https://random-words-api.kushcreates.com/api?language=en&length=${wordLength}`,
      { next: { revalidate: 300 } }
    );

    if (res.ok) {
      const body = await res.json();
      const rawData = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];

      const candidateWords: string[] = [];

      for (const item of rawData) {
        const rawWord = typeof item === "string" ? item : item?.word;
        if (typeof rawWord === "string") {
          const clean = rawWord.trim().toUpperCase();
          if (clean.length === wordLength && /^[A-Z]+$/.test(clean)) {
            candidateWords.push(clean);
            DICTIONARY_SET.add(clean);
          }
        }
      }

      if (candidateWords.length > 0) {
        const shuffled = [...candidateWords].sort(() => Math.random() - 0.5);
        const selected = Array.from(new Set(shuffled)).slice(0, totalRounds);

        if (selected.length === totalRounds) {
          return selected;
        }
        if (selected.length > 0) {
          while (selected.length < totalRounds) {
            selected.push(candidateWords[Math.floor(Math.random() * candidateWords.length)]);
          }
          return selected;
        }
      }
    }
  } catch (error) {
    console.warn("KushCreates API fetch failed, using bundled word bank:", error);
  }

  // Fallback to bundled word bank for this length
  const bundledMatching = Array.isArray(bundledWords)
    ? bundledWords.filter((w) => w.length === wordLength && /^[A-Z]+$/.test(w))
    : [];

  const sourceList = bundledMatching.length > 0 ? bundledMatching : (CURATED_WORDS[wordLength] || CURATED_WORDS[5]);
  const shuffledFallback = [...sourceList].sort(() => Math.random() - 0.5);
  return shuffledFallback.slice(0, totalRounds);
}

// Deterministic Seeded Word Generator for Room & Round Synchronization
export function getRoomWord(roomId: string, round: number, length: number = 5): string {
  const seedKey = `wordle_pro_room_${roomId.toUpperCase()}_round_${round}_len_${length}`;

  const bundledMatching = Array.isArray(bundledWords)
    ? bundledWords.filter((w) => w.length === length && /^[A-Z]+$/.test(w))
    : [];

  const fallbackList = bundledMatching.length > 0 ? bundledMatching : (CURATED_WORDS[length] || CURATED_WORDS[5]);
  const seedNum = stringToSeed(seedKey);
  const rng = mulberry32(seedNum);
  const randomIndex = Math.floor(rng() * fallbackList.length);

  return fallbackList[randomIndex] || fallbackList[0];
}

// Alias for random word
export async function getRandomWord(length: number = 5, roomId?: string, round: number = 1): Promise<string> {
  const effectiveRoomId = roomId || `QUICK_${Math.floor(Math.random() * 10000)}`;
  return getRoomWord(effectiveRoomId, round, length);
}

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

// Synchronous fast check against in-memory dictionary Set
export function isValidWord(word: string): boolean {
  if (!word || typeof word !== "string") return false;
  const w = word.trim().toUpperCase();
  const len = w.length;

  if (len < 4 || len > 8) return false;
  if (!/^[A-Z]+$/.test(w)) return false;

  return DICTIONARY_SET.has(w);
}

/**
 * Validate word using Free Dictionary API (https://api.dictionaryapi.dev/api/v2/entries/en/<word>)
 * Fallback to in-memory set if offline or cached
 */
export async function validateWordOnline(word: string): Promise<boolean> {
  if (!word || typeof word !== "string") return false;
  const clean = word.trim().toUpperCase();
  const len = clean.length;

  if (len < 4 || len > 8) return false;
  if (!/^[A-Z]+$/.test(clean)) return false;

  // 1. Fast path: check in-memory Set (0ms)
  if (DICTIONARY_SET.has(clean)) {
    return true;
  }

  // 2. Free Dictionary API validation
  try {
    const url = typeof window !== "undefined"
      ? `/api/dictionary?word=${encodeURIComponent(clean)}`
      : `https://api.dictionaryapi.dev/api/v2/entries/en/${clean.toLowerCase()}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.valid === true || (Array.isArray(data) && data.length > 0 && data[0]?.word)) {
        DICTIONARY_SET.add(clean);
        return true;
      }
    }
  } catch (error) {
    // Graceful fallback
  }

  return false;
}

// Fetch dictionary definition using Free Dictionary API
export async function getWordDefinition(word: string): Promise<string | undefined> {
  try {
    const url = typeof window !== "undefined"
      ? `/api/dictionary?word=${encodeURIComponent(word)}`
      : `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.definition) return data.definition;
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
