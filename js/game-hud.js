//Define font for the HUD
const gameFont = 'CutePixel, monospace';

// Define health bar image
const healthBarImage = new Image();
healthBarImage.src = 'ressources/images/gameMenu/empty_healthbar.png';

//Define score image
const playerScore = new Image();
playerScore.src = 'ressources/images/gameMenu/score.png';

// Define Heads-up Display elements
const healthBar = {
    x: 5,
    y: 5,
    width: 240,
    height: 60,

    // Green fill position inside the health bar image
    fillX: 83,
    fillY: 42,
    fillWidth: 135,
    fillHeight: 8,
};

// Maximum player health (used for percentage and display)
const maxHealth = 100;


// Draw all HUD elements
function drawHUD() {
    ctx.fillStyle = '#cedd59';      // couleur texte pour tout le HUD
    ctx.shadowColor = '#000000';    // ombre pour tout le HUD
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 1;

    drawHealthBar();
    drawScore();
    drawDistance();
    drawCrosshair();

    ctx.shadowColor = 'rgba(0,0,0,0)'; // reset après le HUD
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
}

function drawScore() {
    ctx.drawImage(
        playerScore,
        ctx.canvas.width - 150 - 40, // position score image on the right with some padding
        15,
        150,
        50
    );
    ctx.font = '21px ' + gameFont;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Score: ' + player.score, ctx.canvas.width - 150, 22);
}


// Draw the health bar
function drawHealthBar() {
    // Draw empty health bar image
    ctx.drawImage(
        healthBarImage,
        healthBar.x,
        healthBar.y,
        healthBar.width,
        healthBar.height
    );

    // Calculate health percentage
    const healthPercent = Math.max(0, Math.min(player.health / maxHealth, 1));

    // Calculate green fill width
    const currentFillWidth = healthBar.fillWidth * healthPercent;

    // Draw green health fill
    ctx.fillRect(
        healthBar.x + healthBar.fillX,
        healthBar.y + healthBar.fillY,
        currentFillWidth,
        healthBar.fillHeight
    );

    // Draw the HP text above the green fill
    const currentHp = Math.max(0, Math.ceil(player.health));
    const textX = healthBar.x + healthBar.fillX + 2;
    const textY = healthBar.y + healthBar.fillY - 3;

    ctx.font = '21px ' + gameFont;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';

    // Draw zexz HP
    ctx.fillText('HP ' + currentHp + ' / ' + maxHealth, textX, textY);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

}

// Draw the distance travelled
function drawDistance() {
    ctx.font = '18px ' + gameFont;
    // offset black for readability
    ctx.fillText('Distance: ' + Math.floor(player.distance / 60) + 'm', canvas.width - 155, 45)

}


function drawCrosshair() {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mouseX - 10, mouseY); // start point
    ctx.lineTo(mouseX + 10, mouseY); // end point
    ctx.stroke();       // actually draws it
    ctx.moveTo(mouseX, mouseY - 10); // start point
    ctx.lineTo(mouseX, mouseY + 10); // end point
    ctx.stroke();
    //reset for not affecting the potential other draw calls
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

}