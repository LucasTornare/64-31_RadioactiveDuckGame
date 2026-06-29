const gameFont = 'CutePixel, monospace';

const healthBarImage = new Image();
healthBarImage.src = 'ressources/images/gameMenu/empty_healthbar.png';

const playerScore = new Image();
playerScore.src = 'ressources/images/gameMenu/score.png';

const healthBar = {
    x: 5,
    y: 5,
    width: 240,
    height: 60,
    fillX: 83,
    fillY: 42,
    fillWidth: 135,
    fillHeight: 8,
};

function drawHUD() {
    ctx.fillStyle = '#cedd59';
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;

    drawHealthBar();
    drawLives();
    drawScore();
    drawDistance();
    drawWaveIndicator();
    drawPowerUpIndicator();
    drawCrosshair();

    ctx.shadowColor = 'rgba(0,0,0,0)';
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;

    drawEnemyHealthBar(crow);
    drawEnemyHealthBar(fox);
    drawEnemyHealthBar(rat);

    if (waveAnnouncementTimer > 0) {
        drawWaveAnnouncement();
    }
}

function drawScore() {
    ctx.drawImage(playerScore, ctx.canvas.width - 150 - 40, 15, 150, 50);
    ctx.font = '21px ' + gameFont;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#cedd59';
    ctx.fillText('Score: ' + player.score, ctx.canvas.width - 150, 22);
}

function drawHealthBar() {
    ctx.drawImage(healthBarImage, healthBar.x, healthBar.y, healthBar.width, healthBar.height);

    const healthPercent = Math.max(0, Math.min(player.health / MAX_HEALTH, 1));
    const currentFillWidth = healthBar.fillWidth * healthPercent;

    if (healthPercent > 0.5) {
        ctx.fillStyle = '#39ff14';
    } else if (healthPercent > 0.25) {
        ctx.fillStyle = '#ffaa00';
    } else {
        ctx.fillStyle = '#ff3333';
    }

    ctx.fillRect(healthBar.x + healthBar.fillX, healthBar.y + healthBar.fillY, currentFillWidth, healthBar.fillHeight);

    const currentHp = Math.max(0, Math.ceil(player.health));
    const textX = healthBar.x + healthBar.fillX + 2;
    const textY = healthBar.y + healthBar.fillY - 3;

    ctx.font = '21px ' + gameFont;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#cedd59';
    ctx.fillText('HP ' + currentHp + ' / ' + MAX_HEALTH, textX, textY);
}

function drawLives() {
    const heartSize = 20;
    const startX = healthBar.x + 10;
    const startY = healthBar.y + healthBar.height + 5;

    for (let i = 0; i < MAX_LIVES; i++) {
        const x = startX + i * (heartSize + 6);
        if (i < player.lives) {
            ctx.fillStyle = '#ff3333';
            drawHeart(x, startY, heartSize);
        } else {
            ctx.fillStyle = '#444';
            drawHeart(x, startY, heartSize);
        }
    }
}

function drawHeart(x, y, size) {
    const s = size / 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x + s, y + s * 0.4);
    ctx.bezierCurveTo(x + s, y - s * 0.2, x + s * 2, y - s * 0.2, x + s * 2, y + s * 0.4);
    ctx.bezierCurveTo(x + s * 2, y + s, x + s, y + s * 1.6, x + s, y + s * 1.8);
    ctx.bezierCurveTo(x + s, y + s * 1.6, x, y + s, x, y + s * 0.4);
    ctx.bezierCurveTo(x, y - s * 0.2, x + s, y - s * 0.2, x + s, y + s * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
}

function drawDistance() {
    ctx.font = '18px ' + gameFont;
    ctx.fillStyle = '#cedd59';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Distance: ' + Math.floor(player.distance / 60) + 'm', canvas.width - 155, 45);
}

function drawWaveIndicator() {
    ctx.font = '22px ' + gameFont;
    ctx.fillStyle = '#ff9944';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('WAVE ' + currentWave, canvas.width / 2, 8);

    const killsNeeded = KILLS_PER_WAVE + currentWave * 2;
    const pct = Math.min(1, enemiesKilledThisWave / killsNeeded);
    const barW = 100;
    const barH = 6;
    const barX = canvas.width / 2 - barW / 2;
    const barY = 30;

    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = '#ff9944';
    ctx.fillRect(barX, barY, barW * pct, barH);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
}

function drawWaveAnnouncement() {
    const alpha = Math.min(1, waveAnnouncementTimer / 30);
    const scale = 1 + (1 - alpha) * 0.3;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = (60 * scale) + 'px ' + gameFont;
    ctx.fillStyle = '#ff6600';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000';
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    ctx.shadowBlur = 2;
    ctx.fillText('WAVE ' + currentWave, canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = (24 * scale) + 'px ' + gameFont;
    ctx.fillStyle = '#ffcc00';
    const zone = background.currentZone === 'city' ? 'NUCLEAR CITY' : 'TOXIC FOREST';
    ctx.fillText(zone, canvas.width / 2, canvas.height / 2 + 10);
    ctx.restore();
}

function drawPowerUpIndicator() {
    if (!player.powerUp) return;

    const timeLeft = Math.ceil(player.powerUpTimer / 60);
    const flash = Math.floor(Date.now() / 200) % 2 === 0;

    ctx.save();
    ctx.font = '20px ' + gameFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    if (player.powerUp === 'invincible') {
        ctx.fillStyle = flash ? '#00ffff' : '#0088aa';
        ctx.fillText('INVINCIBLE ' + timeLeft + 's', canvas.width / 2, 42);
    } else if (player.powerUp === 'doubleDamage') {
        ctx.fillStyle = flash ? '#ff4444' : '#aa0000';
        ctx.fillText('DAMAGE x2 ' + timeLeft + 's', canvas.width / 2, 42);
    }
    ctx.restore();
}

function drawCrosshair() {
    const size = 12;
    const gap = 3;

    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, size, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(mouseX - size - 4, mouseY);
    ctx.lineTo(mouseX - gap, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX + gap, mouseY);
    ctx.lineTo(mouseX + size + 4, mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY - size - 4);
    ctx.lineTo(mouseX, mouseY - gap);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX, mouseY + gap);
    ctx.lineTo(mouseX, mouseY + size + 4);
    ctx.stroke();

    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
}
