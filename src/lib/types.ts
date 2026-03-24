// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Round =
  | "first_round"
  | "second_round"
  | "sweet16"
  | "elite8"
  | "final4"
  | "championship";

export type Region = "East" | "South" | "West" | "Midwest" | "FinalFour" | "Championship";

export interface Team {
  id: string;
  name: string;
  seed: number;
  region: Region;
}

export interface Game {
  id: string;
  round: Round;
  region: Region | string;
  /** Direct team id if known at bracket creation time (Sweet 16 games) */
  team1Id: string | null;
  team2Id: string | null;
  /** Source game whose winner fills this slot (Elite 8 and later) */
  team1SourceGameId: string | null;
  team2SourceGameId: string | null;
  /** Where this game's winner advances */
  feedsIntoGameId: string | null;
  feedsIntoSlot: "team1" | "team2" | null;
  pointsValue: number;
  label: string; // e.g. "East Regional Final"
}

/** gameId -> winnerId */
export type Results = Record<string, string>;

/** gameId -> predicted winnerId */
export type Picks = Record<string, string>;

export interface Entry {
  id: string;
  displayName: string;
  picks: Picks;
}

export interface ScoringSettings {
  first_round: number;
  second_round: number;
  sweet16: number;
  elite8: number;
  final4: number;
  championship: number;
}

export interface TournamentState {
  teams: Team[];
  games: Game[];
  results: Results;
  entries: Entry[];
  settings: ScoringSettings;
}

// ─── Analytics Types ─────────────────────────────────────────────────────────

export interface EntryAnalytics {
  entryId: string;
  displayName: string;
  currentScore: number;
  maxPossibleScore: number;
  soloWinProbability: number;
  tieForFirstProbability: number;
  firstOrTieProbability: number;
  secondPlaceProbability: number;
  poolEV: number; // expected net dollar value given current state
  numberOfWinningScenarios: number;
  numberOfTieScenarios: number;
  numberOfSecondPlaceScenarios: number;
  totalScenarios: number;
  eliminated: boolean;
  rank: number;
}

export type RootingStrength = "strong" | "moderate" | "slight" | "neutral";

export interface RootingRecommendation {
  gameId: string;
  gameLabel: string;
  team1Id: string | null;
  team2Id: string | null;
  team1Name: string | null;
  team2Name: string | null;
  preferredTeamId: string | null;
  preferredTeamName: string | null;
  probabilityWithTeam1: number;
  probabilityWithTeam2: number;
  delta: number;
  strength: RootingStrength;
}

export interface EntryRootingData {
  entryId: string;
  recommendations: RootingRecommendation[];
  bestGame: RootingRecommendation | null;
  worstGame: RootingRecommendation | null;
}

export interface ScenarioDelta {
  gameId: string;
  gameLabel: string;
  winnerId: string;
  winnerName: string;
  deltas: {
    entryId: string;
    displayName: string;
    before: number;
    after: number;
    delta: number;
  }[];
}

// ─── Live Odds & Hedging ──────────────────────────────────────────────────────

export interface TeamOdds {
  teamId: string;
  teamName: string;
  decimalOdds: number;  // e.g. 2.50 means bet $1 to win $1.50 profit
  americanOdds: number; // e.g. +150 or -200
  impliedProbability: number; // 1 / decimalOdds
  bookmaker: string;
}

export interface GameOdds {
  gameId: string | null; // matched to our bracket game id, null if unmatched
  apiMatchId: string;
  team1: TeamOdds;
  team2: TeamOdds;
  commenceTime: string;
}

/** A specific hedge recommendation for one entry in one game */
export interface HedgeBet {
  gameId: string;
  gameLabel: string;
  betOnTeamId: string;
  betOnTeamName: string;
  betAmount: number;         // dollars to wager at sportsbook
  decimalOdds: number;
  americanOdds: number;
  guaranteedFloor: number;   // net $ if you place this hedge (worst case)
  evIfNoBet: number;         // expected net $ without hedge
  evWithHedge: number;       // expected net $ with hedge (locked in)
  isPositiveEV: boolean;     // is the guaranteed floor > current EV?
  poolEVIfPickWins: number;  // EV from pool if your pick wins this game
  poolEVIfPickLoses: number; // EV from pool if your pick loses this game
  bookmaker: string;
}

export interface PersonHedgeData {
  personName: string;
  entryIds: string[];
  displayNames: string[];
  combinedPoolEV: number;        // total expected value across both brackets
  hedgeOpportunities: HedgeBet[];
  bestHedge: HedgeBet | null;
}

// ─── Computed State ───────────────────────────────────────────────────────────

export interface ComputedState {
  analytics: EntryAnalytics[];
  rootingData: EntryRootingData[];
  scenarioDeltas: ScenarioDelta[];
  totalScenarios: number;
  remainingGamesCount: number;
  completedGamesCount: number;
}
