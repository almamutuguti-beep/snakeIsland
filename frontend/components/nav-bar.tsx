'use client';

interface NavBarProps {
  onNavigate: (screen: 'landing' | 'leaderboard' | 'profile') => void;
  current: string;
}

export function NavBar({ onNavigate, current }: NavBarProps) {
  const items: { key: 'landing' | 'leaderboard' | 'profile'; label: string }[] = [
    { key: 'landing', label: 'Home' },
    { key: 'leaderboard', label: 'Leaderboard' },
    { key: 'profile', label: 'Profile' },
  ];

  return (
    <nav className="w-full flex justify-center gap-2 py-4 bg-card border-b border-border">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onNavigate(item.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            current === item.key
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary'
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
