const playerImage = new Image();
playerImage.src = 'ressources/images/player/devil_duck_clean_spritesheet.png';

//constante for gravity
const gravity = 0.5;

//constante for ground
const GROUND_Y = canvas.height * 0.93;

const player = {
    x: 50,
    y: GROUND_Y - 64, // start on the ground
    attack: 25,
    width: 80,
    height: 64,
    health: 100,
    frameX: 0,
    frameY: 0,
    frameTimer: 0,
    facingLeft: false,
    invincibleUntil: 0,
    score: 0,
    velocityY: 0, //actual vertical speed
    onGround: false,
    distance: 0 
};

function restartPlayer() {
    player.x = 50;
    player.y = GROUND_Y - 64;
    player.health = 100;
    player.frameX = 0;
    player.frameY = 0;
    player.frameTimer = 0;
    player.facingLeft = false;
    player.invincibleUntil = 0;
    scoreSaver();
    player.score = 0;
    player.distance = 0;
}

function scoreSaver() {
    let bestScore = localStorage.getItem("bestScore");
    if (bestScore === null)
    {
        localStorage.setItem("bestScore", player.score);
        return;
    }
    bestScore = parseInt(bestScore);
    if (player.score > bestScore) {
        localStorage.setItem("bestScore", player.score);
    }
    localStorage.setItem("lastScore", player.score);
}

