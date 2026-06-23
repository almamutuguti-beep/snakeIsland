from __future__ import annotations
from dataclasses import dataclass
from enum import Enum

# Point (an x, y) on the grid
@dataclass(frozen=True)
class Point:
    "An immutable point on the grid"
    "x increases to the right, y increases downwards"
    "Frozen so points can be stored in sets and used as dict keys which is uselful for fast - is the cell ocupied? checks"

    x: int
    y: int

    # Arithmetic operations for points
    def __add__(self, other: Point) -> Point:
        "Return a new point shifted by another point (used for moving the snake)"
        return Point(self.x + other.x, self.y + other.y)
    
    def __repr__(self) -> str:
        "Pragmatic string representation for debugging"
        return f"({self.x}, {self.y})"
    


# Directions the snake can move
class Direction(Enum):

    "The four cardinal movement directions expressed as (dy, dx) deltas for easy movement calculations"
    "Because y increases downwards, UP is moves to a smaller row -> dy = -1, DOWN is moves to a larger row -> dy = +1"
    "LEFT is moves to a smaller column -> dx = -1, RIGHT is moves to a larger column -> dx = +1"
    "Each enum value is a Point representing the movement delta for that direction, so we can easily calculate the new head position by adding the direction's value to the current head position"

    UP = Point(0, -1)
    DOWN = Point(0, 1)
    LEFT = Point(-1, 0)
    RIGHT = Point(1, 0)

    # Helper method to get the opposite direction (used to prevent the snake from reversing into itself)
    def is_opposite(self, other: Direction) -> bool:
        "Return if the other is the exact reverse of this drection"
        "Used by the engine to reject 180 degrees turns - a snake cannot reverse into itself"
        "For example, if the snake is moving UP, it cannot move DOWN in the next step, it can only turn LEFT or RIGHT"
        ""
        ">>Direction.UP.is_opposite(Direction.DOWN)"
        ">True"
        ">Direction.UP.is_opposite(Direction.LEFT)"
        ">False"
        ""
        return self.value.x == -other.value.x and self.value.y == -other.value.y
    

# Game status
class GameStatus(Enum):
    "The lifecycle states the game engine can be in, used to control the game loop and display appropriate messages to the player"
    "RUNNING: The game is in progress, the snake is moving and the player can control it"
    "WON: The player has filled the entire board with the snake, the game is over and the player has won"
    "LOST: The player has lost the game, the snake has collided with itself or the walls"

    RUNNING = 1 # Normal playing state, the snake is moving and the player can control it
    WON = 2 # snake has filled the entire board, the player has won
    LOST = 3 # collision with itself or the walls, the player has lost