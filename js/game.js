const ctx = canvas.getContext('2d');
let gameStarted = false;
let gamePaused = false;
let gameOver = false;
let showHallOfFame = false;

//function to render the game
function render() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background layers (must be first, behind everything)
    background.draw(true);

    // Draw the player
    // Taille d'une frame dans le spritesheet (grille 2 colonnes x 3 lignes, 138px par frame)
    const frameW = 138;
    const frameH = 138;
    // frameX (0 à 5, voir update()) est traité comme un index linéaire sur cette grille
    const col = player.frameX % 2;
    const row = Math.floor(player.frameX / 2);

    if (player.facingLeft) {
        ctx.save();
        ctx.scale(-1, 1); // Flip horizontally
        ctx.drawImage(
            playerImage,
            col * frameW, row * frameH, frameW, frameH,
            -player.x - player.width, player.y, player.width, player.height
        );
        ctx.restore();
    } else {
        ctx.drawImage(
        playerImage,
        col * frameW, row * frameH, frameW, frameH,
        player.x, player.y, player.width, player.height
        );
    }


    // Draw the crow only if visible (visible becomes false when health reaches 0)
    if (crow.visible) {
        ctx.save();
        ctx.translate(crow.x + crow.width, crow.y);
        ctx.scale(-1, 1);
        ctx.drawImage(crowImage, crow.frameX * 461, crow.frameY * 384, 461, 384, 0, 0, crow.width, crow.height);
        ctx.restore();
    }

    // Draw the fox only if visible (visible becomes false when health reaches 0)
    if (fox.visible) {
        if (player.x < fox.x) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(foxImage, 0, 0, 384, 341,
                -fox.x - fox.width, fox.y, fox.width, fox.height);
            ctx.restore();
        } else {
            ctx.drawImage(foxImage, 0, 0, 384, 341,
                fox.x, fox.y, fox.width, fox.height);
        }
    }

    //Draw the rat only if visible (visible becomes false when health reaches 0 or rat comes out of canva)
    if (rat.visible){
        ctx.drawImage(
            ratImage,
            rat.frameX * 275, 0, 275, 140, // Extract from the spritesheet (x, y, width, height)
            rat.x, rat.y, rat.width, rat.height,
        );
    }

    // Draw projectiles
    drawProjectiles();

    drawHUD();
}

//function to update the game state
function update() {

    //Bring back to menu of the game if player press M
    if (keysJustPressed['m'] && gameStarted === true) {  
        restartPlayer();
        currentWave = 1;
        spawnEnemies(currentWave);
        projectiles.length = 0; //clear projectiles invincibility
        player.invincibleUntil = 0; //reset invincibility  
        gameOver = false;
        gameStarted = false; //go back to menu
        musicGameplay.pause();
        musicGameplay.currentTime = 0;
        musicGameMenu.currentTime = 0;
        musicGameMenu.play();
    }

    //Restart the game if player press R when game over
    if (keysJustPressed['r'] && (gameOver === true || gameStarted === true)) {
        restartPlayer();
        currentWave = 1;
        spawnEnemies(currentWave);
        projectiles.length = 0; //clear projectiles invincibility
        player.invincibleUntil = 0; //reset invincibility  
        gameOver = false;
        gameStarted = true; //restart the game
        musicGameplay.currentTime = 0;
        musicGameplay.play().catch(() => {});
    }
        

    //pause
    if (keysJustPressed['p']){
        gamePaused = !gamePaused;
        if (gamePaused) {
        musicGameplay.pause();
        } else {
            musicGameplay.play().catch(() => {});
        }
        delete keysJustPressed['p']; //exception pour p
    }

    
    if (gamePaused) return; //if paused get out of update


    // Update projectiles
    updateProjectiles();

    // Update background parallax scrolling
    background.update();

    player.distance++; // increment distance of 1 per frame

    // Move the crow and increment shootTimer
    if (crow.visible) {
        crow.frameTimer++;
        if (crow.frameTimer > 10) { // Adjust the frame change speed here
            crow.frameX = (crow.frameX + 1) % 3;
            crow.frameTimer = 0;
        }
        crow.x += crow.speedX;
        crow.shootTimer++;
        if (crow.x + crow.width < 0) { // when  crow get out of the screen
        crow.x = canvas.width + 20; // put it back right for respawn
        }
    }

    //Fox shoot from tower and move with it
    if (fox.visible) {
        fox.shootTimer++;
        fox.x += fox.speedX; 
        if (fox.x + fox.width < 0) {
        fox.visible = false;
        }
    }

    //Move the rat
    if (rat.visible) {
        rat.frameTimer++;
        if (rat.frameTimer > 1) { // Adjust the frame change speed here
            rat.frameX = (rat.frameX  + 1) % 13;
            rat.frameTimer = 0;
        }
        rat.x += rat.speedX;
        if (rat.x + rat.width < 0){
            rat.visible = false;
        }
    }

    //respawn ennemies independently
    if (!crow.visible) {
        respawnCrow();
    }

    if (!fox.visible) {
        fox.respawnTimer--;
        if (fox.respawnTimer <= 0) {
        respawnFox(); 
        }
    }

    if (!rat.visible){
        rat.respawnTimer--;
        if (rat.respawnTimer <= 0){
            respawnRat();
        }
    }

    //move the player
    // space for jumb, a for left, d for right
    if (keysJustPressed[' '] && player.onGround === true) {
        player.velocityY = -15;
    }
    if (keysDown['a']) {
        player.frameTimer++;
        if (player.frameTimer > 1) { // Adjust the frame change speed here
            player.frameX = (player.frameX + 1) % 6;
            player.frameTimer = 0;
        }
        player.x -= 5;
        player.facingLeft = true;
    }
    if (keysDown['d']) {
        player.frameTimer++;
        if (player.frameTimer > 1) { // Adjust the frame change speed here
            player.frameX = (player.frameX + 1) % 6;
            player.frameTimer = 0;
        }
        player.x += 5;
        player.facingLeft = false;
    }

    player.onGround = false;
    //Handle gravity for player
    player.velocityY += gravity;
    player.y += player.velocityY;
    
    //Bring back player on the ground
    if(player.y + player.height >= GROUND_Y) {
        player.y = GROUND_Y - player.height+6;
        player.velocityY = 0;
        player.onGround = true;
    }

    // Keep player within canvas bounds
    if(player.x < 0) {
        player.x = 0;
    }
    if(player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
    if(player.y < 0) {
        player.y = 0;
    }
    if(player.y + player.height > GROUND_Y) {
        player.y = GROUND_Y - player.height+6;
    }

    // Clear just-pressed flags at end of each frame
    keysJustPressed = {};

    //check collision between player and crow
    if (player.health <= 0) {
        gameOver = true;
        scoreSaver(); // persist best/last score right away so the game over screen shows it
        updateHallOfFame(); // record this run in the top-10 leaderboard
        playerDeath.play().catch(() => {}); // play player death sound
        console.log('Game Over!');
    }
    else {
        if (Date.now() > player.invincibleUntil) {
            if (crow.visible && player.x < crow.x + crow.width && player.x + player.width > crow.x && player.y < crow.y + crow.height && player.y + player.height > crow.y) {
                player.health -= crow.attack;
                player.invincibleUntil = Date.now() + 500;
                console.log('Player hit by crow!');
            }

            //check collision between player and fox
            if (fox.visible && player.x < fox.x + fox.width && player.x + player.width > fox.x && player.y < fox.y + fox.height && player.y + player.height > fox.y) {
                player.health -= fox.attack;
                player.invincibleUntil = Date.now() + 500;
                console.log('Player hit by fox!');
            }

            //check collision between player and rat
            if (rat.visible && player.x < rat.x + rat.width && player.x + player.width > rat.x && player.y < rat.y + rat.height && player.y + player.height > rat.y) {
                player.health -= rat.attack;
                player.invincibleUntil = Date.now() + 500;
                console.log('Player hit by rat!');  
            }
        }
    
    }
}


function gameLoop() {
    if(gameStarted === false && gameOver === false) {
        // Draw background scrolling behind the menu
        background.update();

        renderMenu();
        if(musicGameMenu.paused && !gameStarted) {
            musicGameMenu.play();
        }
        // Check if Enter key or button are pressed to start the game
        if (keysJustPressed['Enter']) {
            musicGameMenu.pause();
            musicGameMenu.currentTime = 0;
            musicGameplay.currentTime = 0;
            musicGameplay.play().catch(() => {});
            background.towerX = fox.x - 60; // resynchronise juste avant que le gameplay (et la tour) deviennent visibles
            gameStarted = true;
        }
    }
    else if (gameStarted === true && gameOver === false){
        update();
        render();

        if (gamePaused) {
            ctx.fillStyle = 'white';
            ctx.font = '48px ' + gameFont;
            ctx.textAlign = 'center';
            ctx.fillText('PAUSE', canvas.width / 2, canvas.height / 2);
        }
    }
    else if (gameOver === true) {
        if (!musicGameplay.paused) {
            musicGameplay.pause();
            musicGameplay.currentTime = 0;
        }
        gameStarted = false; // Stop the game loop from updating and rendering the game
        if (showHallOfFame) {
            renderHallOfFame();
        } else {
            renderGameOver();
            handleGameOverInput();
        }
    }

    //Crow shoot every 2 seconds
    if (crow.shootTimer >= 120) {
        const crowProjectile = createCrowProjectile();
        projectiles.push(crowProjectile);
        crow.shootTimer = 0;


    }

    //Fox shoot every shootInterval frames dependint on the wave
    if (fox.shootTimer >= fox.shootInterval) {
        const foxProjectile = createFoxProjectile();
        projectiles.push(foxProjectile);
        fox.shootTimer = 0;
    }
    requestAnimationFrame(gameLoop);
}

function handleGameOverInput(){
    //Restart the game if player press R when game over
    if (keysJustPressed['r'] && gameOver === true) {
        restartPlayer();
        currentWave = 1;
        spawnEnemies(currentWave);
        projectiles.length = 0; //clear projectiles invincibility
        player.invincibleUntil = 0; //reset invincibility  
        gameOver = false;
        gameStarted = true; //restart the game
        musicGameplay.currentTime = 0;
        musicGameplay.play().catch(() => {});
    }

        //Bring back to menu of the game if player press M
    if (keysJustPressed['m'] && gameOver === true) {  
        restartPlayer();
        currentWave = 1;
        spawnEnemies(currentWave);
        projectiles.length = 0; //clear projectiles invincibility
        player.invincibleUntil = 0; //reset invincibility  
        gameOver = false;
        gameStarted = false; //go back to menu
        musicGameplay.pause();
        musicGameplay.currentTime = 0;
        musicGameMenu.currentTime = 0;
        musicGameMenu.play();
    }

    //empty the keysJustPressed object to prevent multiple triggers
    keysJustPressed = {};
}


spawnEnemies(1);

//start the game loop
gameLoop();