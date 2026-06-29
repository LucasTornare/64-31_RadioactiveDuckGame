const ctx = canvas.getContext('2d');
let gameStarted = false;
let gamePaused = false;
let gameOver = false;
let showHallOfFame = false;

function render() {
    ctx.save();

    if (player.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * player.screenShake;
        const shakeY = (Math.random() - 0.5) * player.screenShake;
        ctx.translate(shakeX, shakeY);
        player.screenShake *= 0.85;
        if (player.screenShake < 0.5) player.screenShake = 0;
    }

    ctx.clearRect(-10, -10, canvas.width + 20, canvas.height + 20);

    background.draw(true);

    const frameW = 138;
    const frameH = 138;
    const col = player.frameX % 2;
    const row = Math.floor(player.frameX / 2);

    const isInvincible = Date.now() < player.invincibleUntil;
    const showPlayer = !isInvincible || Math.floor(Date.now() / 80) % 2 === 0;

    if (showPlayer) {
        ctx.save();
        if (player.powerUp === 'invincible') {
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 20;
        } else if (player.powerUp === 'doubleDamage') {
            ctx.shadowColor = '#ff4444';
            ctx.shadowBlur = 15;
        }

        if (player.facingLeft) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(playerImage, col * frameW, row * frameH, frameW, frameH, -player.x - player.width, player.y, player.width, player.height);
            ctx.restore();
        } else {
            ctx.drawImage(playerImage, col * frameW, row * frameH, frameW, frameH, player.x, player.y, player.width, player.height);
        }
        ctx.restore();
    }

    if (crow.visible) {
        ctx.save();
        ctx.translate(crow.x + crow.width, crow.y);
        ctx.scale(-1, 1);
        ctx.drawImage(crowImage, crow.frameX * 461, crow.frameY * 384, 461, 384, 0, 0, crow.width, crow.height);
        ctx.restore();
    }

    if (fox.visible) {
        if (player.x < fox.x) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(foxImage, 0, 0, 384, 341, -fox.x - fox.width, fox.y, fox.width, fox.height);
            ctx.restore();
        } else {
            ctx.drawImage(foxImage, 0, 0, 384, 341, fox.x, fox.y, fox.width, fox.height);
        }
    }

    if (rat.visible) {
        ctx.drawImage(ratImage, rat.frameX * 275, 0, 275, 140, rat.x, rat.y, rat.width, rat.height);
    }

    drawProjectiles();
    drawParticles();
    drawHUD();

    if (player.flashTimer > 0) {
        ctx.fillStyle = player.flashColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        player.flashTimer--;
    }

    ctx.restore();
}

function update() {
    if (keysJustPressed['m'] && gameStarted === true) {
        restartPlayer();
        currentWave = 1;
        enemiesKilledThisWave = 0;
        waveAnnouncementTimer = 0;
        spawnEnemies(currentWave);
        projectiles.length = 0;
        player.invincibleUntil = 0;
        gameOver = false;
        gameStarted = false;
        musicGameplay.pause();
        musicGameplay.currentTime = 0;
        musicGameMenu.currentTime = 0;
        musicGameMenu.play();
    }

    if (keysJustPressed['r'] && (gameOver === true || gameStarted === true)) {
        restartPlayer();
        currentWave = 1;
        enemiesKilledThisWave = 0;
        waveAnnouncementTimer = 0;
        spawnEnemies(currentWave);
        projectiles.length = 0;
        player.invincibleUntil = 0;
        gameOver = false;
        gameStarted = true;
        musicGameplay.currentTime = 0;
        musicGameplay.play().catch(() => {});
    }

    if (keysJustPressed['p']) {
        gamePaused = !gamePaused;
        if (gamePaused) {
            musicGameplay.pause();
        } else {
            musicGameplay.play().catch(() => {});
        }
        delete keysJustPressed['p'];
    }

    if (gamePaused) return;

    updateProjectiles();
    updateParticles();
    updatePowerUp();
    background.update();

    if (waveAnnouncementTimer > 0) waveAnnouncementTimer--;

    player.distance++;

    if (crow.visible) {
        crow.frameTimer++;
        if (crow.frameTimer > 10) {
            crow.frameX = (crow.frameX + 1) % 3;
            crow.frameTimer = 0;
        }
        crow.x += crow.speedX;
        crow.shootTimer++;
        if (crow.x + crow.width < 0) {
            crow.x = canvas.width + 20;
        }
    }

    if (fox.visible) {
        fox.shootTimer++;
        fox.x += fox.speedX;
        if (fox.x + fox.width < 0) {
            fox.visible = false;
        }
    }

    if (rat.visible) {
        rat.frameTimer++;
        if (rat.frameTimer > 1) {
            rat.frameX = (rat.frameX + 1) % 13;
            rat.frameTimer = 0;
        }
        rat.x += rat.speedX;
        if (rat.x + rat.width < 0) {
            rat.visible = false;
        }
    }

    if (!crow.visible) {
        respawnCrow();
    }

    if (!fox.visible) {
        fox.respawnTimer--;
        if (fox.respawnTimer <= 0) {
            respawnFox();
        }
    }

    if (!rat.visible) {
        rat.respawnTimer--;
        if (rat.respawnTimer <= 0) {
            respawnRat();
        }
    }

    if (keysJustPressed[' '] && player.onGround === true) {
        player.velocityY = -14;
    }

    const moveSpeed = player.speed;
    if (keysDown['a']) {
        player.frameTimer++;
        if (player.frameTimer > 10) {
            player.frameX = (player.frameX + 1) % 6;
            player.frameTimer = 0;
        }
        player.x -= moveSpeed;
        player.facingLeft = true;
    }
    if (keysDown['d']) {
        player.frameTimer++;
        if (player.frameTimer > 10) {
            player.frameX = (player.frameX + 1) % 6;
            player.frameTimer = 0;
        }
        player.x += moveSpeed;
        player.facingLeft = false;
    }

    player.onGround = false;
    player.y += player.velocityY;

    if (player.y + player.height >= GROUND_Y) {
        player.y = GROUND_Y - player.height + 6;
        player.velocityY = 0;
        player.onGround = true;
    }

    if (!player.onGround) {
        player.velocityY += gravity;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > GROUND_Y) player.y = GROUND_Y - player.height + 6;

    keysJustPressed = {};

    if (player.health <= 0 && player.lives > 0) {
        loseLife();
        playerDeath.play().catch(() => {});

        if (player.lives <= 0) {
            gameOver = true;
            scoreSaver();
            updateHallOfFame();
        }
    }

    if (!gameOver && Date.now() > player.invincibleUntil) {
        if (crow.visible && collides(player, crow)) {
            player.health -= crow.attack;
            player.invincibleUntil = Date.now() + 500;
            player.screenShake = 10;
            spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#ff0000', 8);
        }

        if (fox.visible && collides(player, fox)) {
            player.health -= fox.attack;
            player.invincibleUntil = Date.now() + 500;
            player.screenShake = 10;
            spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#ff0000', 8);
        }

        if (rat.visible && collides(player, rat)) {
            player.health -= rat.attack;
            player.invincibleUntil = Date.now() + 500;
            player.screenShake = 10;
            spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#ff0000', 8);
        }
    }
}


function gameLoop() {
    if (gameStarted === false && gameOver === false) {
        background.update();
        renderMenu();
        if (musicGameMenu.paused && !gameStarted) {
            musicGameMenu.play();
        }
        if (keysJustPressed['Enter']) {
            musicGameMenu.pause();
            musicGameMenu.currentTime = 0;
            musicGameplay.currentTime = 0;
            musicGameplay.play().catch(() => {});
            background.towerX = fox.x - 60;
            gameStarted = true;
            waveAnnouncementTimer = 120;
        }
    } else if (gameStarted === true && gameOver === false) {
        update();
        render();

        if (gamePaused) {
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.font = '48px ' + gameFont;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2 - 20);
            ctx.font = '20px ' + gameFont;
            ctx.fillStyle = '#cedd59';
            ctx.fillText('Press P to resume', canvas.width / 2, canvas.height / 2 + 20);
            ctx.restore();
        }
    } else if (gameOver === true) {
        if (!musicGameplay.paused) {
            musicGameplay.pause();
            musicGameplay.currentTime = 0;
        }
        gameStarted = false;
        if (showHallOfFame) {
            renderHallOfFame();
        } else {
            renderGameOver();
            handleGameOverInput();
        }
    }

    if (gameStarted && !gamePaused && !gameOver) {
        const crowInterval = Math.max(60, 120 - currentWave * 8);
        if (crow.shootTimer >= crowInterval) {
            const p = createCrowProjectile();
            if (p) projectiles.push(p);
            crow.shootTimer = 0;
        }

        if (fox.shootTimer >= fox.shootInterval) {
            const p = createFoxProjectile();
            if (p) projectiles.push(p);
            fox.shootTimer = 0;
        }
    }

    requestAnimationFrame(gameLoop);
}

function handleGameOverInput() {
    if (keysJustPressed['r'] && gameOver === true) {
        restartPlayer();
        currentWave = 1;
        enemiesKilledThisWave = 0;
        waveAnnouncementTimer = 0;
        spawnEnemies(currentWave);
        projectiles.length = 0;
        player.invincibleUntil = 0;
        gameOver = false;
        gameStarted = true;
        waveAnnouncementTimer = 120;
        musicGameplay.currentTime = 0;
        musicGameplay.play().catch(() => {});
    }

    if (keysJustPressed['m'] && gameOver === true) {
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
        musicGameMenu.play();
    }

    keysJustPressed = {};
}

spawnEnemies(1);
gameLoop();
