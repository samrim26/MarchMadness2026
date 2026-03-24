import type {
  Entry,
  GameOdds,
  HedgeBet,
  PersonHedgeData,
  Results,
  Game,
  ScoringSettings,
} from "@/lib/types";
import { PRIZE_CONFIG, parseBracketName } from "@/data/prizeConfig";
import { getGameParticipant, getGamesWithKnownParticipants } from "@/lib/bracket";
import {
  buildOutcomeRowsForState,
  conditionalPoolEVs,
} from "@/lib/simulation";
import { getTeamName } from "@/data/teams";

// ─── Core hedge math ─────────────────────────────────────────────────────────

/**
 * Given a person's pool EV if their pick wins a game vs if it loses,
 * and the sportsbook decimal odds on the pick LOSING (opponent winning),
 * compute the optimal hedge bet and guaranteed floor.
 *
 * Perfect hedge formula:
 *   EV_if_pick_wins - H = EV_if_pick_loses + H × (D - 1)
 *   H = (EV_if_pick_wins - EV_if_pick_loses) / D
 *   Guaranteed floor = EV_if_pick_wins - H
 *
 * Returns null if no positive hedge exists.
 */
function calcHedgeBet(params: {
  evIfPickWins: number;
  evIfPickLoses: number;
  opponentDecimalOdds: number;
  gameId: string;
  gameLabel: string;
  betOnTeamId: string;
  betOnTeamName: string;
  americanOdds: number;
  bookmaker: string;
}): HedgeBet | null {
  const {
    evIfPickWins,
    evIfPickLoses,
    opponentDecimalOdds,
    gameId,
    gameLabel,
    betOnTeamId,
    betOnTeamName,
    americanOdds,
    bookmaker,
  } = params;

  const evDiff = evIfPickWins - evIfPickLoses;

  // Only hedge makes sense if you benefit from your pick winning
  if (evDiff <= 0) return null;

  // Optimal hedge amount (bet on the opponent at the sportsbook)
  const H = evDiff / opponentDecimalOdds;

  // Guaranteed floor if you place this hedge
  const guaranteedFloor = evIfPickWins - H;

  // Current EV without any hedge (weighted average assuming 50/50)
  const evIfNoBet = (evIfPickWins + evIfPickLoses) / 2;

  // Round bet to nearest dollar
  const betAmount = Math.max(1, Math.round(H));

  return {
    gameId,
    gameLabel,
    betOnTeamId,
    betOnTeamName,
    betAmount,
    decimalOdds: opponentDecimalOdds,
    americanOdds,
    guaranteedFloor: Math.round(guaranteedFloor * 100) / 100,
    evIfNoBet: Math.round(evIfNoBet * 100) / 100,
    evWithHedge: Math.round(guaranteedFloor * 100) / 100,
    isPositiveEV: guaranteedFloor > evIfPickLoses,
    poolEVIfPickWins: evIfPickWins,
    poolEVIfPickLoses: evIfPickLoses,
    bookmaker,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Compute hedge opportunities for every person in the pool.
 *
 * Groups entries by person (parsed from display name), then for each
 * upcoming game with known participants + live odds, checks whether
 * a hedge bet would improve their worst-case outcome.
 */
export function computePersonHedgeData(
  entries: Entry[],
  games: Game[],
  results: Results,
  settings: ScoringSettings,
  liveOdds: GameOdds[]
): PersonHedgeData[] {
  const actionableGames = getGamesWithKnownParticipants(games, results);
  if (actionableGames.length === 0) return [];

  const rows = buildOutcomeRowsForState(entries, games, results);

  // Group entries by person name
  const personMap = new Map<
    string,
    { entries: Entry[]; indices: number[] }
  >();
  for (let i = 0; i < entries.length; i++) {
    const { personName } = parseBracketName(entries[i].displayName);
    if (!personMap.has(personName)) {
      personMap.set(personName, { entries: [], indices: [] });
    }
    personMap.get(personName)!.entries.push(entries[i]);
    personMap.get(personName)!.indices.push(i);
  }

  const result: PersonHedgeData[] = [];

  for (const [personName, { entries: personEntries, indices }] of personMap) {
    // For a person with 2 brackets, their combined EV is a function of
    // both brackets' outcomes. For simplicity, evaluate each bracket
    // independently then take the best hedge across all brackets × games.
    const allHedges: HedgeBet[] = [];

    for (let bi = 0; bi < indices.length; bi++) {
      const ei = indices[bi]; // index in full entries array
      const entry = personEntries[bi];

      for (const game of actionableGames) {
        const t1 = getGameParticipant(game, "team1", results)!;
        const t2 = getGameParticipant(game, "team2", results)!;

        // Find matching live odds for this game
        const oddsForGame = liveOdds.find(
          (o) =>
            (o.gameId === game.id) ||
            (o.team1.teamId === t1 && o.team2.teamId === t2) ||
            (o.team1.teamId === t2 && o.team2.teamId === t1)
        );
        if (!oddsForGame) continue;

        // Determine which team this entry "roots for" (picks to win deeper)
        // by comparing EVs in each scenario
        const rowsIfT1 = rows.filter((r) => r.outcome[game.id] === t1);
        const rowsIfT2 = rows.filter((r) => r.outcome[game.id] === t2);

        const [evIfT1] = conditionalPoolEVs(rowsIfT1, entries.length).slice(ei, ei + 1);
        const [evIfT2] = conditionalPoolEVs(rowsIfT2, entries.length).slice(ei, ei + 1);

        // The entry prefers the team that gives them higher EV
        // The hedge bets on the opposing team
        let pickTeam: string, oppTeam: string, evIfPick: number, evIfOpp: number;
        let oppOdds: TeamOdds;

        if (evIfT1 >= evIfT2) {
          pickTeam = t1; oppTeam = t2;
          evIfPick = evIfT1; evIfOpp = evIfT2;
          oppOdds = oddsForGame.team1.teamId === t2
            ? oddsForGame.team1
            : oddsForGame.team2;
        } else {
          pickTeam = t2; oppTeam = t1;
          evIfPick = evIfT2; evIfOpp = evIfT1;
          oppOdds = oddsForGame.team1.teamId === t1
            ? oddsForGame.team1
            : oddsForGame.team2;
        }

        const hedge = calcHedgeBet({
          evIfPickWins: evIfPick,
          evIfPickLoses: evIfOpp,
          opponentDecimalOdds: oppOdds.decimalOdds,
          gameId: game.id,
          gameLabel: `${game.label} (${entry.displayName})`,
          betOnTeamId: oppTeam,
          betOnTeamName: getTeamName(oppTeam),
          americanOdds: oppOdds.americanOdds,
          bookmaker: oppOdds.bookmaker,
        });

        if (hedge) allHedges.push(hedge);
      }
    }

    // Combined EV across both brackets (sum of individual EVs)
    const combinedEV = indices.reduce((sum, ei) => {
      const baseRows = rows;
      const [ev] = conditionalPoolEVs(baseRows, entries.length).slice(ei, ei + 1);
      return sum + ev;
    }, 0);

    const bestHedge =
      allHedges.length > 0
        ? allHedges.reduce((best, h) =>
            h.guaranteedFloor > best.guaranteedFloor ? h : best
          )
        : null;

    result.push({
      personName,
      entryIds: personEntries.map((e) => e.id),
      displayNames: personEntries.map((e) => e.displayName),
      combinedPoolEV: Math.round(combinedEV * 100) / 100,
      hedgeOpportunities: allHedges.sort(
        (a, b) => b.guaranteedFloor - a.guaranteedFloor
      ),
      bestHedge,
    });
  }

  // Sort by descending combined EV
  return result.sort((a, b) => b.combinedPoolEV - a.combinedPoolEV);
}

// Helper to get TeamOdds type without importing directly
type TeamOdds = import("@/lib/types").TeamOdds;
