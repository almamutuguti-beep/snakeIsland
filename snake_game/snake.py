class snake:
    def __init__(self, start_pos, cell_size=20):
        self.body = [start_pos]
        self.cell_size = cell_size
        self.direction = (1,0) # intial direction is right
        self.grow_pending = False

        def change_direction(self, new_direction):
            if (new_direction[0] * -1, new_direction[1] * -1) != self.direction:
                self.direction = new_direction 
                
                def move(self):
                    head_x, head_y = self.body[0]
                    new_head = (head_x + self.direction[0] * self.cell_size, head_y + self.direction[1] * self.cell_size)
                    self.body.insert(0, new_head)
                    if not self.grow_pending:
                        self.body.pop()
                    else:
                        self.grow_pending = False

                        def grow(self):
                            self.grow_pending = True

                            def get_head_position(self):
                                return self.body[0]
                            
                            def get_body_positions(self):
                                return self.body
                            
                            def check_collision(self, position):
                                return position in self.body
                            
                            def check_self_collision(self):
                                head_position = self.get_head_position()
                                return head_position in self.body[1:]
                            
                            def reset(self, start_pos):
                                self.body = [start_pos]
                                self.direction =  (1,0) # reset direction to right

                                def get_direction(self):
                                    return self.direction
                            
                            def set_direction(self, new_direction):
                                self.direction = new_direction

                                def get_cell_size(self):
                                    return self.cell_size