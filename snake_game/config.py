# Central configuration

# Number of columns in the board
board_width: int = 20 

# Number of rows in the board
board_height: int = 15

# Snake starts near the center of the board facing right
initial_snake_length: int = 1

# Starting head possition(column, row) - middle of the board
initial_head_x: int = board_width // 2
initial_head_y: int = board_height // 2

# Symbols used 
head_symbol: str = 'O'  # snake head
body_symbol: str = 'o'  # snake body
food_symbol: str = '*'  # food
empty_symbol: str = '.'  # empty space
wall_h_symbol: str = '-'  # horizontal wall
wall_v_symbol: str = '|'  # vertical wall
corner_symbol: str = '+'  # wall corners

# SCORING
points_per_food: int = 10  # points for eating food

# Game limits
max_cells: int = board_width * board_height  # game is won when all cells on the board are filled



