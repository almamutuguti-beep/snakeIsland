export interface ScoreEntry {
  score: number;
  boardSize: string;
  date: string;
}

const STORAGE_KEY = 'snakeisland-leaderboard';
const MAX_ENTRIES = 10;

export function getScores(): ScoreEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScoreEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveScore(score: number, boardSize: string): void {
  if (typeof window === 'undefined') return;
  const entries = getScores();
  entries.push({ score, boardSize, date: new Date().toISOString() });
  entries.sort((a, b) => b.score - a.score);
  const trimmed = entries.slice(0, MAX_ENTRIES);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}
