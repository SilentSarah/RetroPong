import { BALL_SPEED, BALL_SPPED_INCREASE, BALL_SPEED_LIMIT, sounds, playSound } from "./GameEngine.js";
import { processLocalScore } from "./GameEngine.js";
import { ball, rPaddle, bPaddle } from "./GameEngine.js";
import { events } from "./GameEvents.js";

const RAILSHOT_BOOST = 2

export function resetInGamePhysics(rPaddle, bPaddle, ball) {
    if (!ball || !rPaddle || !bPaddle) return;
    ball.drawPosX = ball.cWidth / 2;
    ball.drawPosY = ball.cHeight / 2;
    ball.posX = ball.cWidth / 2;
    ball.posY = ball.cHeight / 2;

    rPaddle.drawPosY = (rPaddle.cHeight / 2) - (rPaddle.pHeight / 2);
    rPaddle.drawPosX = rPaddle.push_value;
    rPaddle.posY = rPaddle.drawPosY + rPaddle.pHeight / 2;
    rPaddle.posX = rPaddle.push_value;

    bPaddle.drawPosY = (bPaddle.cHeight / 2) - (bPaddle.pHeight / 2);
    bPaddle.drawPosX = bPaddle.cWidth - (bPaddle.push_value + bPaddle.pWidth);
    bPaddle.posY = bPaddle.drawPosY + bPaddle.pHeight / 2;
    bPaddle.posX = bPaddle.cWidth - (bPaddle.push_value + (bPaddle.pWidth / 2));

    ball.xspeed = BALL_SPEED;
    ball.yspeed = BALL_SPEED;
}

export function increaseBallSpeed(ball) {
    ball.xspeed > 0 ? ball.xspeed += BALL_SPPED_INCREASE : ball.xspeed -= BALL_SPPED_INCREASE;
    ball.yspeed > 0 ? ball.yspeed += BALL_SPPED_INCREASE : ball.yspeed -= BALL_SPPED_INCREASE;
    ball.yspeed > BALL_SPEED_LIMIT ? ball.yspeed = BALL_SPEED_LIMIT : ball.yspeed;
    ball.yspeed < -BALL_SPEED_LIMIT ? ball.yspeed = -BALL_SPEED_LIMIT : ball.yspeed;
    ball.xspeed > BALL_SPEED_LIMIT ? ball.xspeed = BALL_SPEED_LIMIT : ball.xspeed;
    ball.xspeed < -BALL_SPEED_LIMIT ? ball.xspeed = -BALL_SPEED_LIMIT : ball.xspeed;
}

function collisionDetection(ball, rPaddle_hb, bPaddle_hb, ball_hb) {
    if (ball_hb.x < rPaddle_hb.x + rPaddle_hb.width &&
        ball_hb.x + (ball_hb.width / 2) > rPaddle_hb.x &&
        ball_hb.y < rPaddle_hb.y + rPaddle_hb.height &&
        ball_hb.y + ball_hb.height > rPaddle_hb.y) {
        ball.posX = rPaddle_hb.x + rPaddle_hb.width;
        ball.drawPosX = rPaddle_hb.x + rPaddle_hb.width;
        ball.xspeed = -ball.xspeed;
        events.ball_hit_paddle = 1;
        playSound("ball_hit");
        increaseBallSpeed(ball);
        if (rPaddle.special_abilities.check_special_ability("railshot")) {
            ball.xspeed = ball.xspeed * RAILSHOT_BOOST;
            ball.yspeed = ball.yspeed * RAILSHOT_BOOST;
            rPaddle.special_abilities.disable_special_ability("railshot");
        }
    }
    
    if (ball_hb.x < bPaddle_hb.x + bPaddle_hb.width &&
        ball_hb.x + ball_hb.width > bPaddle_hb.x &&
        ball_hb.y < bPaddle_hb.y + bPaddle_hb.height &&
        ball_hb.y + ball_hb.height > bPaddle_hb.y) {
        ball.posX = bPaddle_hb.x - ball.bWidth;
        ball.drawPosX = bPaddle_hb.x - ball.bWidth;
        ball.xspeed = -ball.xspeed;
        playSound("ball_hit");
        events.ball_hit_paddle = 1;
        increaseBallSpeed(ball);
        if (bPaddle.special_abilities.check_special_ability("railshot")) {
            ball.xspeed = ball.xspeed * RAILSHOT_BOOST;
            ball.yspeed = ball.yspeed * RAILSHOT_BOOST;
            bPaddle.special_abilities.disable_special_ability("railshot");
        }
    }
}

export function ballPhysics(ball, rPaddle, bPaddle) {

    const rPaddle_hb = {
        x: rPaddle.drawPosX,
        y: rPaddle.drawPosY,
        width: rPaddle.pWidth,
        height: rPaddle.pHeight,
    }

    const bPaddle_hb = {
        x: bPaddle.drawPosX,
        y: bPaddle.drawPosY,
        width: bPaddle.pWidth,
        height: bPaddle.pHeight,
    }

    const ball_hb = {
        x: ball.drawPosX,
        y: ball.drawPosY,
        width: ball.bWidth,
        height: ball.bHeight,
    }

    if (ball_hb.x <= 0 || ball_hb.x + ball_hb.width >= ball.cWidth) {
        if (ball_hb.x <= 0) {
            if (rPaddle.special_abilities.check_special_ability("guard")) {
                playSound("ball_hit");
                ball.xspeed = -ball.xspeed;
            }
            else {
                processLocalScore(ball_hb.x);
                resetInGamePhysics(rPaddle, bPaddle, ball);
                events.ball_hit_score_zone = 1;
            }
        } else {
            if (bPaddle.special_abilities.check_special_ability("guard"))
            {
                playSound("ball_hit");
                ball.xspeed = -ball.xspeed;
            }
            else {
                processLocalScore(ball_hb.x);
                resetInGamePhysics(rPaddle, bPaddle, ball);
                events.ball_hit_score_zone = 1;
            }
        }
        
    }
    if (ball_hb.y <= 0 || ball_hb.y + ball_hb.height >= ball.cHeight) {
        events.ball_hit_top_bottom = 1;
        ball.yspeed = -ball.yspeed;
        playSound("ball_hit");
    }

    collisionDetection(ball, rPaddle_hb, bPaddle_hb, ball_hb);

    ball.posX += ball.xspeed;
    ball.posY += ball.yspeed;
    ball.drawPosX += ball.xspeed;
    ball.drawPosY += ball.yspeed;
}

export function generateRandomBallAngle() {
    ball.xspeed = Math.random() >= 0.5 ? -BALL_SPEED : BALL_SPEED;
    ball.yspeed = Math.random() >= 0.5 ? -BALL_SPEED : BALL_SPEED;
}