# SnakeIsland — Setup Guide

A Python game engine (FastAPI + WebSocket) with a React frontend (Vite + Canvas).

## Prerequisites

- Python 3.11+ with `pip`
- Node.js 18+ with `npm`
- Git

## Folder structure

```
SnakeIsland/
├── backend/
│   ├── snake_game/       # game engine package
│   ├── server.py         # FastAPI WebSocket server
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/GameCanvas.jsx
│       └── hooks/useGameSocket.js
├── .gitignore
└── SETUP.md
```

## 1. Clone and enter the repo

```
git clone <repo-url>
cd SnakeIsland
```

## 2. Backend setup

```
cd backend
python -m venv venv
source venv/Scripts/activate      # Windows Git Bash
# source venv/bin/activate        # macOS/Linux
pip install -r requirements.txt
```

Run the server:

```
uvicorn server:app --reload --port 8000
```

Verify it's actually working — startup succeeding is not enough proof by itself:

```
curl http://localhost:8000/docs
```

Should return Swagger UI HTML. If you get `Internal Server Error`, check the terminal running `uvicorn` for the traceback — the error is always printed there, not in the curl output.

## 3. Frontend setup

Open a second terminal, keep `uvicorn` running in the first one.

```
cd frontend
npm install
npm run dev
```

Open the printed `localhost:5173` URL. You should see the SnakeIsland canvas connect and the snake move automatically. Arrow keys / WASD change direction.

## 4. Common pitfalls (hit during initial setup — read before debugging blind)

- **`ModuleNotFoundError` on import**: every file inside `snake_game/` must import other project modules as `from snake_game.xxx import ...` — never `from backend.snake_game.xxx import ...` and never a bare `from xxx import ...`. The import root is `backend/`, since that's where `uvicorn` runs from.
- **File not found errors (`requirements.txt`, `package.json`, etc.)**: these mean you're either not `cd`'d into the right folder, or the file was never actually saved to disk. Run `pwd` and `ls` before assuming the file is broken.
- **Don't hand-retype files from chat or docs.** Every real bug hit during setup was a one-character drift introduced by manual retyping (`allows_origins` vs `allow_origins`, `game_ovr` vs `game_over`, etc.). Copy-paste or download-and-move; don't retype.
- **`ASGI 'lifespan' protocol appears unsupported`** on `uvicorn` startup is informational, not an error — safe to ignore.
- **Verify the WebSocket layer directly**, don't assume it works because the server started:
  ```
  python -c "
  import asyncio, websockets
  async def test():
      async with websockets.connect('ws://localhost:8000/ws/game') as ws:
          for _ in range(5):
              print(await ws.recv())
  asyncio.run(test())
  "
  ```
  Should print 5 JSON state messages with `snake_body` shifting by one cell each time.
- **Stale bytecode**: if edits don't seem to take effect, clear the cache:
  ```
  find snake_game -name "__pycache__" -exec rm -rf {} +
  ```

## 5. Git workflow

- `.gitignore` at the repo root covers `__pycache__/`, `venv/`, `node_modules/`, `dist/` — it must exist *before* your first `git add`, or those folders get tracked and need a manual `git rm -r --cached` to undo.
- Commit backend and frontend changes separately; keep bug fixes (`fix:`) separate from new features (`feat:`) even within the same file, so history stays readable.