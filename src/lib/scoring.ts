import type { Entry, Game, Results, ScoringSettings } from "@/lib/types";
import { isPickStillAlive } from "@/lib/bracket";

/**
 * Points awarded for a given round.
 */
export function pointsForRound(
  round: string,
  settings: ScoringSettings
): number {
  return (settings as unknown as Record<string, number>)[round] ?? 0;
}

/**
 * Current score = prior round points (locked in from R1/R2) +
 * points earned in Sweet 16 and beyond based on completed results.
 */
export function calculateCurrentScore(
  entry: Entry,
  games: Game[],
  results: Results
): number {
  let score = entry.priorPoints ?? 0;
  for (const game of games) {
    const pick = entry.picks[game.id];
    if (!pick) continue;
    if (results[game.id] === pick) {
      score += game.pointsValue;
    }
  }
  return score;
}

/**
 * Max possible score = prior points + current Sweet 16+ score +
 * points from all remaining alive picks.
 */
export function calculateMaxPossibleScore(
  entry: Entry,
  games: Game[],
  results: Results
): number {
  let score = entry.priorPoints ?? 0;
  for (const game of games) {
    const pick = entry.picks[game.id];
    if (!pick) continue;

    if (results[game.id] !== undefined) {
      if (results[game.id] === pick) {
        score += game.pointsValue;
      }
    } else {
      if (isPickStillAlive(pick, game.id, games, results)) {
        score += game.pointsValue;
      }
    }
  }
  return score;
}

/**
 * Score an entry against a COMPLETE tournament outcome (used in simulation).
 * Must include priorPoints so standings comparisons are correct.
 */
export function scoreEntryAgainstOutcome(
  entry: Entry,
  games: Game[],
  outcome: Results
): number {
  let score = entry.priorPoints ?? 0;
  for (const game of games) {
    const pick = entry.picks[game.id];
    if (!pick) continue;
    if (outcome[game.id] === pick) {
      score += game.pointsValue;
    }
  }
  return score;
}
