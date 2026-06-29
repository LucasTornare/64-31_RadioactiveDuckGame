const projectiles = [];
const projectileSpeed = 5;

const projectileSpriteSheet = new Image();
projectileSpriteSheet.src = 'ressources/images/player/projectilesSpriteSheet.png';

const fireballFrameX = [34, 114, 195, 297];
const fireballFrameY = [28, 30, 32, 34];
const fireballFrameW = [33, 58, 83, 62];
const fireballFrameH = [29, 24, 22, 18];
const fireballHeadOffsetX = 16;

function buildFireballFrames(xOffset, yOffset) {
    return fireballFrameX.map((x, i) => ({
        x: x + xOffset,
        y: fireballFrameY[i] + yOffset,
        w: fireballFrameW[i],
        h: fireballFrameH[i],
    }));
}

const playerFireballFrames = buildFireballFrames(0, 0);
const crowFireballFrames = buildFireballFrames(378, 0);
const foxFireballFrames = buildFireballFrames(0, 960);

const fireballAnimDuration = 12;
const fireballDisplayScale = 0.85;

function createProjectile() {
    const dx = mouseX - (player.x + player.width / 2);
    const dy = mouseY - (player.y + player.height / 2);
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return null;
    const speed = projectileSpeed * (player.powerUp === 'doubleDamage' ? 1.3 : 1);
    const speedX = (dx / length) * speed;
    const speedY = (dy / length) * speed;

    return {
        x: player.x + player.width / 2,
        y: player.y + player.height / 2,
        width: 10,
        height: 10,
        speedX,
        speedY,
        angle: Math.atan2(dy, dx),
        age: 0,
        owner: "player",
    };
}

function drawFireball(frames, projectile) {
    const stepDuration = fireballAnimDuration / frames.length;
    const frameIndex = Math.min(frames.length - 1, Math.floor(projectile.age / stepDuration));
    const frame = frames[frameIndex];
    const scale = fireballDisplayScale * (projectile.owner === 'player' && player.powerUp === 'doubleDamage' ? 1.4 : 1);

    ctx.save();
    ctx.translate(projectile.x + projectile.width / 2, projectile.y + projectile.height / 2);
    ctx.rotate(projectile.angle);
    ctx.scale(-1, 1);
    ctx.drawImage(
        projectileSpriteSheet,
        frame.x, frame.y, frame.w, frame.h,
        -fireballHeadOffsetX * scale, -(frame.h * scale) / 2,
        frame.w * scale, frame.h * scale
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
}

function createCrowProjectile() {
    const dx = player.x - crow.x;
    const dy = player.y - crow.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return null;
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
        owner: "crow",
    };
}

function createFoxProjectile() {
    const dx = player.x - fox.x;
    const dy = player.y - fox.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return null;
    const speedX = (dx / length) * (projectileSpeed + currentWave * 0.3);
    const speedY = (dy / length) * (projectileSpeed + currentWave * 0.3);

    return {
        x: fox.x + fox.width / 2,
        y: fox.y + fox.height / 2,
        width: 10,
        height: 10,
        speedX,
        speedY,
        angle: Math.atan2(dy, dx),
        age: 0,
        owner: "fox",
    };
}

function hitEnemy(enemy, projectileIndex) {
    const damage = getPlayerDamage();
    enemy.health -= damage;
    projectiles.splice(projectileIndex, 1);

    spawnParticles(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, '#ff6600', 8);

    if (damage > player.attack) {
        spawnTextParticle(enemy.x + enemy.width / 2, enemy.y, damage + '!', '#ff4444');
    }

    return enemy.health <= 0;
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const p = projectiles[i];
        p.x += p.speedX;
        p.y += p.speedY;
        p.age++;

        if (p.x > canvas.width + 50 || p.x < -50 || p.y > canvas.height + 50 || p.y < -50) {
            projectiles.splice(i, 1);
            continue;
        }

        if (p.owner === "player") {
            if (crow.visible && collides(p, crow)) {
                if (hitEnemy(crow, i)) {
                    birdDeath.play().catch(() => {});
                    crow.visible = false;
                    addKillCombo(crow.x + crow.width / 2, crow.y);
                    enemiesKilledThisWave++;
                    spawnParticles(crow.x + crow.width / 2, crow.y + crow.height / 2, '#8844ff', 15);
                    checkWaveAdvance();
                }
                continue;
            }
            if (fox.visible && collides(p, fox)) {
                if (hitEnemy(fox, i)) {
                    foxDeath.play().catch(() => {});
                    fox.visible = false;
                    fox.respawnTimer = Math.max(60, 180 - currentWave * 10);
                    addKillCombo(fox.x + fox.width / 2, fox.y);
                    enemiesKilledThisWave++;
                    spawnParticles(fox.x + fox.width / 2, fox.y + fox.height / 2, '#ff8800', 15);
                    checkWaveAdvance();
                }
                continue;
            }
            if (rat.visible && collides(p, rat)) {
                if (hitEnemy(rat, i)) {
                    ratDeath.play().catch(() => {});
                    rat.visible = false;
                    rat.respawnTimer = Math.max(60, 180 - currentWave * 10);
                    addKillCombo(rat.x + rat.width / 2, rat.y);
                    enemiesKilledThisWave++;
                    spawnParticles(rat.x + rat.width / 2, rat.y + rat.height / 2, '#44ff44', 15);
                    checkWaveAdvance();
                }
                continue;
            }
        } else if (p.owner === "crow" || p.owner === "fox") {
            if (collides(p, player)) {
                if (Date.now() > player.invincibleUntil) {
                    const dmg = p.owner === 'crow' ? crow.attack : fox.attack;
                    player.health -= dmg;
                    player.screenShake = 8;
                    spawnParticles(player.x + player.width / 2, player.y + player.height / 2, '#ff0000', 6);
                }
                projectiles.splice(i, 1);
                continue;
            }
        }
    }
}

function collides(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
