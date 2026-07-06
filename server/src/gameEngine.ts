import { PlayerRole, ROLE_DISTRIBUTION, BENEFIT_THRESHOLDS, GameStateValues } from './gameConstants.js';

interface PlayerInput {
  id: string;
  fullName: string;
  country: string;
}

interface AssignedPlayer extends PlayerInput {
  role: PlayerRole;
}

/**
 * Randomly assigns roles to players according to the player count distribution configuration
 */
export function assignRoles(players: PlayerInput[], playerCount: number): AssignedPlayer[] {
  const distribution = ROLE_DISTRIBUTION[playerCount];
  if (!distribution) {
    throw new Error(`No role distribution configuration found for player count ${playerCount}`);
  }
  
  const rolePool: PlayerRole[] = [];
  for (const [roleStr, count] of Object.entries(distribution)) {
    const role = roleStr as PlayerRole;
    for (let i = 0; i < count; i++) {
      rolePool.push(role);
    }
  }

  // Fisher-Yates shuffle
  const shuffledPool = [...rolePool];
  for (let i = shuffledPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPool[i], shuffledPool[j]] = [shuffledPool[j], shuffledPool[i]];
  }

  return players.map((player, i) => ({
    ...player,
    role: shuffledPool[i],
  }));
}

export interface VoteInput {
  choice: string;
}

export interface ResolveVotesResult {
  tally: Record<string, number>;
  is_tie: boolean;
  majority: string | null;
  tied_options: string[];
}

/**
 * Resolves scenario votes and detects ties / majorities
 */
export function resolveVotes(votes: VoteInput[]): ResolveVotesResult {
  const tally: Record<string, number> = { A: 0, B: 0, C: 0 };
  for (const vote of votes) {
    if (vote.choice in tally) {
      tally[vote.choice]++;
    }
  }

  const maxVotes = Math.max(...Object.values(tally));
  const winners = Object.keys(tally).filter((k) => tally[k] === maxVotes);

  return {
    tally,
    is_tie: winners.length > 1,
    majority: winners.length === 1 ? winners[0] : null,
    tied_options: winners.length > 1 ? winners : [],
  };
}

export function calcPS(s: GameStateValues): number {
  return (s.economicGrowth + s.governmentBudget + s.peopleWelfare) / 3;
}

export function calcGQS(s: GameStateValues): number {
  return (s.publicTrust + s.transparency) / 2;
}

export function calcSS(s: GameStateValues): number {
  return s.environmentalQuality;
}

/**
 * Calculates Final Prosperity Score (FPS) based on prosperity score and governance modifier
 */
export function calcFPS(s: GameStateValues): number {
  const ps = calcPS(s);
  const gqs = calcGQS(s);
  
  let modifier = 1.0;
  if (gqs >= 80) modifier = 1.05;
  else if (gqs >= 60) modifier = 1.02;
  else if (gqs >= 40) modifier = 1.00;
  else if (gqs >= 20) modifier = 0.98;
  else modifier = 0.95;

  const result = ps * modifier;
  return Math.min(100, Math.max(0, result));
}

export interface ArchetypeCandidate {
  priority: number;
  name: string;
}

/**
 * Resolves city archetypes in priority order, capped at 3 archetypes
 */
export function resolveArchetypes(s: GameStateValues): string[] {
  const fps = calcFPS(s);
  const gqs = calcGQS(s);
  const ss = calcSS(s);

  const candidates: ArchetypeCandidate[] = [];

  // Priority 1 — Balanced Prosperity
  if (fps >= 65 && gqs >= 70 && ss >= 70) {
    candidates.push({ priority: 1, name: "Balanced Prosperity City" });
  }

  // Priority 2 — Crisis / Nuanced
  if (fps < 40 || gqs < 30 || ss < 30) {
    candidates.push({ priority: 2, name: "Governance Crisis City" });
  }
  if (fps >= 75 && gqs < 40) {
    candidates.push({ priority: 2, name: "Prosperous but Vulnerable City" });
  }

  // Priority 3 — Success types
  if (fps >= 75) {
    candidates.push({ priority: 3, name: "Economic Powerhouse" });
  }
  if (s.peopleWelfare >= 80) {
    candidates.push({ priority: 3, name: "Welfare-Oriented City" });
  }
  if (ss >= 80) {
    candidates.push({ priority: 3, name: "Green & Sustainable City" });
  }
  if (gqs >= 80) {
    candidates.push({ priority: 3, name: "Good Governance City" });
  }
  if (ss >= 80 && fps < 50) {
    candidates.push({ priority: 3, name: "Environmentally Protected but Economically Stagnant City" });
  }

  // Sort by priority and extract names
  const sortedNames = candidates
    .sort((a, b) => a.priority - b.priority)
    .map((c) => c.name);

  // Deduplicate
  const uniqueNames = sortedNames.filter((v, i, a) => a.indexOf(v) === i);
  
  return uniqueNames.slice(0, 3);
}

export interface PlayerRoleRecord {
  role: PlayerRole | null;
}

/**
 * Returns list of roles that met their benefit thresholds
 */
export function resolveBeneficiaries(s: GameStateValues, players: PlayerRoleRecord[]): PlayerRole[] {
  const activeRoles = players
    .map((p) => p.role)
    .filter((r): r is PlayerRole => r !== null);
    
  // Deduplicate roles to check thresholds once per role
  const uniqueRoles = [...new Set(activeRoles)];
  
  return uniqueRoles.filter((role) => {
    const thresholdFn = BENEFIT_THRESHOLDS[role];
    return thresholdFn ? thresholdFn(s) : false;
  });
}
