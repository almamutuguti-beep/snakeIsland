from snake_game import config
from snake_game.snake import Snake
from snake_game.food import Food
from snake_game.models import Point, Direction, GameStatus
from snake_game.state import GameState


class GameEngine:
    def __init__(self, board_width: int = None, board_height: int = None):
        # Per-instance board size, defaulting to config values -- this is what
        # lets each connected player pick a level (board size) independently,
        # since multiple GameEngine instances can now differ from each other.
        self.board_width = board_width or config.board_width
        self.board_height = board_height or config.board_height

        start_pos = Point(self.board_width // 2, self.board_height // 2)
        self.snake = Snake(start_pos)
        self.food = Food(self.board_width, self.board_height)
        self.score = 0
        self.status = GameStatus.RUNNING
        self.food.spawn(self.snake.get_body_positions())

    def reset(self) -> None:
        start_pos = Point(self.board_width // 2, self.board_height // 2)
        self.snake.reset(start_pos)
        self.score = 0
        self.status = GameStatus.RUNNING
        self.food.spawn(self.snake.get_body_positions())

    def change_direction(self, new_direction: Direction) -> None:
        self.snake.change_direction(new_direction)

    def _check_wall_collision(self, head: Point) -> bool:
        if head.x < 0 or head.x >= self.board_width:
            return True
        if head.y < 0 or head.y >= self.board_height:
            return True
        return False

    def update(self) -> None:
        if self.status != GameStatus.RUNNING:
            return

        self.snake.move()
        head = self.snake.get_head_position()

        if self._check_wall_collision(head):
            self.status = GameStatus.LOST
            return
        if self.snake.check_self_collision():
            self.status = GameStatus.LOST
            return

        if head == self.food.position:
            self.snake.grow()
            self.score += config.points_per_food
            if len(self.snake.get_body_positions()) >= self.board_width * self.board_height:
                self.status = GameStatus.WON
            else:
                self.food.spawn(self.snake.get_body_positions())

    def get_state(self) -> GameState:
        """Build an immutable snapshot -- this is what you'll serialize to JSON for the frontend."""
        return GameState.create(
            snake_body=tuple(self.snake.get_body_positions()),
            snake_direction=self.snake.get_direction(),
            food_position=self.food.position,
            score=self.score,
            status=self.status,
            board_width=self.board_width,
            board_height=self.board_height,
        )