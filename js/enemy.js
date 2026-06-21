//define crow image
const crowImage = new Image();
crowImage.src = 'ressources/images/ennemies/crow.png'

//define fox image
const foxImage = new Image();
foxImage.src = 'ressources/images/ennemies/fox.png'

//define rat image
const ratImage = new Image();
ratImage.src = 'ressources/images/ennemies/rat.png'

const crow = {
    name: "crow",
    health: 100,
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
    visible: true
}

const fox = {
    name: 'fox',
    health: 150,
    attack: 15,
    defense: 10,
    x: 600,
    y: GROUND_Y - 207 - 8 - 64, // position on the tower
    width: 80,
    height: 64,
    speedX: -1,
    respawnTimer: 180, // respawn after 3 seconds
    shootTimer: 0,
    shootInterval: 180, // shoot every 3 seconds at 60fps
    visible: true
}

const rat = {
    name: 'rat',
    health: 50,
    attack: 5,
    defense: 2,
    speed: 10,
    x: 300,
    y: GROUND_Y - 64, // start on the ground
    width: 80,
    height: 64,
    frameX: 0,
    frameTimer: 0,
    respawnTimer: 240, // respawn after 4 seconds
    speedX: -5,
    visible: true
}

// first spawn at game launch, takes waveNumber as parameter
function spawnEnemies(waveNumber) {
    const speedBoost = 1 + (waveNumber - 1) * 0.2; // increase speed by 20% per wave
    crow.health = 100;
    crow.x = canvas.width + 20; // spawn off screen to the right
    crow.visible = true;
    crow.frameX = 0;
    crow.frameY = 0;
    crow.frameTimer = 0;
    crow.speedX = -speedBoost; // negative so it moves left

    fox.health = 150;
    fox.x = 500;
    fox.y = GROUND_Y - 207 - 8 - 64 + 60; // GROUND_Y - towerH - fox.height
    fox.visible = true;
    fox.shootTimer = 0;
    background.towerX = fox.x - 60;

    rat.health = 50;
    rat.x = canvas.width + 20; // spawn off screen to the right
    rat.y = GROUND_Y - 64;
    rat.visible = true;
    rat.speedX = -(speedBoost + 2); // negative so it moves left
    rat.frameX = 0;
    rat.frameTimer = 0;
}

// count the number of waves and increase the speed of the crow and fox for each wave
let currentWave = 1;

function respawnCrow() {
    const speedBoost = 1 + (currentWave - 1) * 0.2; //speed boost for each wave
    //reset valeur crow et fox
    crow.health = 100;
    crow.x = canvas.width + 20; // spawn off screen to the right
    crow.visible = true;
    crow.speedX = -speedBoost;
    crow.frameX = 0;
    crow.frameY = 0;
    crow.frameTimer = 0;
}

function respawnFox() {
    fox.health = 150;
    fox.x = canvas.width + 20;
    fox.y = GROUND_Y - 207 - 8 - 64 + 60; // GROUND_Y - towerH - fox.height
    fox.visible = true;
    fox.shootTimer = 0;
    fox.shootInterval = Math.max(60, fox.shootInterval - 20); // shoot faster each wave, but not less than 1 second (60 frames)
    background.towerX = fox.x - 60; // la tour réapparaît à droite, alignée avec le renard
}

function respawnRat() {
    const speedBoost = 1 + (currentWave - 1) * 0.2; //speed boost for each wave
    rat.health = 50;
    rat.x = canvas.width + 20; // spawn off screen to the right
    rat.y = GROUND_Y - 64;
    rat.visible = true;
    rat.respawnTimer = 0;
    rat.speedX = -(speedBoost + 2);
    rat.frameX = 0;
    rat.frameTimer = 0;
}