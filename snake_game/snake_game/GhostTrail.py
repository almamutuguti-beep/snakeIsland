import time

class GhostTrail:
    def __init__(self, fade_duration=2.0, wall_duration=5.0):
        """
        fade_duration - seconds before a ghost cell fully disappears
        wall_duration - seconds a cell stays as a wall after eating food
        """
        self.fade_duration = fade_duration
        self.wall_duration = wall_duration
        self.cells = {}  # Dictionary to store ghost cells with their timestamps

    def add(self, position, is_wall=False):
        duration = self.wall_duration if is_wall else self.fade_duration
        self.cells[position] = {
            "timestamp": time.time(),
            "is_wall": is_wall,
            "duration": duration,
        }

    def update(self):
        """Call once per frame to remove expired cells."""
        now = time.time()
        expired = [pos for pos, data in self.cells.items()
                   if now - data["timestamp"] >= data["duration"]]
        for pos in expired:
            del self.cells[pos]

    def is_wall(self, position):
        data = self.cells.get(position)
        return data is not None and data["is_wall"]

    def get_all_cells(self):
        """Return all ghost cell positions (for rendering)."""
        return list(self.cells.keys())

    def get_alpha(self, position):
        """
        Return opacity 0.0 (invisible) to 1.0 (solid) for rendering a fade effect.
        """
        data = self.cells.get(position)
        if not data:
            return 0.0
        elapsed = time.time() - data["timestamp"]
        return max(0.0, 1.0 - elapsed / data["duration"])
                