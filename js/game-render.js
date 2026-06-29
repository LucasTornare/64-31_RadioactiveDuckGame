const headerGame = new Image();
headerGame.src = 'ressources/images/gameMenu/welcome_header.png';

const startButton = new Image();
startButton.src = 'ressources/images/gameMenu/button1.png';

const pressEnterHeader = new Image();
pressEnterHeader.src = 'ressources/images/gameMenu/button2.png';

const commandsButton = new Image();
commandsButton.src = 'ressources/images/gameMenu/commands.png';

const commandsButtonActive = new Image();
commandsButtonActive.src = 'ressources/images/gameMenu/commands_clicked.png';

const settingsButton = new Image();
settingsButton.src = 'ressources/images/gameMenu/settings.png';

const settingsButtonActive = new Image();
settingsButtonActive.src = 'ressources/images/gameMenu/settings_clicked.png';

const commandsPanel = new Image();
commandsPanel.src = 'ressources/images/gameMenu/score_board1.png';

let showCommands = false;
let showSettings = false;

const gameOverScreen = new Image();
gameOverScreen.src = 'ressources/images/gameOver/gameover_header.png';

const scoreRender = new Image();
scoreRender.src = 'ressources/images/gameOver/score_board2.png';

const restartButton = new Image();
restartButton.src = 'ressources/images/gameMenu/button1.png';

const mainMenuButton = new Image();
mainMenuButton.src = 'ressources/images/gameMenu/button1.png';

const hallOfFameButton = new Image();
hallOfFameButton.src = 'ressources/images/gameMenu/button1.png';

const backButton = new Image();
backButton.src = 'ressources/images/gameMenu/button1.png';

const HOF_BUTTON_WIDTH = 220;
const HOF_BUTTON_HEIGHT = 55;
const HOF_PANEL_WIDTH = 600;
const HOF_PANEL_HEIGHT = 380;
const HOF_BUTTON_GAP = 25;
const HOF_PANEL_Y = (canvas.height - (HOF_PANEL_HEIGHT + HOF_BUTTON_GAP + HOF_BUTTON_HEIGHT)) / 2;
const HOF_BACK_BUTTON_Y = HOF_PANEL_Y + HOF_PANEL_HEIGHT + HOF_BUTTON_GAP;

function renderMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(headerGame, canvas.width / 2 - 826 / 2, -80, 826, 343);
    ctx.drawImage(startButton, canvas.width / 2 - 200 / 2, 280, 200, 60);

    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 1;

    ctx.fillStyle = '#e0ff89';
    ctx.font = '45px ' + gameFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', canvas.width / 2 + 3, 280 + 28);

    ctx.drawImage(pressEnterHeader, canvas.width / 2 - 300 / 2, 320, 280, 77);
    ctx.font = '16px ' + gameFont;
    ctx.fillText('PRESS ENTER', canvas.width / 2 + 1, 320 + 48);

    ctx.font = '18px ' + gameFont;
    ctx.fillStyle = '#cedd59';
    ctx.fillText('Player: ' + savedPlayer.pseudo, canvas.width / 2, 400);

    const commandsIcon = showCommands ? commandsButtonActive : commandsButton;
    ctx.drawImage(commandsIcon, canvas.width - 70, canvas.height - 70, 60, 60);

    const settingsIcon = showSettings ? settingsButtonActive : settingsButton;
    ctx.drawImage(settingsIcon, canvas.width - 140, canvas.height - 70, 60, 60);

    if (showCommands) {
        drawCommandsPanel();
    }
    ctx.shadowColor = 'transparent';
}

function drawCommandsPanel() {
    ctx.drawImage(commandsPanel, canvas.width / 2 - 850 / 2, canvas.height / 2 - 180 / 2, 800, 360);

    const panelCenterX = canvas.width / 2;
    const panelCenterY = canvas.height / 2 + 70;

    ctx.font = '28px ' + gameFont;
    ctx.fillStyle = '#cedd59';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('"A" left, "D" right, "Space" jump', panelCenterX, panelCenterY - 90);
    ctx.fillText('Aim with mouse, click to shoot', panelCenterX, panelCenterY - 54);
    ctx.fillText('"F" fullscreen  |  "P" pause', panelCenterX, panelCenterY - 18);
    ctx.fillText('"R" restart  |  "M" menu', panelCenterX, panelCenterY + 18);
    ctx.fillText('Kill enemies to advance waves!', panelCenterX, panelCenterY + 54);
    ctx.fillText('Lose a life = chance for power-up!', panelCenterX, panelCenterY + 90);
}


function renderGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(scoreRender, canvas.width / 2 - 600 / 2, 170, 600, 230);
    ctx.drawImage(gameOverScreen, (canvas.width - 600) / 2, 80, 600, 150);

    ctx.fillStyle = '#cedd59';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 1;
    ctx.font = '32px ' + gameFont;

    ctx.fillText('SCORE', canvas.width / 2 - 170, 215);
    ctx.fillText(player.score, canvas.width / 2 + 130, 215);

    ctx.fillText('WAVE', canvas.width / 2 - 170, 265);
    ctx.fillText(currentWave, canvas.width / 2 + 130, 265);

    ctx.fillText('DISTANCE', canvas.width / 2 - 170, 315);
    ctx.fillText(Math.floor(player.distance / 60) + 'm', canvas.width / 2 + 130, 315);

    const bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    ctx.fillText('BEST SCORE', canvas.width / 2 - 170, 365);
    ctx.fillText(bestScore, canvas.width / 2 + 130, 365);

    ctx.drawImage(restartButton, (canvas.width - (200 + 20 + 200)) / 2, 420, 200, 60);
    ctx.drawImage(mainMenuButton, (canvas.width - 420) / 2 + 200 + 20, 420, 200, 60);

    ctx.fillStyle = '#e0ff89';
    ctx.font = '30px ' + gameFont;
    ctx.fillText('RESTART', (canvas.width - 420) / 2 + 100, 420 + 28);
    ctx.fillText('MAIN MENU', (canvas.width - 420) / 2 + 220 + 100, 420 + 28);

    ctx.drawImage(hallOfFameButton, canvas.width / 2 - HOF_BUTTON_WIDTH / 2, 500, HOF_BUTTON_WIDTH, HOF_BUTTON_HEIGHT);
    ctx.font = '22px ' + gameFont;
    ctx.fillText('HALL OF FAME', canvas.width / 2, 500 + HOF_BUTTON_HEIGHT / 2);

    ctx.shadowColor = 'transparent';
}

function renderHallOfFame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    const panelX = (canvas.width - HOF_PANEL_WIDTH) / 2;
    const panelY = HOF_PANEL_Y;
    ctx.drawImage(commandsPanel, panelX, panelY, HOF_PANEL_WIDTH, HOF_PANEL_HEIGHT);

    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 1;
    ctx.textBaseline = 'middle';

    ctx.fillStyle = '#e0ff89';
    ctx.font = '32px ' + gameFont;
    ctx.textAlign = 'center';
    ctx.fillText('HALL OF FAME', canvas.width / 2, panelY + 48);

    const hallOfFame = JSON.parse(localStorage.getItem('hallOfFame') || '[]');
    ctx.font = '20px ' + gameFont;
    ctx.fillStyle = '#cedd59';

    if (hallOfFame.length === 0) {
        ctx.fillText('No scores yet, go make history!', canvas.width / 2, panelY + 150);
    } else {
        const rowStartY = panelY + 85;
        const rowHeight = 28;

        ctx.font = '16px ' + gameFont;
        ctx.fillStyle = '#888';
        ctx.textAlign = 'left';
        ctx.fillText('RANK', panelX + 50, rowStartY - 15);
        ctx.fillText('PLAYER', panelX + 120, rowStartY - 15);
        ctx.textAlign = 'right';
        ctx.fillText('SCORE', panelX + HOF_PANEL_WIDTH - 180, rowStartY - 15);
        ctx.fillText('WAVE', panelX + HOF_PANEL_WIDTH - 100, rowStartY - 15);
        ctx.fillText('DIST', panelX + HOF_PANEL_WIDTH - 40, rowStartY - 15);

        ctx.font = '20px ' + gameFont;
        hallOfFame.forEach((entry, index) => {
            const rowY = rowStartY + index * rowHeight;
            const isTop3 = index < 3;
            ctx.fillStyle = isTop3 ? '#ffcc00' : '#cedd59';

            ctx.textAlign = 'left';
            const medal = index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : (index + 1) + '.';
            ctx.fillText(medal, panelX + 55, rowY);
            ctx.fillText(entry.pseudo, panelX + 120, rowY);
            ctx.textAlign = 'right';
            ctx.fillText(entry.score + ' pts', panelX + HOF_PANEL_WIDTH - 160, rowY);
            ctx.fillText(entry.wave ? 'W' + entry.wave : '-', panelX + HOF_PANEL_WIDTH - 100, rowY);
            ctx.fillText(entry.distance + 'm', panelX + HOF_PANEL_WIDTH - 40, rowY);
        });
    }

    ctx.drawImage(backButton, canvas.width / 2 - HOF_BUTTON_WIDTH / 2, HOF_BACK_BUTTON_Y, HOF_BUTTON_WIDTH, HOF_BUTTON_HEIGHT);
    ctx.fillStyle = '#e0ff89';
    ctx.font = '26px ' + gameFont;
    ctx.textAlign = 'center';
    ctx.fillText('BACK', canvas.width / 2, HOF_BACK_BUTTON_Y + HOF_BUTTON_HEIGHT / 2);

    ctx.shadowColor = 'transparent';
}
