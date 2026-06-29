let keysDown = {};
let keysJustPressed = {};
let mouseX = 0;
let mouseY = 0;

const gameContainer = document.getElementById('gameContainer');

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (event.clientX - rect.left) / rect.width * canvas.width;
    mouseY = (event.clientY - rect.top) / rect.height * canvas.height;
});

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.key === 'f') {
        gameContainer.requestFullscreen();
    }
    if (!event.repeat) {
        keysJustPressed[event.key] = true;
    }
    keysDown[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    event.preventDefault();
    delete keysDown[event.key];
});

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * canvas.width;
    const y = (event.clientY - rect.top) / rect.height * canvas.height;

    if (gameStarted === false && gameOver === true) {
        if (showHallOfFame) {
            if (x > canvas.width / 2 - HOF_BUTTON_WIDTH / 2
                && x < canvas.width / 2 + HOF_BUTTON_WIDTH / 2
                && y > HOF_BACK_BUTTON_Y
                && y < HOF_BACK_BUTTON_Y + HOF_BUTTON_HEIGHT) {
                showHallOfFame = false;
            }
            return;
        }
        if (x > (canvas.width - (200 + 20 + 200)) / 2
            && x < ((canvas.width - (200 + 20 + 200)) / 2) + 200
            && y > 420
            && y < 420 + 60) {
            gameOver = false;
            restartPlayer();
            currentWave = 1;
            enemiesKilledThisWave = 0;
            waveAnnouncementTimer = 0;
            spawnEnemies(1);
            gameStarted = true;
            waveAnnouncementTimer = 120;
            musicGameplay.currentTime = 0;
            musicGameplay.play().catch(() => {});
        }
        if (x > (canvas.width - 420) / 2 + 200 + 20
            && x < (canvas.width - 420) / 2 + 200 + 20 + 200
            && y > 420
            && y < 420 + 60) {
            restartPlayer();
            currentWave = 1;
            enemiesKilledThisWave = 0;
            waveAnnouncementTimer = 0;
            spawnEnemies(currentWave);
            projectiles.length = 0;
            gameOver = false;
            gameStarted = false;
            musicGameplay.pause();
            musicGameplay.currentTime = 0;
            musicGameMenu.currentTime = 0;
            musicGameMenu.play().catch(() => {});
        }
        if (x > canvas.width / 2 - HOF_BUTTON_WIDTH / 2
            && x < canvas.width / 2 + HOF_BUTTON_WIDTH / 2
            && y > 500
            && y < 500 + HOF_BUTTON_HEIGHT) {
            showHallOfFame = true;
        }
    } else if (gameStarted === false) {
        if (x > canvas.width / 2 - 200 / 2
            && x < (canvas.width / 2 - 200 / 2) + 200
            && y > 280
            && y < 280 + 60) {
            musicGameMenu.pause();
            musicGameMenu.currentTime = 0;
            musicGameplay.currentTime = 0;
            musicGameplay.play().catch(() => {});
            background.towerX = fox.x - 60;
            gameStarted = true;
            waveAnnouncementTimer = 120;
        }
        if (x > canvas.width - 70 && x < canvas.width - 70 + 60
            && y > canvas.height - 70 && y < canvas.height - 70 + 60) {
            showCommands = !showCommands;
            showSettings = false;
        }
        if (x > canvas.width - 140 && x < canvas.width - 140 + 60
            && y > canvas.height - 70 && y < canvas.height - 70 + 60) {
            showSettings = !showSettings;
            showCommands = false;
        }
    } else if (gameStarted === true && gameOver === false && !gamePaused) {
        const projectile = createProjectile();
        if (projectile) {
            projectiles.push(projectile);
            const sound = gunFire.cloneNode();
            sound.play().catch(() => {});
        }
    }
});

canvas.style.cursor = 'none';
