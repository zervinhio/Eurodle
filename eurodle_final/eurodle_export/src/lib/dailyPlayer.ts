// src/lib/dailyPlayer.ts
import { connectDB } from "./mongodb";
import { Player, IPlayer } from "./models/Player";
import PlayerIdGame from "./models/PlayerIdGame";

/**
 * Returns a stable daily player for the Player ID (Path) mode.
 */
export async function getDailyPlayerPath() {
  await connectDB();

  // 1. Check if there's a player specifically scheduled for today (Athens time)
  const athensFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit' });
  const todayStr = athensFormatter.format(new Date());

  const scheduled = await PlayerIdGame.findOne({ scheduledDate: todayStr }).lean();
  if (scheduled) return scheduled;

  // 2. Fallback to seeded shuffle if no player is scheduled
  const players = await PlayerIdGame.find({ guessableOnly: { $ne: true } }).lean();
  if (players.length === 0) throw new Error("No players found for Player ID mode");

  // Deterministic seed: sum of characters in the date string
  let seed = 0;
  for (let i = 0; i < todayStr.length; i++) {
    seed += todayStr.charCodeAt(i);
  }
  // Multiply by a large prime to distribute
  seed *= 1_000_003;

  function lcgRand() {
    seed = (seed * 1_664_525 + 1_013_904_223) & 0x7fffffff;
    return seed / 0x7fffffff;
  }

  const arr = [...players];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(lcgRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Use the date string hash to pick a stable index
  const daysSinceEpoch = Math.floor(new Date().getTime() / 86_400_000);
  return arr[daysSinceEpoch % arr.length];
}

/**
 * Returns a stable daily player based on today's UTC date.
 * Uses a simple day-index into a shuffled-but-seeded list so
 * every user sees the same player for the entire calendar day.
 */
export async function getDailyPlayer(): Promise<IPlayer> {
  await connectDB();

  // Fetch all active player IDs (lightweight)
  const players = await Player.find({ active: true })
    .select("_id playerId name")
    .lean();

  if (players.length === 0) throw new Error("No active players in DB");

  // Deterministic seed: days since epoch
  const now = new Date();
  const daysSinceEpoch = Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
      86_400_000
  );

  // Seeded shuffle (Fisher-Yates with lcg)
  const arr = [...players];
  let seed = daysSinceEpoch * 1_000_003;
  function lcgRand() {
    seed = (seed * 1_664_525 + 1_013_904_223) & 0x7fffffff;
    return seed / 0x7fffffff;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(lcgRand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  const chosen = arr[daysSinceEpoch % arr.length];
  const full = await Player.findById(chosen._id).lean() as IPlayer;
  return full;
}

/**
 * Returns today's date string used as the cache key: "2025-01-15"
 */
export function todayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
