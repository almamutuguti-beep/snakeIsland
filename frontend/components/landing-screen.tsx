'use client';

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-background text-foreground">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-primary">SnakeIsland</h1>
        <p className="mt-2 text-muted-foreground">A live snake game, powered by Python + WebSocket</p>
      </div>

      <button
        onClick={onStart}
        className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg
                   hover:opacity-90 transition-opacity shadow-lg shadow-primary/30"
      >
        Start Game
      </button>

      <p className="text-sm text-muted-foreground">Use arrow keys or WASD to move once started</p>
    </div>
  );
}
