# SnakeIsland — Setup Guide

A Python game engine, playable as a terminal console app or as a full web app (FastAPI + WebSocket backend, Next.js frontend).

## Prerequisites

- Python 3.11+ with `pip`
- Node.js 18+ with `npm`
- `pnpm` (`npm install -g pnpm`) — the web frontend uses a `pnpm-lock.yaml`, not `package-lock.json`
- Git

## Folder structure

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
│   └── cli.py
├── main.py                 # console entry point
├── backend/
│   ├── snake_game/          # same engine package, used by the web server
│   ├── server.py            # FastAPI WebSocket server
│   └── requirements.txt
├── frontend/
│   ├── package.json
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
│       ├── landing-screen.tsx
│       ├── level-select.tsx
│       ├── game-board.tsx
│       ├── game-controller.tsx
│       ├── game-container.tsx
│       ├── leaderboard.tsx
│       ├── profile.tsx
│       └── nav-bar.tsx
├── .gitignore
├── README.md
└── SETUP.md
```

## 1. Clone and enter the repo

```
git clone <repo-url>
cd SnakeIsland
```

## 2. Console version (fastest way to verify the engine works)

```
python main.py
```

Controls: W/A/S/D to move, Q to quit. No servers needed — this runs the engine directly in your terminal.

## 3. Web version — backend setup

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

Verify it's actually working — startup succeeding is not proof by itself:

```
curl http://localhost:8000/docs
```

Should return Swagger UI HTML. If you get `Internal Server Error`, check the terminal running `uvicorn` for the traceback — the error is always printed there, not in the curl output.

To verify the WebSocket layer specifically (not just that FastAPI booted), in a third terminal with the venv active:

```
python -c "
import asyncio, websockets

async def test():
    async with websockets.connect('ws://localhost:8000/ws/game') as ws:
        print(await ws.recv())
        await ws.send('{\"type\": \"direction\", \"value\": \"RIGHT\"}')
        print(await ws.recv())

asyncio.run(test())
"
```

Should print two JSON state messages, the second showing the snake's head shifted one cell. Movement is turn-based — the engine only advances on a `direction` message, not on a timer.

## 4. Web version — frontend setup

Open a separate terminal, keep `uvicorn` running.

```
cd frontend
pnpm install
```

If this fails with `[ERR_PNPM_IGNORED_BUILDS]`, run:

```
pnpm approve-builds
```

and approve `sharp` (Next.js's image library) when prompted, then re-run `pnpm install`.

```
pnpm dev
```

Open `http://localhost:3000`. Flow: Landing → Level Select → Game. Arrow keys or WASD send a move; the snake only advances one step per keypress, it does not move on its own.

## 5. Common pitfalls (hit repeatedly during development — read before debugging blind)

- **`ModuleNotFoundError` on import**: every file inside `snake_game/` must import other project modules as `from snake_game.xxx import ...` — never `from backend.snake_game.xxx import ...` and never a bare `from xxx import ...`. The import root is wherever `uvicorn`/`python` is actually run from.
- **File not found errors** (`requirements.txt`, `package.json`, etc.): means you're not `cd`'d into the right folder, or the file was never actually saved. Run `pwd` and `ls` before assuming the file itself is broken.
- **Don't hand-retype files from chat or docs.** Every recurring bug this project hit was a manual-typing drift: a dropped comma silently truncating a `package.json`, `allows_origins` vs `allow_origins`, `game_ovr` vs `game_over`, `_board.tsx` vs `-board.tsx` filename mismatches. Use `cat > file << 'EOF' ... EOF` heredocs or copy-paste — never retype a file from memory or by reading it off a screen.
- **CORS origin must match the frontend's actual port.** `server.py`'s `CORSMiddleware` is set to `http://localhost:3000` (Next.js). If you're running a different frontend on a different port, update `allow_origins` to match, or WebSocket connections will fail silently in the browser console with a generic error.
- **`[ERR_PNPM_IGNORED_BUILDS]: sharp`**: pnpm blocks native postinstall scripts by default. Run `pnpm approve-builds`, approve `sharp`, reinstall.
- **`ASGI 'lifespan' protocol appears unsupported`** on `uvicorn` startup is informational, not an error — safe to ignore.
- **Stale bytecode**: if edits don't seem to take effect, clear the cache:
  ```
  find snake_game -name "__pycache__" -exec rm -rf {} +
  ```
- **A clean `pnpm dev` / `uvicorn` startup proves nothing about game logic.** Both servers can start with zero errors while a WebSocket handler crashes the instant a real message arrives. Always test an actual direction keypress and watch the `uvicorn` terminal for a traceback, not just the startup log.

## 6. Git workflow

- `.gitignore` at the repo root covers `__pycache__/`, `venv/`, `node_modules/`, `dist/` — it must exist *before* your first `git add`, or those folders get tracked and need a manual `git rm -r --cached` to undo.
- Commit backend and frontend changes separately; keep bug fixes (`fix:`) separate from new features (`feat:`) even within the same file, so history stays readable.
