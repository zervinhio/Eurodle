// src/lib/gameLogic.ts

export type ResultColor = "green" | "yellow" | "red";

export interface GuessResult {
  name: string;
  team: string;
  position: string;
  nationality: string;
  height: number;
  imageUrl: string;
  feedback: {
    team: ResultColor;
    position: ResultColor;
    nationality: ResultColor;
    height: ResultColor;
    heightArrow: "up" | "down" | null; // up = target is taller
  };
}

// Positions grouped by family (for "close" yellow logic)
const POSITION_GROUPS: Record<string, string[]> = {
  PG: ["PG", "SG"],
  SG: ["PG", "SG"],
  SF: ["SF", "PF"],
  PF: ["SF", "PF"],
  C:  ["C"],
};

function comparePosition(guessed: string, target: string): ResultColor {
  if (guessed === target) return "green";
  const group = POSITION_GROUPS[guessed] || [guessed];
  if (group.includes(target)) return "yellow";
  return "red";
}

function compareHeight(
  guessedH: number,
  targetH: number
): { color: ResultColor; arrow: "up" | "down" | null } {
  const diff = targetH - guessedH;
  if (diff === 0) return { color: "green", arrow: null };
  if (Math.abs(diff) <= 3) return { color: "yellow", arrow: diff > 0 ? "up" : "down" };
  return { color: "red", arrow: diff > 0 ? "up" : "down" };
}

export function buildFeedback(
  guessed: {
    team: string;
    position: string;
    nationality: string;
    height: number;
  },
  target: {
    team: string;
    position: string;
    nationality: string;
    height: number;
  }
): GuessResult["feedback"] {
  // Team: green if same, red otherwise (no yellow as per requirements)
  const team: ResultColor = guessed.team === target.team ? "green" : "red";

  // Position: green | yellow (same family) | red
  const position = comparePosition(guessed.position, target.position);

  // Nationality: green or red, no yellow
  const nationality: ResultColor =
    guessed.nationality === target.nationality ? "green" : "red";

  // Height: green | yellow (±3cm) | red, with arrow
  const { color: height, arrow: heightArrow } = compareHeight(
    guessed.height,
    target.height
  );

  return { team, position, nationality, height, heightArrow };
}
