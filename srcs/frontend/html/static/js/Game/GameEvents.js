import { GameProcessor } from "./GameProcessor.js";
import { bPaddle, rPaddle, ball } from "./GameEngine.js";
import { TICK_RATE } from "./GameConnection.js";
import { ballPhysics } from "./GamePhysics.js";


export const events = {
    ball_hit_top_bottom: 0,
    ball_hit_edges: 0,
    ball_hit_paddle: 0,
    ball_hit_score_zone: 0,
    paddle_move_up: 0,
    paddle_move_down: 0
}


function OnBallHitWall() {
    if (events.ball_hit_top_bottom) {
        console.log("ball hit top/bottom");
        events.ball_hit_top_bottom = 0;
    }
}

function OnBallHitPaddle() {
    if (events.ball_hit_paddle) {
        console.log("ball hit red paddle");
        events.ball_hit_paddle = 0;
    }

    return false;
}

function OnBallHitScoreZone() {
    if (events.ball_hit_score_zone) {
        console.log("ball hit score zone");
        events.ball_hit_score_zone = 0;
    }
}

function OnPaddleMove() {
    if (events.paddle_move_up || events.paddle_move_down) {
        const move = events.paddle_move_up ? 'up' : 'down';
        GameProcessor.gameRequestAction('move', {direction: move});
        events.paddle_move_up = 0;
        events.paddle_move_down = 0;
    }
}

function OnBallMove(ball) {
    // ballPhysics(ball, rPaddle, bPaddle);
    ball.posX += ball.xspeed;
    ball.posY += ball.yspeed;
    ball.drawPosX += ball.xspeed;
    ball.drawPosY += ball.yspeed;
}

export function OnGameChange() {
    setInterval(() => {
        // OnBallMove(ball);
        OnBallHitWall(ball);
        OnBallHitPaddle(ball, rPaddle);
        OnBallHitPaddle(ball, bPaddle);
        OnBallHitScoreZone();
        OnPaddleMove();
    }, TICK_RATE);

}