'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { GameBoard } from './game-board';
import { GameController } from './game-controller';
import { saveScore } from '@/lib/leaderboard';

interface GameState {
  type: string;
  snake_body: [number, number][];
  food_position: [number, number];
  score: number;
  status: 'RUNNING' | 'WON' | 'LOST';
  board_width: number;
  board_height: number;
}

interface GameContainerProps {
  wsUrl?: string;
  onExit?: () => void;
  onViewLeaderboard?: () => void;
}

export function GameContainer({
  wsUrl = 'ws://localhost:8000/ws/game',
  onExit,
  onViewLeaderboard,
}: GameContainerProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const scoreSavedRef = useRef(false);

  useEffect(() => {
    const connect = () => {
      try {
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          setError(null);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as GameState;
            setGameState(data);
          } catch (err) {
            console.error('[v0] Failed to parse game state:', err);
          }
        };

        ws.onerror = () => {
          setError('Connection error. Attempting to reconnect...');
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimeoutRef.current = setTimeout(connect, 2000);
        };

        wsRef.current = ws;
      } catch (err) {
        setError('Failed to connect to game server');
      }
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [wsUrl]);

  useEffect(() => {
    if (!gameState) return;
    if (gameState.status === 'RUNNING') {
      scoreSavedRef.current = false;
      return;
    }
    if (!scoreSavedRef.current) {
      scoreSavedRef.current = true;
      saveScore(gameState.score, `${gameState.board_width}x${gameState.board_height}`);
    }
  }, [gameState]);

  const sendMessage = useCallback((msg: object) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const handleDirection = useCallback(
    (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      sendMessage({ type: 'direction', value: direction });
    },
    [sendMessage]
  );

  const handleReset = useCallback(() => {
    sendMessage({ type: 'reset' });
  }, [sendMessage]);

  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">SnakeIsland</h1>
          <p className="text-muted-foreground">
            {error || (isConnected ? 'Waiting for game...' : 'Connecting...')}
          </p>
        </div>
        {error && (
          <div className="text-destructive text-sm max-w-md text-center">{error}</div>
        )}
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const statusMessage =
    gameState.status === 'WON'
      ? 'You Won!'
      : gameState.status === 'LOST'
        ? 'Game Over'
        : 'Playing';

  const statusColor =
    gameState.status === 'WON'
      ? 'text-accent'
      : gameState.status === 'LOST'
        ? 'text-destructive'
        : 'text-primary';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-4 bg-background">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-primary">SnakeIsland</h1>
        <p className="text-sm text-muted-foreground">
          {isConnected ? '● Connected' : '● Disconnected'}
        </p>
      </div>

      <div className="flex gap-8 md:gap-12 flex-wrap justify-center">
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Score</p>
          <p className="text-3xl md:text-4xl font-bold text-accent">{gameState.score}</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Length</p>
          <p className="text-3xl md:text-4xl font-bold text-primary">{gameState.snake_body.length}</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Status</p>
          <p className={`text-3xl md:text-4xl font-bold ${statusColor}`}>{statusMessage}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <GameBoard
          snakeBody={gameState.snake_body}
          foodPosition={gameState.food_position}
          boardWidth={gameState.board_width}
          boardHeight={gameState.board_height}
        />
      </div>

      <GameController
        onDirection={handleDirection}
        onReset={handleReset}
        gameStatus={gameState.status}
      />

      <div className="flex gap-3">
        {onViewLeaderboard && (
          <button
            onClick={onViewLeaderboard}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity text-sm"
          >
            Leaderboard
          </button>
        )}
        {onExit && (
          <button
            onClick={onExit}
            className="px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:opacity-90 transition-opacity text-sm"
          >
            Change level
          </button>
        )}
      </div>

      <div className="text-center text-xs text-muted-foreground space-y-1">
        <p>Board: {gameState.board_width}×{gameState.board_height}</p>
      </div>
    </div>
  );
}
