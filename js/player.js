// Get the player configuration saved from the customization page
const savedPlayer = JSON.parse(localStorage.getItem('duckPlayer') || 'null');

// Redirect to the customization page if the player is not configured correctly
if (
    !savedPlayer ||
    !savedPlayer.pseudo ||
    savedPlayer.pseudo.trim().length < 2 ||
    savedPlayer.pseudo.trim().length > 15 ||
    !['yellow', 'pink', 'green'].includes(savedPlayer.duck)
) {
    window.location.href = 'index.html';
    throw new Error('Player not configured');
}

// Get the selected duck color
const duckColor = savedPlayer.duck;

// Load the correct player spritesheet based on the selected duck
const playerImage = new Image();
playerImage.src = 'ressources/images/player/duck_' + duckColor + '_spritesheet.png';

//constante for gravity
const gravity = 0.5;

//constante for ground
const GROUND_Y = canvas.height * 0.93;

const player = {
    x: 50,
    y: GROUND_Y - 100 +6, // start on the ground
    attack: 25,
    width: 80,
    height: 70,
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
    player.y = GROUND_Y - 100+6;
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

// Persists the run's score to localStorage so it survives page reloads/sessions.
// Called from restartPlayer(), right before player.score is reset to 0.
function scoreSaver() {
    let bestScore = localStorage.getItem("bestScore");
    if (bestScore === null || player.score > parseInt(bestScore)) {
        localStorage.setItem("bestScore", player.score);
    }
    localStorage.setItem("lastScore", player.score);
}

// Adds the current run to the top-10 leaderboard stored as JSON in localStorage.
// Scoped to this browser only (no backend) - called once, at the moment of death.
function updateHallOfFame() {
    if (player.score <= 0) return;
    const hallOfFame = JSON.parse(localStorage.getItem('hallOfFame') || '[]');
    hallOfFame.push({
        pseudo: savedPlayer.pseudo,
        score: player.score,
        distance: Math.floor(player.distance / 60)
    });
    // Higher score wins; ties broken by the longer distance travelled
    hallOfFame.sort((a, b) => b.score - a.score || b.distance - a.distance);
    hallOfFame.length = Math.min(hallOfFame.length, 10);
    localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));
}

