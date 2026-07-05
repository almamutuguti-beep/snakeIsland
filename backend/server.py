"""
FastAPI WebSocket server for the Snake game (turn-based, with level select).

Run with:  uvicorn server:app --reload --port 8000

Connect with optional level query params, e.g.:
  ws://localhost:8000/ws/game?width=15&height=10

Protocol (JSON over WebSocket, at ws://localhost:8000/ws/game):
  Server -> Client, after every move:
    {
      "type": "state",
      "snake_body": [[x, y], ...],   // head first
      "food_position": [x, y],
      "score": 0,
      "status": "RUNNING" | "WON" | "LOST",
      "board_width": 20,
      "board_height": 15
    }

  Client -> Server, on keypress:
    {"type": "direction", "value": "UP" | "DOWN" | "LEFT" | "RIGHT"}
    {"type": "reset"}
"""

import json

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from snake_game.engine import GameEngine
from snake_game.models import Direction

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


def state_to_json(engine: GameEngine) -> str:
    state = engine.get_state()
    return json.dumps({
        "type": "state",
        "snake_body": [[p.x, p.y] for p in state.snake_body],
        "food_position": [state.food_position.x, state.food_position.y],
        "score": state.score,
        "status": state.status.name,
        "board_width": state.board_width,
        "board_height": state.board_height,
    })


def _parse_dimension(raw_value, fallback):
    """Best-effort int parse for a query param -- falls back to config default on anything invalid."""
    try:
        value = int(raw_value)
        return value if value > 0 else fallback
    except (TypeError, ValueError):
        return fallback


@app.websocket("/ws/game")
async def game_socket(websocket: WebSocket):
    await websocket.accept()

    width = _parse_dimension(websocket.query_params.get("width"), None)
    height = _parse_dimension(websocket.query_params.get("height"), None)
    engine = GameEngine(board_width=width, board_height=height)

    # Send the initial state immediately so the board renders before any keypress.
    await websocket.send_text(state_to_json(engine))

    try:
        while True:
            raw = await websocket.receive_text()
            msg = json.loads(raw)

            if msg.get("type") == "direction":
                try:
                    engine.change_direction(Direction[msg["value"]])
                except KeyError:
                    continue  # ignore malformed direction values

                # Turn-based: the snake only advances in response to a keypress.
                engine.update()
                await websocket.send_text(state_to_json(engine))

            elif msg.get("type") == "reset":
                engine.reset()
                await websocket.send_text(state_to_json(engine))

    except WebSocketDisconnect:
        pass