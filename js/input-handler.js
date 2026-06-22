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
    if(event.key === 'f') {
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

// click detection for the start button
// x > buttonX && x < buttonX + buttonWidth && y > buttonY && y < buttonY + buttonHeight
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * canvas.width;
    const y = (event.clientY - rect.top) / rect.height * canvas.height;
    // restart
    if (gameStarted === false && gameOver === true) {
        if (x > (canvas.width - (200 + 20 + 200)) / 2
            && x < ((canvas.width - (200 + 20 + 200)) / 2)+ 200
            && y > 420
            && y < 420 + 60) 
        {
            gameOver = false;
            restartPlayer();
            currentWave = 1; // compteur à 0
            spawnEnemies(1); // enemis à 0
            gameStarted = true;
            // Restart gameplay music
            musicGameplay.currentTime = 0;
            musicGameplay.play().catch(() => {});
        }
        // main menu
        if (x > (canvas.width - 420) / 2 + 200 + 20
        && x < (canvas.width - 420) / 2 + 200 + 20 + 200
        && y > 420
        && y < 420 + 60)
    {
        restartPlayer();
        currentWave = 1;
        spawnEnemies(currentWave);
        projectiles.length = 0; //clear projectiles invincibility
        gameOver = false;
        gameStarted = false;
        musicGameplay.pause();
        musicGameplay.currentTime = 0;
        musicGameMenu.currentTime = 0;
        musicGameMenu.play().catch(() => {});
    }
    }
    else if ( gameStarted === false) {
        if (x > canvas.width / 2 - 200 / 2
            && x < (canvas.width / 2 - 200 / 2) + 200
            && y > 280
            && y < 280 + 60)
        {
            musicGameMenu.pause();
            musicGameMenu.currentTime = 0;
            musicGameplay.currentTime = 0;
            musicGameplay.play().catch(() => {});
            background.towerX = fox.x - 60; 
            gameStarted = true;
        }
        // Clic sur le bouton Commandes (60x60, en bas à droite)
        if (x > canvas.width - 70 && x < canvas.width - 70 + 60
            && y > canvas.height - 70 && y < canvas.height - 70 + 60) {
            showCommands = !showCommands; // ouvre/ferme le panneau, change le sprite
            showSettings = false; // ferme l'autre fenêtre si elle était ouverte
        }

        // Clic sur le bouton Settings (60x60, juste à gauche du bouton Commandes)
        if (x > canvas.width - 140 && x < canvas.width - 140 + 60
            && y > canvas.height - 70 && y < canvas.height - 70 + 60) {
            showSettings = !showSettings;
            showCommands = false; // ferme l'autre fenêtre si elle était ouverte
        }
    }
    //Shoot projectile with mouse click
    else if (gameStarted === true && gameOver === false) {
        const projectile = createProjectile();
        projectiles.push(projectile);
        const sound = gunFire.cloneNode();
        sound.play().catch(() => {});// play sound with error handling for rapid clicks
    }

    

    
});