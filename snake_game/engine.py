#engine.py
from snake import snake
from food import food

class GameEngine:
    def __init__(self, config):
        self.config = config
        self.snake = snake()
        self.food = food()
        self.score = 0
        self.game_over = False
    
