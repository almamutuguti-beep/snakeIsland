export interface ScoreEntry {
  player: string;
  score: number;
  boardSize: string;
  date: string;
}

const STORAGE_KEY = 'snakeisland-leaderboard';
const SEEDED_KEY = 'snakeisland-leaderboard-seeded';
const MAX_ENTRIES = 10;

// Fake demo data so the leaderboard/profile UI isn't empty on first load.
// Clearly not real accounts -- no login exists, this is illustrative only.
const EXAMPLE_ENTRIES: ScoreEntry[] = [
  { player: 'Amina', score: 140, boardSize: '20x15', date: '2026-06-28T10:00:00.000Z' },
  { player: 'Brian', score: 110, boardSize: '28x20', date: '2026-06-29T14:30:00.000Z' },
  { player: 'Cynthia', score: 95, boardSize: '12x10', date: '2026-06-30T09:15:00.000Z' },
  { player: 'David', score: 80, boardSize: '20x15', date: '2026-07-01T18:45:00.000Z' },
  { player: 'Faith', score: 60, boardSize: '20x15', date: '2026-07-02T20:00:00.000Z' },
];

function seedIfEmpty(): void {
  if (typeof window === 'undefined') return;
  const alreadySeeded = window.localStorage.getItem(SEEDED_KEY);
  if (alreadySeeded) return;

  const existing = window.localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(EXAMPLE_ENTRIES));
  }
  window.localStorage.setItem(SEEDED_KEY, 'true');
}

export function getScores(): ScoreEntry[] {
  if (typeof window === 'undefined') return [];
  seedIfEmpty();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScore(score: number, boardSize: string, player = 'You'): void {
  if (typeof window === 'undefined') return;
  const entries = getScores();
  entries.push({ player, score, boardSize, date: new Date().toISOString() });
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function getPlayerNames(): string[] {
  const entries = getScores();
  return Array.from(new Set(entries.map((e) => e.player)));
}

export function getStatsForPlayer(player: string) {
  const entries = getScores().filter((e) => e.player === player);
  const gamesPlayed = entries.length;
  const highScore = entries.reduce((max, e) => Math.max(max, e.score), 0);
  const avgScore = gamesPlayed > 0
    ? Math.round(entries.reduce((sum, e) => sum + e.score, 0) / gamesPlayed)
    : 0;
  return { gamesPlayed, highScore, avgScore, entries };
}
