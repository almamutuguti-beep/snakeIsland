from snake_game.models import Point, Direction


class Snake:
    def __init__(self, start_pos: Point, cell_size=20):
        self.body = [start_pos]
        self.cell_size = cell_size
        self.direction = Direction.RIGHT # intial direction is right
        self.grow_pending = False

    def change_direction(self, new_direction):
        if (new_direction[0] * -1, new_direction[1] * -1) != self.direction:
            self.direction = new_direction 
                
    def move(self):
        head = self.body[0]
        new_head = head + self.direction.value
        self.body.insert(0, new_head)
        if not self.grow_pending:
            self.body.pop()
        else:
            self.grow_pending = False

    def grow(self):
        self.grow_pending = True

    def get_head_position(self) -> Point:
        return self.body[0]
                        
    def get_body_positions(self):
        return self.body
        
    def check_collision(self, position : Point)-> bool:
        return position in self.body

    def check_self_collision(self) -> bool:
        head_position = self.get_head_position()
        return head_position in self.body[1:]

    def reset(self, start_pos: Point):
        self.body = [start_pos]
        self.direction =  Direction.RIGHT # reset direction to right

    def get_direction(self)-> Direction:
        return self.direction

    def set_direction(self, new_direction):
        self.direction = new_direction

    def get_cell_size(self):
        return self.cell_size

    def set_cell_size(self, new_cell_size):
        self.cell_size = new_cell_size

    def get_length(self):
        return len(self.body)
    
    def set_length(self, new_length):
        if new_length < len(self.body):
            self.body = self.body[:new_length]

    def get_body(self):
        return self.body
    
    def set_body(self, new_body):
        self.body = new_body

    def get_grow_pending(self):
        return self.grow_pending
                                                
    def set_grow_pending(self, new_grow_pending):
        self.grow_pending = new_grow_pending

    def get_head(self):
        return self.body[0]
                                                    
    def set_head(self, new_head):
        self.body[0] = new_head