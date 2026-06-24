"""
Renders the game state to the screen.

This module is responsible for displaying the current state of the game to the console. 
It provides functions to render the game board, snake, food, and other game elements in a visually appealing manner. 
The rendering functions are designed to be efficient and responsive, ensuring that the game runs smoothly even on lower-end systems.

"""
from __future__ import annotations

from snake_game import config
from snake_game.models import GameStatus, Point

def render_board(state) -> str:
    """
    Build the full text board 
    (including the snake, food, and other elements) based 
    on the current game state.
    """
    snake_cells = state.snake_body
    food_cell = state.food_position

    head = snake_cells[0]
    body = set(snake_cells[1:]) 

    rows = []

    #Top wall : corner + horizontal wall * width + corner
    top_wall = config.corner_symbol + (config.wall_h_symbol * config.board_width) + config.corner_symbol
    rows.append(top_wall)

    #Each playable row , wrapped with vertical wall symbols
    for y in range(config.board_height):
        row_chars = []
        for x in range(config.board_width):
            cell = Point(x, y)
            if cell == head:
                row_chars.append(config.head_symbol)
            elif cell in body:
                row_chars.append(config.body_symbol)
            elif cell == food_cell:
                row_chars.append(config.food_symbol)
            else:
                row_chars.append(config.empty_symbol)
        rows.append(config.wall_v_symbol + ''.join(row_chars) + config.wall_v_symbol)

    #Bottom wall : corner + horizontal wall * width + corner
    rows.append(top_wall)

    return "\n".join(rows)

def render_score(state) -> str:
    """
    Render the current score and game status.
    """
  
    score = state.score
    return f"Score: {score}"
    
def render_status(state) -> str:
    """
    Render the current game status.
    """
    #ADJUDT HERE IF STATE.PY FIELD NAMES ARE DIFFERENT

    status = state.status

    if status == GameStatus.WON:
        return "You won! Congratulations!"
    elif status == GameStatus.LOST:
        return "Game Over! You lost!"
    else:
        return "Game in progress..."


def render_frame(state) -> str:
    """
    Render the entire game frame, including the board, score, and status.
    """
    board = render_board(state)
    score = render_score(state)
    status = render_status(state)

    return f"{render_board(state)}\n{render_score(state)}\n{render_status(state)}"




