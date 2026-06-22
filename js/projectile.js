const projectiles = [];
const projectileSpeed = 5;

// dx/dy/length below build a unit vector toward the target, scaled to projectileSpeed,
// so a projectile travels at the same speed regardless of how far away the target is.
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
        owner: "player"
    };
}
function drawProjectiles() {    for (const projectile of projectiles) {
        if (projectile.owner === "player") {
            ctx.fillStyle = 'red';
        } else if (projectile.owner === "crow") {
            ctx.fillStyle = 'green';
        } else if (projectile.owner === "fox") {
            ctx.fillStyle = 'orange';
        }
        
        ctx.fillRect(projectile.x, projectile.y, projectile.width, projectile.height);

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
        owner: "fox"
    };
}

function updateProjectiles() {
    // Loop backwards so that splicing an element doesn't skip the next one
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.x += projectile.speedX;
        projectile.y += projectile.speedY;
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
