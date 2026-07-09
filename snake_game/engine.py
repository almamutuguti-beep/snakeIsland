#engine.py
from snake import snake
from food import food
from config import board_width, board_height, points_per_food
from snake_game.models import Direction
from sound import play_eat, play_gameover

class GameEngine:
    def __init__(self, config):
        self.config = config
        self.snake = snake()
        self.food = food()
        self.score = 0
        self.game_over = False 
    
    def reset(self):
        self.snake.reset()
        self.score = 0
        self.game_over = False
        self.food.spawn(self.snake.get_boddy_positions())

    def change_direction(self, new_direction: Direction):
        self.snake.change_direction(new_direction)

    def _check_wall_collision(self,head_x,head_y): 
        if head_x < 0 or head_x >= board_width :
            return True
        if head_y < 0 or head_y >= board_height :
            return True
        return False
    
    def update (self):
        if self.game_over:
            return
        self.snake.move()
        head = self.snake.get_head_position()
        
        if self._check_wall_collision(head[0],head[1]):
            self.game_over = True
            return
        if self.snake.check_self_collision():
            self.game_ovr = True
            return

        if head == self.food.position:
            self.snake.grow()
            self.score += points_per_food
            self.food.spawn(self.snake.get_body_positions())
        
        if head==self.food.get_position():
            play_eat()
            self.snake.grow()
            self.score  += points_per_food
            
            self.game_over = True
            play_gameover()