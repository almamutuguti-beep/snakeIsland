# This is an entry point to the snakeIsland console application. It is responsible for initializing the game and starting the main game loop.

# Run - python main.py

# Controls 
# W- Move Up
# A - Move Left
# S - Move Down
# D - Move Right
# Enter - Confirm Selection/advance one steep in the current direction
# Q - Quit the game

import sys

def main() -> None:
    """
    Bootstrap the snakeIsland console application. This function initializes the game and starts the main game loop, where user input is continuously processed until the user decides to quit the game.
    """
 
    try:
        from snake_game.cli import run_game
    except ModuleNotFoundError as e:
        print(f"[SnakeIsland] Cannot import game modules: {e} \n"
              "Make sure you are running from the project root directory: python main.py"
              file=sys.stderr, 
              ),
        
        sys.exit(1)


# WELCOME BANNER
print("\n" + "="* 42)
print("Welcome to Snake Island! - console edition")
print("="* 42)
print("Controls: W - Up | A - Left | S - Down | D - Right | Enter - Confirm | Q - Quit")
print("="* 42 + "\n")
