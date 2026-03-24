/**
 * Pool prize structure.
 *
 * $20 per person · 10 people · 2 brackets each · $200 total pot
 *
 * Payout:
 *   1st place bracket:  $180 back  (net profit: +$160 after $20 entry fee)
 *   2nd place bracket:  $20 back   (net:  $0 — breaks even)
 *   Everyone else:       $0 back   (net: -$20)
 *
 * NOTE: Each PERSON pays $20 total covering both their brackets.
 * If both a person's brackets finish 1st and 2nd, they collect $200
 * (net +$180 on their $20 entry).
 */
export const PRIZE_CONFIG = {
  entryFeePerPerson: 20,
  numPeople: 10,
  bracketsPerPerson: 2,
  totalPot: 200,          // 10 × $20
  firstPrize: 180,        // winner's take from pot (2nd's $20 is returned separately)
  secondPrize: 20,        // 2nd place gets entry fee back
  netIfFirst: 160,        // firstPrize - entryFee
  netIfSecond: 0,         // secondPrize - entryFee
  netIfOut: -20,          // $0 back - entryFee
} as const;

/**
 * Parse bracket display name into { personName, championPick }.
 * Convention: "PersonName TeamName" — first word is the person,
 * remaining words are the team they picked to win.
 *
 * e.g. "Sam Duke"      → { personName: "Sam",   championPick: "Duke" }
 *      "Jordan UConn"  → { personName: "Jordan", championPick: "UConn" }
 *
 * Falls back gracefully if the name doesn't follow the convention.
 */
export function parseBracketName(displayName: string): {
  personName: string;
  championPick: string | null;
} {
  const parts = displayName.trim().split(/\s+/);
  if (parts.length < 2) return { personName: displayName, championPick: null };
  return {
    personName: parts[0],
    championPick: parts.slice(1).join(" "),
  };
}
