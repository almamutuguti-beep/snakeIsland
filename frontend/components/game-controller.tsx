'use client';

import { useEffect, useCallback } from 'react';

interface GameControllerProps {
  onDirection: (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => void;
  onReset: () => void;
  gameStatus: 'RUNNING' | 'WON' | 'LOST';
}

const DIRECTION_KEYS = {
  ArrowUp: 'UP',
  ArrowDown: 'DOWN',
  ArrowLeft: 'LEFT',
  ArrowRight: 'RIGHT',
  w: 'UP',
  s: 'DOWN',
  a: 'LEFT',
  d: 'RIGHT',
} as const;

export function GameController({
  onDirection,
  onReset,
  gameStatus,
}: GameControllerProps) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;

      if (key === 'r' || key === 'R') {
        onReset();
        return;
      }

      const direction = DIRECTION_KEYS[key as keyof typeof DIRECTION_KEYS];
      if (direction) {
        onDirection(direction);
        event.preventDefault();
      }
    },
    [onDirection, onReset]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleButtonClick = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    onDirection(direction);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-col gap-2 items-center md:flex md:flex-col">
        <button
          onClick={() => handleButtonClick('UP')}
          disabled={gameStatus !== 'RUNNING'}
          className="px-6 py-3 bg-primary/20 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50 rounded-lg font-mono font-bold text-primary transition-all"
          aria-label="Move up"
        >
          ↑ UP
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => handleButtonClick('LEFT')}
            disabled={gameStatus !== 'RUNNING'}
            className="px-6 py-3 bg-primary/20 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50 rounded-lg font-mono font-bold text-primary transition-all"
            aria-label="Move left"
          >
            ← LEFT
          </button>

          <button
            onClick={() => handleButtonClick('DOWN')}
            disabled={gameStatus !== 'RUNNING'}
            className="px-6 py-3 bg-primary/20 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50 rounded-lg font-mono font-bold text-primary transition-all"
            aria-label="Move down"
          >
            ↓ DOWN
          </button>

          <button
            onClick={() => handleButtonClick('RIGHT')}
            disabled={gameStatus !== 'RUNNING'}
            className="px-6 py-3 bg-primary/20 hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed border border-primary/50 rounded-lg font-mono font-bold text-primary transition-all"
            aria-label="Move right"
          >
            RIGHT →
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground space-y-1">
        <p className="font-mono">Use Arrow Keys or WASD to move</p>
        <p className="font-mono text-accent">Press R to reset</p>
      </div>

      <button
        onClick={onReset}
        className="px-8 py-2 bg-accent/20 hover:bg-accent/40 border border-accent/50 rounded-lg font-mono font-bold text-accent transition-all"
      >
        Reset Game
      </button>
    </div>
  );
}
