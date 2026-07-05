'use client';

import { useMemo } from 'react';

interface GameBoardProps {
  snakeBody: [number, number][];
  foodPosition: [number, number];
  boardWidth: number;
  boardHeight: number;
}

type FacingDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

function getFacingDirection(snakeBody: [number, number][]): FacingDirection {
  if (snakeBody.length < 2) return 'RIGHT';
  const [headX, headY] = snakeBody[0];
  const [neckX, neckY] = snakeBody[1];
  const dx = headX - neckX;
  const dy = headY - neckY;
  if (dx > 0) return 'RIGHT';
  if (dx < 0) return 'LEFT';
  if (dy > 0) return 'DOWN';
  return 'UP';
}

const HEAD_LAYOUT: Record
  FacingDirection,
  { eyes: [number, number][]; tongueEnd: [number, number] }
> = {
  RIGHT: { eyes: [[16, 7], [16, 17]], tongueEnd: [24, 12] },
  LEFT: { eyes: [[8, 7], [8, 17]], tongueEnd: [0, 12] },
  UP: { eyes: [[7, 8], [17, 8]], tongueEnd: [12, 0] },
  DOWN: { eyes: [[7, 16], [17, 16]], tongueEnd: [12, 24] },
};

export function GameBoard({
  snakeBody,
  foodPosition,
  boardWidth,
  boardHeight,
}: GameBoardProps) {
  const containerWidth = boardWidth * 24;
  const containerHeight = boardHeight * 24;

  const snakeSet = useMemo(() => {
    return new Set(snakeBody.map(([x, y]) => `${x},${y}`));
  }, [snakeBody]);

  const facing = useMemo(() => getFacingDirection(snakeBody), [snakeBody]);
  const headCenter: [number, number] = HEAD_LAYOUT[facing].tongueEnd;
  const headEyes = HEAD_LAYOUT[facing].eyes;

  const cells = useMemo(() => {
    const result = [];
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        const key = `${x},${y}`;
        const isHead = snakeBody[0]?.[0] === x && snakeBody[0]?.[1] === y;
        const isBody = isHead ? false : snakeSet.has(key);
        const isFood = foodPosition[0] === x && foodPosition[1] === y;

        result.push({ x, y, isHead, isBody, isFood, key });
      }
    }
    return result;
  }, [snakeBody, snakeSet, foodPosition, boardHeight, boardWidth]);

  return (
    <div
      className="bg-neutral-900 border-2 border-primary/30 shadow-2xl"
      style={{
        width: containerWidth,
        height: containerHeight,
        display: 'grid',
        gridTemplateColumns: `repeat(${boardWidth}, 1fr)`,
        gap: '1px',
        padding: '4px',
        backgroundColor: '#0a0e1a',
      }}
    >
      {cells.map((cell) => {
        if (cell.isHead) {
          return (
            <div key={cell.key} style={{ aspectRatio: '1', position: 'relative' }}>
              <svg
                viewBox="0 0 24 24"
                className="w-full h-full drop-shadow-[0_0_6px_rgba(0,255,150,0.6)]"
              >
                <line
                  x1={12}
                  y1={12}
                  x2={headCenter[0]}
                  y2={headCenter[1]}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                />
                <circle cx={headCenter[0]} cy={headCenter[1]} r={0.9} fill="#ef4444" />

                <rect x={2} y={2} width={20} height={20} rx={6} fill="#22c55e" />

                {headEyes.map(([ex, ey], i) => (
                  <circle key={i} cx={ex} cy={ey} r={2} fill="#0a0e1a" />
                ))}
              </svg>
            </div>
          );
        }

        return (
          <div
            key={cell.key}
            className={`transition-all duration-75 ${
              cell.isBody
                ? 'bg-primary/80 rounded-sm scale-95'
                : cell.isFood
                  ? 'bg-accent shadow-lg shadow-accent/60 rounded-full scale-105 animate-pulse'
                  : 'bg-neutral-800 hover:bg-neutral-700/50'
            }`}
            style={{ aspectRatio: '1' }}
          />
        );
      })}
    </div>
  );
}
