'use client';

import { GameContainer } from '@/components/game-container';

export default function Page() {
  // Update the URL to match your backend server
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/game';

  return <GameContainer wsUrl={wsUrl} />;
}
