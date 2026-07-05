'use client';

import { useEffect, useState } from 'react';
import { getPlayerNames, getStatsForPlayer } from '@/lib/leaderboard';

interface ProfileProps {
  onBack: () => void;
}

export function Profile({ onBack }: ProfileProps) {
  const [players, setPlayers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const names = getPlayerNames();
    setPlayers(names);
    if (names.length > 0) setSelected(names[0]);
  }, []);

  const stats = selected ? getStatsForPlayer(selected) : null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-background text-foreground p-4">
      <h2 className="text-3xl font-bold text-primary">Profile</h2>
      <p className="text-sm text-muted-foreground -mt-4 text-center max-w-md">
        Demo view -- there's no login yet, so pick a name to preview its stats.
      </p>

      {players.length > 0 && (
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="px-4 py-2 rounded-lg bg-card border border-border text-foreground"
        >
          {players.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      )}

      {stats && (
        <div className="flex gap-8 flex-wrap justify-center">
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Games Played</p>
            <p className="text-3xl font-bold text-primary">{stats.gamesPlayed}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">High Score</p>
            <p className="text-3xl font-bold text-accent">{stats.highScore}</p>
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">Avg Score</p>
            <p className="text-3xl font-bold text-primary">{stats.avgScore}</p>
          </div>
        </div>
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
