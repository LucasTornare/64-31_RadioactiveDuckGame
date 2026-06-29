const savedPlayer = JSON.parse(localStorage.getItem('duckPlayer') || 'null');

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

const duckColor = savedPlayer.duck;

const playerImage = new Image();
playerImage.src = 'ressources/images/player/duck_' + duckColor + '_spritesheet.png';

const gravity = 0.6;
const GROUND_Y = canvas.height * 0.93;

const MAX_LIVES = 3;
const MAX_HEALTH = 100;

const player = {
    x: 50,
    y: GROUND_Y - 100 + 6,
    attack: 25,
    width: 80,
    height: 70,
    health: MAX_HEALTH,
    lives: MAX_LIVES,
    frameX: 0,
    frameY: 0,
    frameTimer: 0,
    facingLeft: false,
    invincibleUntil: 0,
    score: 0,
    velocityY: 0,
    onGround: false,
    distance: 0,
    combo: 0,
    comboTimer: 0,
    lastKillTime: 0,
    powerUp: null,
    powerUpTimer: 0,
    damageMultiplier: 1,
    speed: 5,
    screenShake: 0,
    flashTimer: 0,
    flashColor: null,
};

const POWERUP_DURATION = 600;
const POWERUP_CHANCE = 0.4;
const COMBO_WINDOW = 120;

const particles = [];

function spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 2,
            life: 30 + Math.random() * 20,
            maxLife: 50,
            size: 2 + Math.random() * 4,
            color: color,
        });
    }
}

function spawnTextParticle(x, y, text, color) {
    particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 1,
        vy: -2,
        life: 60,
        maxLife: 60,
        size: 0,
        color: color,
        text: text,
    });
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (!p.text) p.vy += 0.1;
        p.life--;
        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {
    for (const p of particles) {
        const alpha = Math.max(0, p.life / p.maxLife);
        if (p.text) {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.font = 'bold 20px ' + gameFont;
            ctx.fillStyle = p.color;
            ctx.textAlign = 'center';
            ctx.shadowColor = '#000';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 1;
            ctx.fillText(p.text, p.x, p.y);
            ctx.restore();
        } else {
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
}

function addKillCombo(x, y) {
    const now = Date.now();
    if (now - player.lastKillTime < 2000) {
        player.combo++;
    } else {
        player.combo = 1;
    }
    player.lastKillTime = now;

    const baseScore = 10;
    const comboBonus = Math.min(player.combo, 10);
    const points = baseScore * comboBonus;
    player.score += points;

    if (player.combo > 1) {
        spawnTextParticle(x, y - 20, player.combo + 'x COMBO! +' + points, '#ffff00');
    } else {
        spawnTextParticle(x, y - 20, '+' + points, '#39ff14');
    }
}

function loseLife() {
    player.lives--;
    player.flashTimer = 30;
    player.flashColor = 'rgba(255,0,0,0.4)';
    player.screenShake = 15;

    if (player.lives > 0) {
        player.health = MAX_HEALTH;
        player.invincibleUntil = Date.now() + 2000;

        if (Math.random() < POWERUP_CHANCE) {
            activatePowerUp();
        }
    }
}

function activatePowerUp() {
    const types = ['invincible', 'doubleDamage'];
    player.powerUp = types[Math.floor(Math.random() * types.length)];
    player.powerUpTimer = POWERUP_DURATION;

    if (player.powerUp === 'invincible') {
        player.invincibleUntil = Date.now() + (POWERUP_DURATION / 60) * 1000;
        spawnTextParticle(player.x, player.y - 40, 'INVINCIBLE!', '#00ffff');
    } else if (player.powerUp === 'doubleDamage') {
        player.damageMultiplier = 2;
        spawnTextParticle(player.x, player.y - 40, 'DAMAGE x2!', '#ff4444');
    }

    player.flashTimer = 20;
    player.flashColor = 'rgba(0,255,255,0.3)';
}

function updatePowerUp() {
    if (player.powerUp) {
        player.powerUpTimer--;
        if (player.powerUpTimer <= 0) {
            if (player.powerUp === 'doubleDamage') {
                player.damageMultiplier = 1;
            }
            player.powerUp = null;
        }
    }
}

function getPlayerDamage() {
    return player.attack * player.damageMultiplier;
}

function restartPlayer() {
    player.x = 50;
    player.y = GROUND_Y - 100 + 6;
    player.health = MAX_HEALTH;
    player.lives = MAX_LIVES;
    player.frameX = 0;
    player.frameY = 0;
    player.frameTimer = 0;
    player.facingLeft = false;
    player.invincibleUntil = 0;
    player.combo = 0;
    player.comboTimer = 0;
    player.lastKillTime = 0;
    player.powerUp = null;
    player.powerUpTimer = 0;
    player.damageMultiplier = 1;
    player.screenShake = 0;
    player.flashTimer = 0;
    scoreSaver();
    player.score = 0;
    player.distance = 0;
    particles.length = 0;
}

function scoreSaver() {
    let bestScore = localStorage.getItem("bestScore");
    if (bestScore === null || player.score > parseInt(bestScore)) {
        localStorage.setItem("bestScore", player.score);
    }
    localStorage.setItem("lastScore", player.score);
}

function updateHallOfFame() {
    if (player.score <= 0) return;
    const hallOfFame = JSON.parse(localStorage.getItem('hallOfFame') || '[]');
    hallOfFame.push({
        pseudo: savedPlayer.pseudo,
        score: player.score,
        distance: Math.floor(player.distance / 60),
        wave: currentWave,
    });
    hallOfFame.sort((a, b) => b.score - a.score || b.distance - a.distance);
    hallOfFame.length = Math.min(hallOfFame.length, 10);
    localStorage.setItem('hallOfFame', JSON.stringify(hallOfFame));
}
