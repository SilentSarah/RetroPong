from typing import TYPE_CHECKING
from math import sqrt

if TYPE_CHECKING:
    from .Game import Game


BALL_SPEED = 10
PADDLE_SPEED = 17
BALL_LIMIT = 17

class PaddlePosition:
    def __init__(self, owner, x, y, paddle_height, paddle_width):
        self.owner = owner
        self.y = y
        self.x = x
        self.width = paddle_width
        self.height = paddle_height
        self.radius = paddle_height / 2
        self.yspeed = PADDLE_SPEED
        
class BallPosition:
    def __init__(self, x, y, radius):
        self.x = x
        self.y = y
        self.radius = radius
        self.diameter = self.radius * 2
        self.xspeed = BALL_SPEED
        self.yspeed = BALL_SPEED

class GamePhysics:
    def __init__(self, game):
        self.game: Game = game
        self.screen_width = 1920
        self.screen_height = 1080
        self.ball = BallPosition(self.screen_width / 2, self.screen_height / 2, 0.015 * self.screen_height)
        self.paddle_1 = PaddlePosition(game.player1, 75, self.screen_height / 2, (self.screen_height * 0.150), (self.screen_width * 0.030))
        self.paddle_2 = PaddlePosition(game.player2, self.screen_width - 75, self.screen_height / 2, (self.screen_height * 0.150), (self.screen_width * 0.030))
        
    def calculate_ball_physics(self):
        self.ball.x += self.ball.xspeed
        self.ball.y += self.ball.yspeed
        self.check_collision()
        
    def check_collision(self):
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= self.screen_height:
            self.ball.yspeed *= -1
        if self.ball.x <= 0 or self.ball.x + self.ball.diameter >= self.screen_width:
            self.ball.xspeed *= -1

        # Handle collision with paddles using balls diameter and radius
        if self.ball.x - self.ball.radius <= self.paddle_1.x + self.paddle_1.width / 2 and self.ball.y >= self.paddle_1.y - self.paddle_1.height / 2 and self.ball.y <= self.paddle_1.y + self.paddle_1.height / 2:
            self.ball.xspeed *= -1
        if self.ball.x + self.ball.radius >= self.paddle_2.x - self.paddle_2.width / 2 and self.ball.y >= self.paddle_2.y - self.paddle_2.height / 2 and self.ball.y <= self.paddle_2.y + self.paddle_2.height / 2:
            self.ball.xspeed *= -1
            
        # Handle Top and Bottom of paddles collision
        if self.ball.y - self.ball.radius <= self.paddle_1.y + self.paddle_1.height / 2 and self.ball.y + self.ball.radius >= self.paddle_1.y - self.paddle_1.height / 2 and self.ball.x - self.ball.radius <= self.paddle_1.x + self.paddle_1.width / 2:
            self.ball.yspeed *= -1
        elif self.ball.y - self.ball.radius <= self.paddle_2.y + self.paddle_2.height / 2 and self.ball.y + self.ball.radius >= self.paddle_2.y - self.paddle_2.height / 2 and self.ball.x + self.ball.radius >= self.paddle_2.x - self.paddle_2.width / 2:
            self.ball.yspeed *= -1

            
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
        print(f"left paddle posY: {self.paddle_1.y}", f"left paddle posY: {self.paddle_1.height}")
            
    def calculate_distance(self, x1, y1, x2, y2):
        return sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)