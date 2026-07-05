'use client';

import { useState } from 'react';
import { GameContainer } from '@/components/game-container';
import { LandingScreen } from '@/components/landing-screen';
import { LevelSelect } from '@/components/level-select';
import { Leaderboard } from '@/components/leaderboard';
import { Profile } from '@/components/profile';
import { NavBar } from '@/components/nav-bar';

type Screen = 'landing' | 'levelSelect' | 'playing' | 'leaderboard' | 'profile';

export default function Page() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const baseWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/game';
  const showNav = screen === 'landing' || screen === 'leaderboard' || screen === 'profile';

  const wsUrl = dimensions
    ? `${baseWsUrl}?width=${dimensions.width}&height=${dimensions.height}`
    : baseWsUrl;

  return (
    <>
      {showNav && <NavBar current={screen} onNavigate={(target) => setScreen(target)} />}

      {screen === 'landing' && <LandingScreen onStart={() => setScreen('levelSelect')} />}

      {screen === 'levelSelect' && (
        <LevelSelect
          onSelect={(width, height) => {
            setDimensions({ width, height });
            setScreen('playing');
          }}
        />
      )}

      {screen === 'leaderboard' && <Leaderboard onBack={() => setScreen('landing')} />}

      {screen === 'profile' && <Profile onBack={() => setScreen('landing')} />}

      {screen === 'playing' && (
        <GameContainer
          wsUrl={wsUrl}
          onExit={() => setScreen('levelSelect')}
          onViewLeaderboard={() => setScreen('leaderboard')}
        />
      )}
    </>
  );
}
