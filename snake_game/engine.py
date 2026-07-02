from snake import Snake
from snake_game import config
from food import Food
from snake_game.models import Direction, Point, GameStatus
from state import GameState




class GameEngine:
    def __init__(self, config):
        start_pos = Point(config.initial_head_x, config.initial_head_y)
        self.config = config
        self.snake = Snake(start_pos)
        self.food = Food(config.board_width, config.board_height)
        self.score = 0
        self.game_over = False
        self.status = GameStatus.RUNNING
        self.food.spawn(self.snake.get_body_positions())

    def reset(self):
        start_pos = Point(self.config.initial_head_x, self.config.initial_head_y)
        self.snake.reset(start_pos)
        self.score = 0
        self.game_over = False
        self.status = GameStatus.RUNNING
        self.food.spawn(self.snake.get_body_positions())
        
    def change_direction(self, new_direction: Direction) -> None:
        self.snake.change_direction(new_direction)

    def _check_wall_collision(self,head: Point) -> bool:
        if head.x < 0 or head.x >= config.board_width :
            return True
        if head.y < 0 or head.y >= config.board_height :
            return True
        return False
    
    def update (self):
        if self.game_over:
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
            if len(self.snake.get_body_positions()) >= config.max_cells:
                self.status = GameStatus.WON
            else:
                self.food.spawn(self.snake.get_body_positions())

    def get_state(self) -> GameState:
        """Build an immutable snapshot -- this what you will serialize to JSON for the front end."""

        return GameState.create(
            snake_body=tuple(self.snake.get_body_positions()),
            snake_direction=self.snake.get_direction(),
            food_position=self.food.position,
            score=self.score,
            status=self.status,
            board_width=config.board_width,
            board_height=config.board_height,
        )
