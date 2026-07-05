'use client';

interface Level {
  name: string;
  width: number;
  height: number;
  description: string;
}

const LEVELS: Level[] = [
  { name: 'Small', width: 12, height: 10, description: 'Tight board, quick games' },
  { name: 'Medium', width: 20, height: 15, description: 'The default experience' },
  { name: 'Large', width: 28, height: 20, description: 'More room, longer runs' },
];

interface LevelSelectProps {
  onSelect: (width: number, height: number) => void;
}

export function LevelSelect({ onSelect }: LevelSelectProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 bg-background text-foreground p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary">Choose a board size</h2>
        <p className="mt-2 text-muted-foreground">Movement is turn-based -- size changes difficulty, not speed</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {LEVELS.map((level) => (
          <button
            key={level.name}
            onClick={() => onSelect(level.width, level.height)}
            className="flex flex-col items-center gap-2 px-6 py-5 rounded-lg border border-border
                       bg-card hover:bg-secondary transition-colors min-w-[160px]"
          >
            <span className="text-xl font-semibold text-primary">{level.name}</span>
            <span className="text-sm text-muted-foreground">{level.width}×{level.height}</span>
            <span className="text-xs text-muted-foreground text-center">{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
