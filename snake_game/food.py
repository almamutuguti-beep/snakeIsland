from snake_game.models import Point 
import random


class Food:
    def __init__(self, grid_width: int, grid_height: int, cell_size: int=20):
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.position = None
        self.cell_size = cell_size
    
    def spawn(self,snake_body):
        free_cells = [
            Point(x,y) for x in range(self.grid_width) for y in range(self.grid_height) if Point(x,y) not in snake_body
        ]
        if free_cells:
            self.position = random.choice(free_cells)
            return self.position
        
    def get_position(self):
        return self.position
    
    def generate_random_position(self):
        x = random.randint(0, self.grid_width -1)
        y = random.randint(0, self.grid_height -1)
        return Point(x,y)
    
    def set_position(self, new_position: Point):
        self.position = new_position

    def get_cell_size(self):
        return self.cell_size
    
    def set_cell_size(self, new_cell_size):
        self.cell_size = new_cell_size

    def get_grid_dimensions(self):
        return self.grid_width, self.grid_height
    
    def set_grid_dimensions(self, new_width, new_height):
        self.grid_width = new_width
        self.grid_height = new_height

        


