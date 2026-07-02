from __future__ import annotations
from dataclasses import dataclass
from typing import FrozenSet, Tuple
from snake_game.models import Point, Direction, GameStatus

@dataclass(frozen=True)
class GameState:
    """
    An immutable snapshot of the entire game at a single point in time.

    frozen=True makes every field read-only after construction,so neither  the renderer nor any future UI can accidentally mutate live game data.
    The engine (engine.py) produces a brand-new GameState each turn rather than modifying this one.
    """
    snake_body: Tuple[Point, ...]
    snake_direction: Direction
    food_position: Point
    score: int
    status : GameStatus
    board_width: int
    board_height: int
    occupied_cells : FrozenSet[Point]

    @staticmethod
    def create(
        snake_body: Tuple[Point, ...],
        snake_direction: Direction,
        food_position: Point,
        score: int,
        status: GameStatus,
        board_width: int,
        board_height: int,
    )->GameState:
        """
         Preferred way to build a GameState.
        Callers supply every field except occupied_cells; this factory derives that set from snake_body automatically, keeping the two values guaranteed to be constistent.
        """
        occupied: FrozenSet[Point] = frozenset(snake_body)
        return GameState(
            snake_body=snake_body,
            snake_direction=snake_direction,
            food_position=food_position,
            score=score,
            status=status,
            board_width=board_width,
            board_height=board_height,
            occupied_cells=occupied,
        )
    @property
    def head(self) -> Point:
        """The position of the snake's head cell (index 0 of snake_body)."""
        return self.snake_body[0]

    @property
    def tail(self) -> Point:
        """The snake's tail cell (last index of snake_body)."""
        return self.snake_body[-1]    
        
    @property
    def snake_length(self) -> int:
        """Number of cells the snake currently occupies."""
        return len(self.snake_body)
 
    @property
    def is_running(self) -> bool:
        """True while the game is still in progress."""
        return self.status == GameStatus.RUNNING

    @property
    def is_over(self) -> bool:
        """True when the game has ended (won or lost). """
        return self.status in (GameStatus.WON, GameStatus.LOST)

    def is_cell_free(self, point: Point) -> bool:
        """Return True if point is inside the board and not occupied by the snake."""
        in_bounds = (0 <= point.x < self.board_width and 0 <= point.y < self.board_height)
        return in_bounds and point not in self.occupied_cells

    def __repr__(self) -> str:
        return(
            f"GameState("
            f"status={self.status.name},"
            f"score={self.score},"
            f"length={self.snake_length},"
            f"head={self.head},"
            f"direction={self.snake_direction.name},"
            f"food={self.food_position}"
            f")"
        )
