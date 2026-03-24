import type { Entry } from "@/lib/types";

/**
 * 20 bracket entries — 10 people × 2 brackets each.
 * Display name format: PersonName + ChampionPick (e.g. "EppleHouston").
 *
 * priorPoints = points locked in from Rounds 1 & 2 (before Sweet 16).
 *
 * Pick ordering:
 *   Sweet 16:  s16-east-1, s16-east-2, s16-south-1, s16-south-2,
 *              s16-midwest-1, s16-midwest-2, s16-west-1, s16-west-2
 *   Elite 8:   e8-east, e8-south, e8-west, e8-midwest
 *   Final Four: ff-1 (East/South), ff-2 (West/Midwest)
 *   Championship: championship
 *
 * Dead picks (teams eliminated before Sweet 16) score 0 automatically.
 * Valid team IDs: duke, stjohns, michiganstate, uconn,
 *                 iowa, nebraska, illinois, houston,
 *                 arizona, arkansas, texas, purdue,
 *                 michigan, alabama, tennessee, iowastate
 */
export const ENTRIES: Entry[] = [

  // ── Epple ──────────────────────────────────────────────────────────────────

  {
    id: "epple-houston",
    displayName: "EppleHouston",
    priorPoints: 53,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "uconn",
      "s16-south-1":   "nebraska",
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead — Texas/Purdue are actual teams
      "e8-east":       "duke",
      "e8-south":      "houston",
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "houston",
      "ff-2":          "arizona",
      championship:    "houston",
    },
  },

  {
    id: "epple-duke",
    displayName: "EppleDuke",
    priorPoints: 47,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "uconn",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "duke",
      "e8-south":      "houston",
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "arizona",
      championship:    "duke",
    },
  },

  // ── Mase ───────────────────────────────────────────────────────────────────

  {
    id: "mase-duke",
    displayName: "MaseDuke",
    priorPoints: 51,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "duke",
      "e8-south":      "florida",      // dead
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "arizona",
      championship:    "duke",
    },
  },

  {
    id: "mase-mich",
    displayName: "MaseMich",
    priorPoints: 40,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "uconn",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "uva",          // dead — Tennessee beat Virginia
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "uconn",
      "e8-south":      "florida",      // dead
      "e8-west":       "gonzaga",      // dead
      "e8-midwest":    "michigan",
      "ff-1":          "florida",      // dead
      "ff-2":          "michigan",
      championship:    "michigan",
    },
  },

  // ── Fray ───────────────────────────────────────────────────────────────────

  {
    id: "fray-michigan",
    displayName: "FrayMichigan",
    priorPoints: 50,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "uva",          // dead
      "s16-west-1":    "arizona",
      "s16-west-2":    "byu",          // dead — Texas beat BYU
      "e8-east":       "duke",
      "e8-south":      "houston",
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "houston",
      "ff-2":          "michigan",
      championship:    "michigan",
    },
  },

  {
    id: "fray-duke",
    displayName: "FrayDuke",
    priorPoints: 47,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "illinois",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "purdue",
      "e8-east":       "duke",
      "e8-south":      "florida",      // dead
      "e8-west":       "purdue",
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "purdue",
      championship:    "duke",
    },
  },

  // ── Stu ────────────────────────────────────────────────────────────────────

  {
    id: "stu-houston",
    displayName: "StuHouston",
    priorPoints: 49,
    picks: {
      "s16-east-1":    "stjohns",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "stjohns",
      "e8-south":      "houston",
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "houston",
      "ff-2":          "michigan",
      championship:    "houston",
    },
  },

  {
    id: "stu-zona",
    displayName: "StuZona",
    priorPoints: 47,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "uconn",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "uva",          // dead
      "s16-west-1":    "arizona",
      "s16-west-2":    "purdue",
      "e8-east":       "duke",
      "e8-south":      "florida",      // dead
      "e8-west":       "arizona",
      "e8-midwest":    "uva",          // dead
      "ff-1":          "duke",
      "ff-2":          "arizona",
      championship:    "arizona",
    },
  },

  // ── Kale ───────────────────────────────────────────────────────────────────

  {
    id: "kale-zona",
    displayName: "KaleZona",
    priorPoints: 49,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "uconn",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "uva",          // dead
      "s16-west-1":    "arizona",
      "s16-west-2":    "purdue",
      "e8-east":       "duke",
      "e8-south":      "houston",
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "arizona",
      championship:    "arizona",
    },
  },

  {
    id: "kale-duke",
    displayName: "KaleDuke",
    priorPoints: 44,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "illinois",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "purdue",
      "e8-east":       "duke",
      "e8-south":      "illinois",
      "e8-west":       "purdue",
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "michigan",
      championship:    "duke",
    },
  },

  // ── Marc ───────────────────────────────────────────────────────────────────

  {
    id: "marc-duke",
    displayName: "MarcDuke",
    priorPoints: 45,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "purdue",
      "e8-east":       "duke",
      "e8-south":      "houston",
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "arizona",
      championship:    "duke",
    },
  },

  {
    id: "marc-iowastate",
    displayName: "MarcIowaState",
    priorPoints: 42,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "ucla",         // dead — UConn beat UCLA
      "s16-south-1":   "vanderbilt",   // dead — Nebraska beat Vanderbilt
      "s16-south-2":   "illinois",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "duke",
      "e8-south":      "illinois",
      "e8-west":       "arizona",
      "e8-midwest":    "iowastate",
      "ff-1":          "duke",
      "ff-2":          "iowastate",
      championship:    "iowastate",
    },
  },

  // ── Walt ───────────────────────────────────────────────────────────────────

  {
    id: "walt-gonzaga1",
    displayName: "WaltGonzaga1",
    priorPoints: 45,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "uconn",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "illinois",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "duke",
      "e8-south":      "illinois",
      "e8-west":       "gonzaga",      // dead
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "gonzaga",      // dead
      championship:    "gonzaga",      // dead
    },
  },

  {
    id: "walt-gonzaga2",
    displayName: "WaltGonzaga2",
    priorPoints: 44,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "uconn",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "illinois",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "duke",
      "e8-south":      "illinois",
      "e8-west":       "gonzaga",      // dead
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "gonzaga",      // dead
      championship:    "gonzaga",      // dead
    },
  },

  // ── Neub ───────────────────────────────────────────────────────────────────

  {
    id: "neub-zona",
    displayName: "NeubZona",
    priorPoints: 43,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "duke",
      "e8-south":      "houston",
      "e8-west":       "arizona",
      "e8-midwest":    "iowastate",
      "ff-1":          "duke",
      "ff-2":          "arizona",
      championship:    "arizona",
    },
  },

  {
    id: "neub-duke",
    displayName: "NeubDuke",
    priorPoints: 42,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "gonzaga",      // dead
      "e8-east":       "duke",
      "e8-south":      "florida",      // dead
      "e8-west":       "arizona",
      "e8-midwest":    "iowastate",
      "ff-1":          "duke",
      "ff-2":          "iowastate",
      championship:    "duke",
    },
  },

  // ── Joe ────────────────────────────────────────────────────────────────────

  {
    id: "joe-zona",
    displayName: "JoeZona",
    priorPoints: 43,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "vanderbilt",   // dead
      "s16-south-2":   "illinois",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "uva",          // dead
      "s16-west-1":    "arizona",
      "s16-west-2":    "purdue",
      "e8-east":       "michiganstate",
      "e8-south":      "illinois",
      "e8-west":       "arizona",
      "e8-midwest":    "michigan",
      "ff-1":          "michiganstate",
      "ff-2":          "arizona",
      championship:    "arizona",
    },
  },

  {
    id: "joe-michigan",
    displayName: "JoeMichigan",
    priorPoints: 37,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "michiganstate",
      "s16-south-1":   "vanderbilt",   // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arkansas",
      "s16-west-2":    "purdue",
      "e8-east":       "duke",
      "e8-south":      "houston",
      "e8-west":       "arkansas",
      "e8-midwest":    "michigan",
      "ff-1":          "duke",
      "ff-2":          "michigan",
      championship:    "michigan",
    },
  },

  // ── Icy ────────────────────────────────────────────────────────────────────

  {
    id: "icy-iowastate",
    displayName: "IcyIowaState",
    priorPoints: 39,
    picks: {
      "s16-east-1":    "duke",
      "s16-east-2":    "ucla",         // dead
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "illinois",
      "s16-midwest-1": "alabama",
      "s16-midwest-2": "iowastate",
      "s16-west-1":    "arizona",
      "s16-west-2":    "miami",        // dead — Purdue beat Miami
      "e8-east":       "ucla",         // dead
      "e8-south":      "illinois",
      "e8-west":       "arizona",
      "e8-midwest":    "iowastate",
      "ff-1":          "illinois",
      "ff-2":          "iowastate",
      championship:    "iowastate",
    },
  },

  {
    id: "icy-florida",
    displayName: "IcyFlorida",
    priorPoints: 38,
    picks: {
      "s16-east-1":    "stjohns",
      "s16-east-2":    "uconn",
      "s16-south-1":   "florida",      // dead
      "s16-south-2":   "houston",
      "s16-midwest-1": "michigan",
      "s16-midwest-2": "santaclara",   // dead — Iowa State beat Santa Clara
      "s16-west-1":    "arizona",
      "s16-west-2":    "purdue",
      "e8-east":       "stjohns",
      "e8-south":      "florida",      // dead
      "e8-west":       "purdue",
      "e8-midwest":    "michigan",
      "ff-1":          "florida",      // dead
      "ff-2":          "purdue",
      championship:    "florida",      // dead
    },
  },
];
