# SnakeIsland

A Snake game built with a shared Python game engine, playable two ways: as a terminal console app, and as a full web app with a Next.js frontend talking to the engine live over WebSocket.

## Architecture

The game logic (`snake_game/`) is a standalone package with no UI baked in -- both front ends below just call into it.

- **Console version**: `main.py` -> `snake_game/cli.py` -> `snake_game/engine.py`, rendered as text via `snake_game/renderer.py`. Turn-based: press a key, the game advances one step.
- **Web version**: `backend/server.py` (FastAPI) wraps the same `snake_game/engine.py` behind a WebSocket, and `frontend/` (Next.js + TypeScript + Tailwind) renders the board in the browser and sends direction/reset messages back.
- **Protocol** (web only): JSON over `ws://localhost:8000/ws/game`. Server sends full game state after every move; client sends `{"type": "direction", "value": "UP"}` or `{"type": "reset"}`.

## Features

- Turn-based snake movement (arrow keys / WASD in the browser, WASD in the console)
- Level select in the web version -- three board sizes (Small/Medium/Large), changing difficulty via board area
- Directional snake head with eyes and a tongue that orients to the current facing direction (web version)
- Local leaderboard (browser `localStorage`), seeded with example entries so it isn't empty on first load
- Demo profile view -- pick a name, see aggregate stats (games played, high score, average score)
- Simple nav bar for Home / Leaderboard / Profile

## Tech stack

| Layer | Tech |
|---|---|
| Game engine | Python 3.13, dataclasses, enums |
| Console UI | Plain `print()` / `input()` |
| Backend server | FastAPI, Uvicorn, WebSockets |
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS v4 |

## Running the console version

```bash
python main.py
```

Controls: W/A/S/D to move, Q to quit.

## Running the web version

See [`SETUP.md`](./SETUP.md) for full setup and troubleshooting. Quick version:

```bash
# backend
cd backend
python -m venv venv
source venv/Scripts/activate   # or venv/bin/activate on macOS/Linux
pip install -r requirements.txt
uvicorn server:app --reload --port 8000

# frontend, separate terminal
cd frontend
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Known limitations

- **No real accounts.** The leaderboard and profile are local to your browser (`localStorage`) and seeded with example names for demonstration -- there's no login, so "Profile" lets you preview any name's stats rather than showing your own persisted identity.
- **No persistence across devices/browsers.** Clearing browser storage resets your scores.
- **Single game session per connection.** Each WebSocket connection gets its own in-memory `GameEngine`; nothing is shared or saved server-side.
- **`GhostTrail.py` is unfinished.** It implements a fading wall-trail mechanic but isn't wired into the engine, and `Snake.collides_with_trail()` references a `self.trail` attribute that doesn't currently exist on the class -- calling it will raise an error. Not part of the working game yet.

## Future enhancements

- **Persistent database** (e.g. PostgreSQL or SQLite to start) to store scores and profiles server-side instead of `localStorage`, so a leaderboard reflects all players, not just one browser.
- **Real user accounts** -- signup/login with securely hashed passwords, session/token-based auth, and protected endpoints for saving scores under a verified identity.
- **Persistent player profiles** tied to real accounts: win/loss history, longest snake, per-level best scores, across devices.
- **Global leaderboard** aggregated server-side across all players, instead of per-browser local storage.
- **Ghost trail mechanic** -- finish wiring `GhostTrail.py` into `engine.py` so eaten cells leave a temporary fading wall.
- **Deployment** -- containerize the backend, host the frontend (e.g. Vercel) and backend (e.g. Fly.io/Render), replace `localhost` URLs with environment-configured production endpoints.

## Project structure

```
SnakeIsland/
├── snake_game/            # shared game engine package
│   ├── __init__.py
│   ├── config.py
│   ├── models.py
│   ├── snake.py
│   ├── food.py
│   ├── engine.py
│   ├── state.py
│   ├── renderer.py
│   ├── cli.py
│   └── GhostTrail.py       # experimental, not yet wired in
├── main.py                 # console entry point
├── backend/
│   ├── snake_game/          # same engine package, used by the web server
│   ├── server.py
│   └── requirements.txt
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
├── SETUP.md
└── README.md
```

## Developers

| Name | Admission Number |
|---|---|
| Adan Chueb | 227950 |
| Mohamed Yusuf | 227970 |
| Lemayian Kanyeki | 227973 |
| Chedvah Beraca | 229672 |
| Alma Mutuguti | 218531 |
