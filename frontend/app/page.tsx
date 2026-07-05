'use client';

import { useState } from 'react';
import { GameContainer } from '@/components/game-container';
import { LandingScreen } from '@/components/landing-screen';
import { LevelSelect } from '@/components/level-select';
import { Leaderboard } from '@/components/leaderboard';

type Screen = 'landing' | 'levelSelect' | 'playing' | 'leaderboard';

export default function Page() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/game';

  if (screen === 'landing') {
    return <LandingScreen onStart={() => setScreen('levelSelect')} />;
  }

  if (screen === 'levelSelect') {
    return (
      <LevelSelect
        onSelect={(width, height) => {
          setDimensions({ width, height });
          setScreen('playing');
        }}
      />
    );
  }

  if (screen === 'leaderboard') {
    return <Leaderboard onBack={() => setScreen('landing')} />;
  }

  const wsUrl = dimensions
    ? `${baseWsUrl}?width=${dimensions.width}&height=${dimensions.height}`
    : baseWsUrl;

  return (
    <GameContainer
      wsUrl={wsUrl}
      onExit={() => setScreen('levelSelect')}
      onViewLeaderboard={() => setScreen('leaderboard')}
    />
  );
}
