from typing import TYPE_CHECKING
from time import sleep
import random

if TYPE_CHECKING:
    from .Game import Game


BALL_SPEED = 15
PADDLE_SPEED = 15   
BALL_LIMIT = 25
VIRTUAL_WIDTH = 1920
VIRTUAL_HEIGHT = 1080

class PaddlePosition:
    def __init__(self, owner, x, y, paddle_height, paddle_width):
        self.owner = owner
        self.y = y
        self.x = x
        self.width = paddle_width
        self.height = paddle_height
        self.radius = paddle_height / 2
        self.yspeed = PADDLE_SPEED
        self.ready = False
        
    def reset_data(self):
        self.y = VIRTUAL_HEIGHT / 2
        
class BallPosition:
    def __init__(self, x, y, radius):
        self.x = x
        self.y = y
        self.radius = radius
        self.diameter = self.radius * 2
        self.xspeed = BALL_SPEED
        self.yspeed = BALL_SPEED
        
    def reset_data(self):
        self.x = VIRTUAL_WIDTH / 2
        self.y = VIRTUAL_HEIGHT / 2
        self.generate_random_angle()
    
    def generate_random_angle(self):
        speeds = [BALL_SPEED, -BALL_SPEED]
        self.xspeed = speeds[random.randint(0, 1)]
        self.yspeed = speeds[random.randint(0, 1)]
        

class GamePhysics:
    def __init__(self, game):
        self.game: Game = game
        self.screen_width = VIRTUAL_WIDTH
        self.screen_height = VIRTUAL_HEIGHT
        self.ball = BallPosition(self.screen_width / 2, self.screen_height / 2, 0.015 * self.screen_height)
        self.paddle_1 = PaddlePosition(game.player1, 20, self.screen_height / 2, (self.screen_height * 0.150), (self.screen_width * 0.025))
        self.paddle_2 = PaddlePosition(game.player2, self.screen_width - 23, self.screen_height / 2, (self.screen_height * 0.150), (self.screen_width * 0.025))
        self.state = "running"
        
    async def calculate_ball_physics(self):
        self.ball.x += self.ball.xspeed
        self.ball.y += self.ball.yspeed
        await self.check_collision()
        
    def reset_game_data(self):
        self.ball.reset_data()
        self.paddle_1.reset_data()
        self.paddle_2.reset_data()
        
    async def set_score_for_player(self):
        from .Game import GameService
        scorer = None
        if (self.ball.x <= 0):
            scorer = self.paddle_2.owner
            self.game.player2_score += 1
        elif (self.ball.x + self.ball.diameter >= self.screen_width):
            scorer = self.paddle_1.owner
            self.game.player1_score += 1
        self.game.latest_scorer = scorer.id
        await GameService.update_score(self.game)
        self.reset_game_data()
        
    async def check_collision(self):
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= self.screen_height:
            self.ball.yspeed *= -1
        if self.ball.x <= 0 or self.ball.x + self.ball.diameter >= self.screen_width:
            await self.set_score_for_player()
            self.state = "score"
            return
        
        if self.ball.x - self.ball.radius <= self.paddle_1.x + self.paddle_1.width / 2 and self.ball.y >= self.paddle_1.y - self.paddle_1.height / 2 and self.ball.y <= self.paddle_1.y + self.paddle_1.height / 2:
            self.ball.xspeed *= -1
            self.ball.yspeed *= -1  
            self.increase_ball_speed()
        if self.ball.x + self.ball.radius >= self.paddle_2.x - self.paddle_2.width / 2 and self.ball.y >= self.paddle_2.y - self.paddle_2.height / 2 and self.ball.y <= self.paddle_2.y + self.paddle_2.height / 2:
            self.ball.xspeed *= -1
            self.ball.yspeed *= -1
            self.increase_ball_speed()
            
        if self.ball.y - self.ball.radius <= self.paddle_1.y + self.paddle_1.height / 2 and self.ball.y + self.ball.radius >= self.paddle_1.y - self.paddle_1.height / 2 and self.ball.x - self.ball.radius <= self.paddle_1.x + self.paddle_1.width / 2:
            self.ball.yspeed *= -1
            self.increase_ball_speed()
        if self.ball.y - self.ball.radius <= self.paddle_2.y + self.paddle_2.height / 2 and self.ball.y + self.ball.radius >= self.paddle_2.y - self.paddle_2.height / 2 and self.ball.x + self.ball.radius >= self.paddle_2.x - self.paddle_2.width / 2:
            self.ball.yspeed *= -1
            self.increase_ball_speed()
            
        if (self.check_if_point_is_inside_area(self.ball.x, self.ball.y, self.paddle_1.x - self.paddle_1.width / 2, self.paddle_1.y - self.paddle_1.height / 2, self.paddle_1.x + self.paddle_1.width / 2, self.paddle_1.y + self.paddle_1.height / 2)):
            self.ball.xspeed *= -1
            self.increase_ball_speed()
        if (self.check_if_point_is_inside_area(self.ball.x, self.ball.y, self.paddle_2.x - self.paddle_2.width / 2, self.paddle_2.y - self.paddle_2.height / 2, self.paddle_2.x + self.paddle_2.width / 2, self.paddle_2.y + self.paddle_2.height / 2)):
            self.ball.xspeed *= -1
            self.increase_ball_speed()

        
            
    def generate_ball_data(self):
        return {
            'x': self.ball.x / self.screen_width,
            'y': self.ball.y / self.screen_height,
            'width': self.ball.diameter,
            'height': self.ball.diameter
        }
        
    def generate_paddle_data(self, player):
        paddle = self.paddle_1 if player == self.paddle_1.owner else self.paddle_2
        return {
            'x': paddle.x / self.screen_width,
            'y': paddle.y / self.screen_height,
            'width': paddle.width / self.screen_width,
            'height': paddle.height / self.screen_height
        }
        
    def move_paddle(self, player, direction):
        if player == self.paddle_1.owner:
            if direction == "up":
                self.paddle_1.y -= self.paddle_1.yspeed
            elif direction == "down":
                self.paddle_1.y += self.paddle_1.yspeed
        elif player == self.paddle_2.owner:
            if direction == "up":
                self.paddle_2.y -= self.paddle_2.yspeed
            elif direction == "down":
                self.paddle_2.y += self.paddle_2.yspeed
        self.check_paddle_bounds()
        
    def check_paddle_bounds(self):
        if self.paddle_1.y < 0:
            self.paddle_1.y = self.paddle_1.height / 2
        elif self.paddle_1.y + self.paddle_1.height / 2 > self.screen_height:
            self.paddle_1.y = self.screen_height - self.paddle_1.height / 2
        if self.paddle_2.y < 0:
            self.paddle_2.y = 0
        elif self.paddle_2.y + self.paddle_2.height / 2 > self.screen_height:
            self.paddle_2.y = self.screen_height - self.paddle_2.height / 2
            
    def increase_ball_speed(self):
        self.ball.xspeed += 1 if self.ball.xspeed > 0 else -1
        self.ball.yspeed += 1 if self.ball.yspeed > 0 else -1
        if self.ball.xspeed > BALL_LIMIT: self.ball.xspeed = BALL_LIMIT
        if self.ball.yspeed > BALL_LIMIT: self.ball.yspeed = BALL_LIMIT
        if self.ball.xspeed < -BALL_LIMIT: self.ball.xspeed = -BALL_LIMIT
        if self.ball.yspeed < -BALL_LIMIT: self.ball.yspeed = -BALL_LIMIT
        
    def check_if_point_is_inside_area(self, x, y, x1, y1, x2, y2):
        return x >= x1 and x <= x2 and y >= y1 and y <= y2