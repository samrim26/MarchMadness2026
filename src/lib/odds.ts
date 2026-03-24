import type { GameOdds, TeamOdds } from "@/lib/types";

/**
 * Live odds powered by The Odds API (https://the-odds-api.com).
 * Free tier: 500 requests/month.
 *
 * To enable: add ODDS_API_KEY to .env.local
 * Results are cached for 10 minutes via Next.js fetch cache.
 */

const ODDS_API_BASE = "https://api.the-odds-api.com/v4";
const SPORT = "basketball_ncaab";

// ─── Team name normalization ──────────────────────────────────────────────────
// The Odds API uses full official names; we use short IDs.
const TEAM_NAME_MAP: Record<string, string[]> = {
  duke: ["Duke", "Duke Blue Devils"],
  stjohns: ["St. John's", "St John's", "St. John's Red Storm", "St Johns"],
  michiganstate: ["Michigan State", "Michigan State Spartans"],
  uconn: ["Connecticut", "UConn", "Connecticut Huskies"],
  iowa: ["Iowa", "Iowa Hawkeyes"],
  nebraska: ["Nebraska", "Nebraska Cornhuskers"],
  illinois: ["Illinois", "Illinois Fighting Illini"],
  houston: ["Houston", "Houston Cougars"],
  arizona: ["Arizona", "Arizona Wildcats"],
  arkansas: ["Arkansas", "Arkansas Razorbacks"],
  texas: ["Texas", "Texas Longhorns"],
  purdue: ["Purdue", "Purdue Boilermakers"],
  michigan: ["Michigan", "Michigan Wolverines"],
  alabama: ["Alabama", "Alabama Crimson Tide"],
  tennessee: ["Tennessee", "Tennessee Volunteers"],
  iowastate: ["Iowa State", "Iowa State Cyclones"],
};

// Reverse map: "Duke Blue Devils" → "duke"
const REVERSE_MAP: Record<string, string> = {};
for (const [id, names] of Object.entries(TEAM_NAME_MAP)) {
  for (const name of names) {
    REVERSE_MAP[name.toLowerCase()] = id;
  }
}

export function normalizeTeamName(apiName: string): string | null {
  return REVERSE_MAP[apiName.toLowerCase()] ?? null;
}

// ─── American ↔ Decimal conversion ───────────────────────────────────────────

export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) return Math.round((decimal - 1) * 100);
  return Math.round(-100 / (decimal - 1));
}

export function americanToDecimal(american: number): number {
  if (american > 0) return american / 100 + 1;
  return 100 / Math.abs(american) + 1;
}

// ─── API response types ───────────────────────────────────────────────────────

interface OddsApiOutcome {
  name: string;
  price: number; // decimal odds
}

interface OddsApiBookmaker {
  key: string;
  title: string;
  markets: {
    key: string;
    outcomes: OddsApiOutcome[];
  }[];
}

interface OddsApiGame {
  id: string;
  sport_key: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsApiBookmaker[];
}

// ─── Fetching ─────────────────────────────────────────────────────────────────

/**
 * Fetch live moneyline odds for all upcoming NCAAB games.
 * Returns null if API key is missing or fetch fails.
 */
export async function fetchLiveOdds(): Promise<GameOdds[] | null> {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) return null;

  try {
    const url =
      `${ODDS_API_BASE}/sports/${SPORT}/odds/` +
      `?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=decimal&bookmakers=draftkings,fanduel,betmgm`;

    const res = await fetch(url, {
      next: { revalidate: 600 }, // cache 10 minutes
    });

    if (!res.ok) return null;

    const data: OddsApiGame[] = await res.json();
    return parseOddsResponse(data);
  } catch {
    return null;
  }
}

function parseOddsResponse(data: OddsApiGame[]): GameOdds[] {
  const result: GameOdds[] = [];

  for (const game of data) {
    // Pick best bookmaker (prefer DraftKings → FanDuel → BetMGM → first available)
    const preferredOrder = ["draftkings", "fanduel", "betmgm"];
    const bookmaker =
      preferredOrder
        .map((k) => game.bookmakers.find((b) => b.key === k))
        .find(Boolean) ?? game.bookmakers[0];

    if (!bookmaker) continue;

    const market = bookmaker.markets.find((m) => m.key === "h2h");
    if (!market || market.outcomes.length < 2) continue;

    const [o1, o2] = market.outcomes;

    const t1Id = normalizeTeamName(o1.name);
    const t2Id = normalizeTeamName(o2.name);

    result.push({
      gameId: null, // matched later by team IDs
      apiMatchId: game.id,
      commenceTime: game.commence_time,
      team1: buildTeamOdds(o1.name, t1Id ?? o1.name, o1.price, bookmaker.title),
      team2: buildTeamOdds(o2.name, t2Id ?? o2.name, o2.price, bookmaker.title),
    });
  }

  return result;
}

function buildTeamOdds(
  apiName: string,
  teamId: string,
  decimal: number,
  bookmaker: string
): TeamOdds {
  return {
    teamId,
    teamName: apiName,
    decimalOdds: decimal,
    americanOdds: decimalToAmerican(decimal),
    impliedProbability: 1 / decimal,
    bookmaker,
  };
}

// ─── Match API odds to our bracket games ─────────────────────────────────────

import { GAMES } from "@/data/games";
import { getGameParticipant } from "@/lib/bracket";
import type { Results } from "@/lib/types";

/**
 * Given fetched API odds and our current results, match each API game
 * to the corresponding bracket game id.
 */
export function matchOddsToGames(
  liveOdds: GameOdds[],
  results: Results
): GameOdds[] {
  return liveOdds.map((apiGame) => {
    const t1 = apiGame.team1.teamId;
    const t2 = apiGame.team2.teamId;

    // Find our bracket game that has these two teams as participants
    const matched = GAMES.find((g) => {
      if (results[g.id]) return false; // already complete
      const p1 = getGameParticipant(g, "team1", results);
      const p2 = getGameParticipant(g, "team2", results);
      return (
        (p1 === t1 && p2 === t2) ||
        (p1 === t2 && p2 === t1)
      );
    });

    return { ...apiGame, gameId: matched?.id ?? null };
  });
}
