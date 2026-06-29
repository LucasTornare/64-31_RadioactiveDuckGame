const crowImage = new Image();
crowImage.src = 'ressources/images/ennemies/crow.png';

const foxImage = new Image();
foxImage.src = 'ressources/images/ennemies/fox.png';

const ratImage = new Image();
ratImage.src = 'ressources/images/ennemies/rat.png';

const crow = {
    name: "crow",
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    speed: 15,
    x: 300,
    y: 100,
    width: 80,
    height: 64,
    frameX: 0,
    frameY: 0,
    frameTimer: 0,
    speedX: -1,
    shootTimer: 0,
    visible: true,
};

const fox = {
    name: 'fox',
    health: 150,
    maxHealth: 150,
    attack: 15,
    defense: 10,
    x: 600,
    y: GROUND_Y - 207 - 8 - 64,
    width: 80,
    height: 64,
    speedX: -1,
    respawnTimer: 180,
    shootTimer: 0,
    shootInterval: 180,
    visible: true,
};

const rat = {
    name: 'rat',
    health: 50,
    maxHealth: 50,
    attack: 5,
    defense: 2,
    speed: 10,
    x: 300,
    y: GROUND_Y - 64,
    width: 80,
    height: 64,
    frameX: 0,
    frameTimer: 0,
    respawnTimer: 240,
    speedX: -5,
    visible: true,
};

function getDifficultyMultiplier(wave) {
    return 1 + (wave - 1) * 0.15;
}

function getEnemyHealthMultiplier(wave) {
    return 1 + (wave - 1) * 0.1;
}

function spawnEnemies(waveNumber) {
    const speedMul = getDifficultyMultiplier(waveNumber);
    const healthMul = getEnemyHealthMultiplier(waveNumber);

    crow.maxHealth = Math.floor(100 * healthMul);
    crow.health = crow.maxHealth;
    crow.x = canvas.width + 20;
    crow.visible = true;
    crow.frameX = 0;
    crow.frameY = 0;
    crow.frameTimer = 0;
    crow.speedX = -speedMul;
    crow.attack = Math.floor(10 * speedMul);

    fox.maxHealth = Math.floor(150 * healthMul);
    fox.health = fox.maxHealth;
    fox.x = 500;
    fox.y = GROUND_Y - 207 - 8 - 64 + 60;
    fox.visible = true;
    fox.shootTimer = 0;
    fox.shootInterval = Math.max(60, 180 - (waveNumber - 1) * 15);
    fox.attack = Math.floor(15 * speedMul);
    background.towerX = fox.x - 60;

    rat.maxHealth = Math.floor(50 * healthMul);
    rat.health = rat.maxHealth;
    rat.x = canvas.width + 20;
    rat.y = GROUND_Y - 64;
    rat.visible = true;
    rat.speedX = -(speedMul + 2);
    rat.frameX = 0;
    rat.frameTimer = 0;
    rat.attack = Math.floor(5 * speedMul);
}

let currentWave = 1;
let waveAnnouncementTimer = 0;
let enemiesKilledThisWave = 0;
const KILLS_PER_WAVE = 5;

function checkWaveAdvance() {
    if (enemiesKilledThisWave >= KILLS_PER_WAVE + currentWave * 2) {
        currentWave++;
        enemiesKilledThisWave = 0;
        waveAnnouncementTimer = 120;

        if (currentWave % 3 === 0) {
            background.setZone(background.currentZone === 'city' ? 'forest' : 'city');
        }

        spawnEnemies(currentWave);
    }
}

function respawnCrow() {
    const speedMul = getDifficultyMultiplier(currentWave);
    const healthMul = getEnemyHealthMultiplier(currentWave);
    crow.maxHealth = Math.floor(100 * healthMul);
    crow.health = crow.maxHealth;
    crow.x = canvas.width + Math.random() * 200;
    crow.y = 50 + Math.random() * 150;
    crow.visible = true;
    crow.speedX = -speedMul * (0.8 + Math.random() * 0.4);
    crow.frameX = 0;
    crow.frameY = 0;
    crow.frameTimer = 0;
}

function respawnFox() {
    const healthMul = getEnemyHealthMultiplier(currentWave);
    fox.maxHealth = Math.floor(150 * healthMul);
    fox.health = fox.maxHealth;
    fox.x = canvas.width + 20;
    fox.y = GROUND_Y - 207 - 8 - 64 + 60;
    fox.visible = true;
    fox.shootTimer = 0;
    fox.shootInterval = Math.max(60, 180 - (currentWave - 1) * 15);
    background.towerX = fox.x - 60;
}

function respawnRat() {
    const speedMul = getDifficultyMultiplier(currentWave);
    const healthMul = getEnemyHealthMultiplier(currentWave);
    rat.maxHealth = Math.floor(50 * healthMul);
    rat.health = rat.maxHealth;
    rat.x = canvas.width + Math.random() * 100;
    rat.y = GROUND_Y - 64;
    rat.visible = true;
    rat.respawnTimer = 0;
    rat.speedX = -(speedMul + 2) * (0.8 + Math.random() * 0.4);
    rat.frameX = 0;
    rat.frameTimer = 0;
}

function drawEnemyHealthBar(enemy) {
    if (!enemy.visible || enemy.health >= enemy.maxHealth) return;
    const barWidth = enemy.width * 0.8;
    const barHeight = 5;
    const barX = enemy.x + (enemy.width - barWidth) / 2;
    const barY = enemy.y - 10;
    const healthPct = Math.max(0, enemy.health / enemy.maxHealth);

    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barWidth, barHeight);
    ctx.fillStyle = healthPct > 0.5 ? '#39ff14' : healthPct > 0.25 ? '#ffaa00' : '#ff3333';
    ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
}
