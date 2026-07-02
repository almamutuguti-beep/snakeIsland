"""
FastAPI WebSocket server for the snake game
Run with: uvicorn server:app -- reload --port 800
Protocol (JSON over websocket, at ws://localhost:8000/ws/game):
    Server -> Client, every trick:
        {
            "type": "state",
            "snake_body": [[x, y], ...], // head first
            "food_position": [x, y],
            "score": 0,
            "status": "RUNNING" | "WON" | "LOST",
            "board_width": 20,
            "board_height": 15
        }

    Client -> Server, on keypass:
        {"type": "direction", "value": "UP" | "DOWN" | "LEFT" | "RIGHT"}
        {"type": "reset"}  // reset the game

"""

import json
import asyncio

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from snake_game.engine import GameEngine
from snake_game.models import Direction

TICK_SECONDS = 0.15

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def state_to_json(engine: GameEngine) -> str:
    """
    Convert the current game state to a JSON string for sending to the client.
    """
    state = engine.get_state()
    return json.dumps({
        "type": "state",
        "snake_body": [[p.x, p.y] for p in state.snake_body],
        "food_position": [state.food_position.x, state.food_position.y],
        "score": state.score,
        "status": state.status.name,
        "board_width": state.board_width,
        "board_height": state.board_height
    })

@app.websocket("/ws/game")
async def game_socket(websocket: WebSocket):
    await websocket.accept()
    engine = GameEngine()

    async def receive_loop():
        """Handle incoming direction changes / resets without blocking the game loop."""

        try:
            while True:
                raw = await websocket.receive_text()
                msg = json.loads(raw)
                if msg.get("type") == "direction":
                    try:
                        engine.change_direction(Direction[msg["value"]])
                    except KeyError:
                        pass
                
                elif msg.get("type") == "reset":
                    engine.reset()
        
        except WebSocketDisconnect:
            pass
    receiver_task = asyncio.create_task(receive_loop())

    try:
        while True:
            engine.update()
            await websocket.send_text(state_to_json(engine))
            await asyncio.sleep(TICK_SECONDS)
    
    except WebSocketDisconnect:
        pass

    finally:
        receiver_task.cancel()
    



