'use client';

import { useMemo } from 'react';

interface GameBoardProps {
  snakeBody: [number, number][];
  foodPosition: [number, number];
  boardWidth: number;
  boardHeight: number;
}

export function GameBoard({
  snakeBody,
  foodPosition,
  boardWidth,
  boardHeight,
}: GameBoardProps) {
  // Calculate cell size based on container
  const containerWidth = boardWidth * 24;
  const containerHeight = boardHeight * 24;

  const snakeSet = useMemo(() => {
    return new Set(snakeBody.map(([x, y]) => `${x},${y}`));
  }, [snakeBody]);

  const cells = useMemo(() => {
    const result = [];
    for (let y = 0; y < boardHeight; y++) {
      for (let x = 0; x < boardWidth; x++) {
        const key = `${x},${y}`;
        const isHead = snakeBody[0]?.[0] === x && snakeBody[0]?.[1] === y;
        const isBody = isHead ? false : snakeSet.has(key);
        const isFood = foodPosition[0] === x && foodPosition[1] === y;

        result.push({
          x,
          y,
          isHead,
          isBody,
          isFood,
          key,
        });
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
      {cells.map((cell) => (
        <div
          key={cell.key}
          className={`transition-all duration-75 ${
            cell.isHead
              ? 'bg-primary shadow-lg shadow-primary/60 rounded-full scale-100'
              : cell.isBody
                ? 'bg-primary/80 rounded-sm scale-95'
                : cell.isFood
                  ? 'bg-accent shadow-lg shadow-accent/60 rounded-full scale-105 animate-pulse'
                  : 'bg-neutral-800 hover:bg-neutral-700/50'
          }`}
          style={{
            aspectRatio: '1',
          }}
        />
      ))}
    </div>
  );
}
