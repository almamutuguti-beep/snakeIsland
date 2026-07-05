'use client';

import { useEffect, useState } from 'react';
import { getScores, type ScoreEntry } from '@/lib/leaderboard';

interface LeaderboardProps {
  onBack: () => void;
}

export function Leaderboard({ onBack }: LeaderboardProps) {
  const [entries, setEntries] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setEntries(getScores());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-foreground p-4">
      <h2 className="text-3xl font-bold text-primary">Leaderboard</h2>
      <p className="text-sm text-muted-foreground -mt-4">Stored locally in this browser</p>

      {entries.length === 0 ? (
        <p className="text-muted-foreground">No games played yet -- go set a score.</p>
      ) : (
        <table className="w-full max-w-md text-left">
          <thead>
            <tr className="text-muted-foreground text-sm uppercase tracking-wider">
              <th className="pb-2">#</th>
              <th className="pb-2">Player</th>
              <th className="pb-2">Score</th>
              <th className="pb-2">Board</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={i} className="border-t border-border">
                <td className="py-2 text-primary font-semibold">{i + 1}</td>
                <td className="py-2">{entry.player}</td>
                <td className="py-2 font-bold text-accent">{entry.score}</td>
                <td className="py-2 text-muted-foreground text-xs">{entry.boardSize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={onBack}
        className="px-6 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity"
      >
        Back
      </button>
    </div>
  );
}
