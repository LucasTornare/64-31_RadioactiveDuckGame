const projectiles = [];
const projectileSpeed = 5;

// Fireball spritesheet: a "ball -> trailing tail" animation, several colors stacked in a grid.
// Frame coords were measured directly on the sheet (ball at the left of each frame, tail growing to the right).
const projectileSpriteSheet = new Image();
projectileSpriteSheet.src = 'ressources/images/player/projectilesSpriteSheet.png';

const fireballFrameX = [34, 114, 195, 297];
const fireballFrameY = [28, 30, 32, 34];
const fireballFrameW = [33, 58, 83, 62];
const fireballFrameH = [29, 24, 22, 18];
const fireballHeadOffsetX = 16; // distance from a frame's left edge to the ball's center

function buildFireballFrames(xOffset, yOffset) {
    return fireballFrameX.map((x, i) => ({
        x: x + xOffset,
        y: fireballFrameY[i] + yOffset,
        w: fireballFrameW[i],
        h: fireballFrameH[i]
    }));
}

const playerFireballFrames = buildFireballFrames(0, 0);     // standard green
const crowFireballFrames = buildFireballFrames(378, 0);     // muted blue
const foxFireballFrames = buildFireballFrames(0, 960);       // bright orange

const fireballAnimDuration = 12; // frames spent growing the tail before it holds on the last frame
const fireballDisplayScale = 0.85;

function createProjectile() {

    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const speedX = (dx / length) * projectileSpeed;
    const speedY = (dy / length) * projectileSpeed;

    return {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 10,
        height: 10,
        speedX,
        speedY,
        angle: Math.atan2(dy, dx),
        age: 0,
        owner: "player"
    };
}

function drawFireball(frames, projectile) {
    const stepDuration = fireballAnimDuration / frames.length;
    const frameIndex = Math.min(frames.length - 1, Math.floor(projectile.age / stepDuration));
    const frame = frames[frameIndex];

    ctx.save();
    ctx.translate(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2);
    ctx.rotate(projectile.angle);
    ctx.scale(-1, 1); // the ball sits at the left of the source frame, flip so it leads in the travel direction
    ctx.drawImage(
        projectileSpriteSheet,
        frame.x, frame.y, frame.w, frame.h,
        -fireballHeadOffsetX * fireballDisplayScale, -(frame.h * fireballDisplayScale) / 2,
        frame.w * fireballDisplayScale, frame.h * fireballDisplayScale
    );
    ctx.restore();
}

function drawProjectiles() {
    for (const projectile of projectiles) {
        if (projectile.owner === "player") {
            drawFireball(playerFireballFrames, projectile);
        } else if (projectile.owner === "crow") {
            drawFireball(crowFireballFrames, projectile);
        } else if (projectile.owner === "fox") {
            drawFireball(foxFireballFrames, projectile);
        }
    }
};

//Crow Projectile
function createCrowProjectile() {

    const dx = player.x - crow.x;
    const dy = player.y - crow.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const speedX = (dx / length) * projectileSpeed;
    const speedY = (dy / length) * projectileSpeed;

    return {
        x: crow.x + crow.width / 2,
        y: crow.y + crow.height / 2,
        width: 10,
        height: 10,
        speedX,
        speedY,
        angle: Math.atan2(dy, dx),
        age: 0,
        owner: "crow"
    };
}

//Fox Projectile
function createFoxProjectile() {

    const dx = player.x - fox.x;
    const dy = player.y - fox.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const speedX = (dx / length) * projectileSpeed;
    const speedY = (dy / length) * projectileSpeed;

    return {
        x: fox.x + fox.width / 2,
        y: fox.y + fox.height / 2,
        width: 10,
        height: 10,
        speedX,
        speedY,
        angle: Math.atan2(dy, dx),
        age: 0,
        owner: "fox"
    };
}

function updateProjectiles() {
    // Loop backwards so that splicing an element doesn't skip the next one
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.x += projectile.speedX;
        projectile.y += projectile.speedY;
        projectile.age++;
        // Remove player projectile if it goes off screen
        if (projectile.x > canvas.width && projectile.owner === "player") {
            projectiles.splice(i, 1);
        } else if (projectile.x + projectile.width < 0 && projectile.owner === 'crow') {// Remove crow projectile if it goes off screen
            projectiles.splice(i, 1); 
            }   
            else if (projectile.x + projectile.width < 0 && projectile.owner === 'fox') {// Remove fox projectile if it goes off screen
                projectiles.splice(i, 1);
        } else {
            // Check collision with crow
            if (crow.visible && projectile.x < crow.x + crow.width && projectile.x + projectile.width > crow.x && projectile.y < crow.y + crow.height && projectile.y + projectile.height > crow.y && projectile.owner === "player") {
                crow.health -= player.attack; // deal damage to crow
                projectiles.splice(i, 1); // remove projectile on hit
                if (crow.health <= 0){
                    birdDeath.play().catch(() => {}); // play bird death sound
                    crow.visible = false; // hide crow if no health left
                    player.score+=10; // increase score on crow hit
                }

            // Check collision with fox (else if so one projectile can only hit one enemy)
            } else if (fox.visible && projectile.x < fox.x + fox.width && projectile.x + projectile.width > fox.x && projectile.y < fox.y + fox.height && projectile.y + projectile.height > fox.y && projectile.owner === "player") {
                fox.health -= player.attack; // deal damage to fox
                projectiles.splice(i, 1); // remove projectile on hit
                if (fox.health <= 0) {
                    foxDeath.play().catch(() => {}); // play fox death sound
                    fox.visible = false; // hide fox if no health left
                    fox.respawnTimer = 180; // start respawn timer
                    player.score += 10; // increase score on fox hit
                }
            }
            else if (rat.visible && projectile.x < rat.x + rat.width && projectile.x + projectile.width > rat.x && projectile.y < rat.y + rat.height && projectile.y + projectile.height > rat.y && projectile.owner === "player") {
                rat.health -= player.attack; // deal damage to rat
                projectiles.splice(i, 1); // remove projectile on hit
                if (rat.health <= 0) {
                    ratDeath.play().catch(() => {}); // play rat death sound
                    rat.visible = false; // hide rat if no health left
                    rat.respawnTimer = 180; // start respawn timer
                    player.score += 10; // increase score on rat hit
                }
            }
            else if (projectile.x < player.x + player.width && projectile.x + projectile.width > player.x && projectile.y < player.y + player.height && projectile.y + projectile.height > player.y && (projectile.owner === "crow" || projectile.owner === "fox")) {
                player.health -= 10; // deal damage to player
                projectiles.splice(i, 1); // remove projectile on hit
            }
        }
    }

}
