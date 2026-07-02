"""
Accepts user input and drives the turn-based debug loop.

This module has ONE job: read keyboard input, translate it into a direction or a quit signal, ask the engine
to advance the game, and then ask the renderer to display the result.

"""

from __future__ import annotations

from snake_game.engine import GameEngine
from snake_game.models import Direction
from snake_game.renderer import render_board, render_score, render_status   

#Maps user input to Direction enum values
_KEY_TO_DIRECTION = {
    'w': Direction.UP,
    'a': Direction.LEFT,
    's': Direction.DOWN,
    'd': Direction.RIGHT
}


def get_player_input() -> str:
    """
    Prompt the player for a single key to return it lowercased and stripped of whitespace.
    Kept as its own function so that the input method (plain input()_ for now) can later
    be swapped fpr a difeerent ker-reading approach without touching the game loop.
    """
    raw = input("Move (WASD) or Q to quit: ")
    return raw.strip().lower()


def interpret_input(raw_key: str) -> tuple[Direction | None, bool]:
    """
    Convert the raw key into a Direction or a quit signal.
    Returns a tuple of (direction, quit_flag).
    """
    key = raw_key.strip().lower()
    if key == 'q':
        return None, True
    if key in _KEY_TO_DIRECTION:
        return _KEY_TO_DIRECTION[key], False
    return None, False


def run_game() -> None:
    """
    The main turn-based game loop. Called once by main.py

    loop outlines:
    1. Render the current game state to the console.
    2. Prompt the player for input.
    3. Interpret the input and update the game state accordingly.
    4. Repeat until the game is over or the player quits.
    """
    #ADJUST HERE IF ENGINE.PY FIELD NAMES ARE DIFFERENT
    game = GameEngine()
    state = game.get_state()

    while True:
        #Render the current game state
        print(render_board(state))
        print(render_score(state))
        print(render_status(state))

        #Get player input
        raw_key = get_player_input()
        direction, quit_flag = interpret_input(raw_key)

        if quit_flag:
            print("Thanks for playing!")
            return
        if direction is not None:
            game.change_direction(direction)
        
        game.update()

#ADJUST HERE IF ENGINE.PY FIELD NAMES ARE DIFFERENT
        state = game.get_state()
        
        if state.is_over:
            print(render_board(state))
            print("Game Over! Thanks for playing!")
            return

