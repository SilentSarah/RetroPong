from typing import TYPE_CHECKING
from time import sleep
import random
from datetime import datetime

if TYPE_CHECKING:
    from .Game import Game


BALL_SPEED = 14
PADDLE_SPEED = 17
PADDLE_BOOST = 1.25
SPECIAL_ABILITY_DURATION = 7
BALL_LIMIT = 25
VIRTUAL_WIDTH = 1920
VIRTUAL_HEIGHT = 1080

class SpecialAbilities:
    def __init__(self) -> None:
        self.railshot = 1
        self.guard = 1
        self.speedup = 1
        self.railshot_active = False
        self.guard_active = False
        self.speedup_active = False
        self.speedup_timer = 0
        self.guard_timer = 0
        
    def activate_railshot(self):
        if self.railshot == 0: return False
        self.railshot_active = True
        self.railshot = 0
        return True
    
    def activate_guard(self):
        if self.guard == 0: return False
        self.guard_active = True
        self.guard = 0
        self.guard_timer = datetime.now().timestamp()
        return True
        
    def activate_speedup(self):
        if self.speedup == 0: return False
        self.speedup_active = True
        self.speedup = 0
        self.speedup_timer = datetime.now().timestamp()
        return True
        
    def deactivate_railshot(self):
        self.railshot_active = False
        
    def deactivate_guard(self):
        self.guard_active = False
        self.guard_timer = 0
        
    def deactivate_speedup(self):
        self.speedup_active = False
        self.speedup_timer = 0
        
    def reset_data(self):
        self.railshot = 1
        self.guard = 1
        self.speedup = 1
        self.speedup_timer = 0
        self.guard_timer = 0
        self.deactivate_railshot()
        self.deactivate_guard()
        self.deactivate_speedup()
        
    def check_special_ability(self, ability):
        if ability == "railshot":
            return self.railshot_active
        elif ability == "guard":
            return self.guard_active
        elif ability == "speedup":
            return self.speedup_active
        return False
    
    def activate_special_ability(self, ability):
        if ability == "railshot":
            return self.activate_railshot()
        elif ability == "guard":
            return self.activate_guard()
        elif ability == "speedup":
            return self.activate_speedup()
        return False
    
    def deactivate_special_ability(self, ability):
        if ability == "railshot":
            return self.deactivate_railshot()
        elif ability == "guard":
            return self.deactivate_guard()
        elif ability == "speedup":
            return self.deactivate_speedup()
        return False
    
    def railshot_physics(self, ball):
        ball.xspeed *= 1.75
        ball.yspeed *= 1.75
        self.deactivate_railshot()


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
        self.special_abilities = SpecialAbilities()
        
    def reset_data(self):
        self.y = VIRTUAL_HEIGHT / 2
        self.special_abilities
        self.special_abilities.reset_data()
        
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
        self.state = "running"
        self.screen_width = VIRTUAL_WIDTH
        self.screen_height = VIRTUAL_HEIGHT
        self.ball = BallPosition(self.screen_width / 2 , self.screen_height / 2, 0.015 * self.screen_height)
        self.paddle_1 = PaddlePosition(game.player1, 20, self.screen_height / 2, (self.screen_height * 0.155), (self.screen_width * 0.0275))
        self.paddle_2 = PaddlePosition(game.player2, self.screen_width - 23, self.screen_height / 2, (self.screen_height * 0.155), (self.screen_width * 0.0275))
        
    async def set_state(self, state):
        self.state = state
        
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
        if (self.game.player1_score >= 7 or self.game.player2_score >= 7):
            self.game.status = "finished"
            self.state = "finished"
            await GameService.end_game(self.game)
            return 
        await GameService.update_score(self.game)
        self.reset_game_data()
        
    async def check_collision(self):
        if self.ball.y - self.ball.radius <= 0 or self.ball.y + self.ball.radius >= self.screen_height:
            self.ball.yspeed *= -1
        if self.ball.x <= 0 or self.ball.x + self.ball.diameter >= self.screen_width:
            if ((self.paddle_1.special_abilities.check_special_ability("guard") and self.ball.x <= 0) or (self.ball.x + self.ball.diameter >= self.screen_width and self.paddle_2.special_abilities.check_special_ability("guard"))):
                self.ball.xspeed *= -1
            else:
                # self.ball.xspeed *= -1
                await self.set_score_for_player()
                self.state = "score"
        
        ball_left = self.ball.x - self.ball.radius
        ball_right = self.ball.x + self.ball.radius
        ball_top = self.ball.y - self.ball.radius
        ball_bottom = self.ball.y + self.ball.radius
    
        # Paddle 1 Collision Detection
        if (self.check_if_point_is_inside_area(ball_left, self.ball.y, self.paddle_1.x - self.paddle_1.width / 2, self.paddle_1.y - self.paddle_1.height / 2, self.paddle_1.x + self.paddle_1.width / 2, self.paddle_1.y + self.paddle_1.height / 2)
            or self.check_if_point_is_inside_area(self.ball.x, ball_top, self.paddle_1.x - self.paddle_1.width / 2, self.paddle_1.y - self.paddle_1.height / 2, self.paddle_1.x + self.paddle_1.width / 2, self.paddle_1.y + self.paddle_1.height / 2)):
            
            if (self.check_if_point_is_inside_area(ball_left, self.ball.y, self.paddle_1.x - self.paddle_1.width / 2, self.paddle_1.y - self.paddle_1.height / 2, self.paddle_1.x + self.paddle_1.width / 2, self.paddle_1.y + self.paddle_1.height / 2)):
                self.ball.xspeed = abs(self.ball.xspeed)
                self.increase_ball_speed()
                if (self.paddle_1.special_abilities.check_special_ability("railshot")):
                    self.paddle_1.special_abilities.railshot_physics(self.ball)

            if (self.check_if_point_is_inside_area(self.ball.x, ball_top, self.paddle_1.x - self.paddle_1.width / 2, self.paddle_1.y - self.paddle_1.height / 2, self.paddle_1.x + self.paddle_1.width / 2, self.paddle_1.y + self.paddle_1.height / 2)):
                self.ball.yspeed = abs(self.ball.yspeed)
                self.increase_ball_speed()
                if (self.paddle_1.special_abilities.check_special_ability("railshot")):
                    self.paddle_1.special_abilities.railshot_physics(self.ball)
                    
        elif (self.check_if_point_is_inside_area(ball_left, ball_top, self.paddle_1.x - self.paddle_1.width / 2, self.paddle_1.y - self.paddle_1.height / 2, self.paddle_1.x + self.paddle_1.width / 2, self.paddle_1.y + self.paddle_1.height / 2)):
            self.ball.xspeed = abs(self.ball.xspeed)
            self.ball.yspeed = abs(self.ball.yspeed)
            self.increase_ball_speed()
            if (self.paddle_1.special_abilities.check_special_ability("railshot")):
                self.paddle_1.special_abilities.railshot_physics(self.ball)

        # Paddle 2 Collision Detection
        if (self.check_if_point_is_inside_area(ball_right, self.ball.y, self.paddle_2.x - self.paddle_2.width / 2, self.paddle_2.y - self.paddle_2.height / 2, self.paddle_2.x + self.paddle_2.width / 2, self.paddle_2.y + self.paddle_2.height / 2)
            or self.check_if_point_is_inside_area(self.ball.x, ball_bottom, self.paddle_2.x - self.paddle_2.width / 2, self.paddle_2.y - self.paddle_2.height / 2, self.paddle_2.x + self.paddle_2.width / 2, self.paddle_2.y + self.paddle_2.height / 2)):
            
            if (self.check_if_point_is_inside_area(ball_right, self.ball.y, self.paddle_2.x - self.paddle_2.width / 2, self.paddle_2.y - self.paddle_2.height / 2, self.paddle_2.x + self.paddle_2.width / 2, self.paddle_2.y + self.paddle_2.height / 2)):
                self.ball.xspeed = -abs(self.ball.xspeed)
                self.increase_ball_speed()
                if (self.paddle_2.special_abilities.check_special_ability("railshot")):
                    self.paddle_2.special_abilities.railshot_physics(self.ball)

            if (self.check_if_point_is_inside_area(self.ball.x, ball_bottom, self.paddle_2.x - self.paddle_2.width / 2, self.paddle_2.y - self.paddle_2.height / 2, self.paddle_2.x + self.paddle_2.width / 2, self.paddle_2.y + self.paddle_2.height / 2)):
                self.ball.yspeed = -abs(self.ball.yspeed)
                self.increase_ball_speed()
                if (self.paddle_2.special_abilities.check_special_ability("railshot")):
                    self.paddle_2.special_abilities.railshot_physics(self.ball)
                    
        elif (self.check_if_point_is_inside_area(ball_right, ball_top, self.paddle_2.x - self.paddle_2.width / 2, self.paddle_2.y - self.paddle_2.height / 2, self.paddle_2.x + self.paddle_2.width / 2, self.paddle_2.y + self.paddle_2.height / 2)):
            self.ball.xspeed = -abs(self.ball.xspeed)
            self.ball.yspeed = abs(self.ball.yspeed)
            self.increase_ball_speed()
            if (self.paddle_2.special_abilities.check_special_ability("railshot")):
                self.paddle_2.special_abilities.railshot_physics(self.ball)
                

        
            
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
        if (player == self.paddle_1.owner and self.paddle_1.ready == False) or (player == self.paddle_2.owner and self.paddle_2.ready == False):
            print("Player not ready")
            return
        if player == self.paddle_1.owner:
            if direction == "up":
                if (self.paddle_1.y - self.paddle_1.height / 2 > 0):
                    self.paddle_1.y -= self.paddle_1.yspeed
            elif direction == "down":
                if (self.paddle_1.y + self.paddle_1.height / 2 < self.screen_height):
                    self.paddle_1.y += self.paddle_1.yspeed
        elif player == self.paddle_2.owner:
            if direction == "up":
                if (self.paddle_2.y - self.paddle_2.height / 2 > 0):
                    self.paddle_2.y -= self.paddle_2.yspeed
            elif direction == "down":
                if (self.paddle_2.y + self.paddle_2.height / 2 < self.screen_height):
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
    
    def check_active_abilities(self):
        if (self.paddle_1.special_abilities.check_special_ability("speedup")):
            time_between = datetime.now().timestamp() - self.paddle_1.special_abilities.speedup_timer
            if time_between >= SPECIAL_ABILITY_DURATION:
                self.paddle_1.special_abilities.deactivate_speedup()
                self.paddle_1.yspeed = PADDLE_SPEED
            else:
                self.paddle_1.yspeed = PADDLE_SPEED * PADDLE_BOOST

        if (self.paddle_1.special_abilities.check_special_ability("guard")):
            time_between = datetime.now().timestamp() - self.paddle_1.special_abilities.guard_timer
            if time_between >= SPECIAL_ABILITY_DURATION:
                self.paddle_1.special_abilities.deactivate_guard()
                
        if (self.paddle_2.special_abilities.check_special_ability("speedup")):
            time_between = datetime.now().timestamp() - self.paddle_2.special_abilities.speedup_timer
            if time_between >= SPECIAL_ABILITY_DURATION:
                self.paddle_2.special_abilities.deactivate_speedup()
                self.paddle_2.yspeed = PADDLE_SPEED
            else:
                self.paddle_2.yspeed = PADDLE_SPEED * PADDLE_BOOST
                
        if (self.paddle_2.special_abilities.check_special_ability("guard")):
            time_between = datetime.now().timestamp() - self.paddle_2.special_abilities.guard_timer
            if time_between >= SPECIAL_ABILITY_DURATION:
                self.paddle_2.special_abilities.deactivate_guard()