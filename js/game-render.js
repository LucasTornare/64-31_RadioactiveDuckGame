//Define header of the game
const headerGame = new Image();
headerGame.src = 'ressources/images/gameMenu/welcome_header.png';

//Button to start the game
const startButton = new Image();
startButton.src = 'ressources/images/gameMenu/button1.png';

//Header for the game "Preess Enter to Start"
const pressEnterHeader = new Image();
pressEnterHeader.src = 'ressources/images/gameMenu/button2.png';

// Bouton Commandes (icône "?") - 2 sprites selon l'état
const commandsButton = new Image();
commandsButton.src = 'ressources/images/gameMenu/commands.png';

const commandsButtonActive = new Image();
commandsButtonActive.src = 'ressources/images/gameMenu/commands_clicked.png';

// Bouton Settings (icône engrenage) - 2 sprites selon l'état
const settingsButton = new Image();
settingsButton.src = 'ressources/images/gameMenu/settings.png';

const settingsButtonActive = new Image();
settingsButtonActive.src = 'ressources/images/gameMenu/settings_clicked.png';

// Panneau de fond pour la fenêtre des commandes
const commandsPanel = new Image();
commandsPanel.src = 'ressources/images/gameMenu/score_board1.png';

// États d'affichage des fenêtres
let showCommands = false;
let showSettings = false;

//Game over screen
const gameOverScreen = new Image();
gameOverScreen.src = 'ressources/images/gameOver/gameover_header.png';

const scoreRender = new Image();
scoreRender.src = 'ressources/images/gameOver/score_board2.png';

const restartButton = new Image();
restartButton.src = 'ressources/images/gameMenu/button1.png';

const mainMenuButton = new Image();
mainMenuButton.src = 'ressources/images/gameMenu/button1.png';

//Draw the header of the game, the button to start the game and the header "Press Enter to Start"
function renderMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas before drawing the menu
    background.draw(); //Draw the background behind the menu
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
        headerGame,
        canvas.width / 2 - 826 / 2,
        -80,
        826, 343
    );
    ctx.drawImage(
        startButton,
        canvas.width / 2 - 200 / 2,
        280,
        200, 60
    );
    // Ombre derrière le texte
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;
    ctx.shadowBlur = 1;
    
    ctx.fillStyle = '#e0ff89';
    ctx.font = '45px ' + gameFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('START', canvas.width / 2 + 3, 280 + 28);

    ctx.drawImage(
        pressEnterHeader,
        canvas.width / 2 - 300 / 2,
        320,
        280, 77
    );
    ctx.font = '16px ' + gameFont; // un peu plus petit pour le bouton plus petit
    ctx.fillText('PRESS ENTER', canvas.width / 2+1, 320+48);

    /// Bouton Commandes (icône "?") en bas à droite - sprite selon l'état
    const commandsIcon = showCommands ? commandsButtonActive : commandsButton;
    ctx.drawImage(commandsIcon, canvas.width - 70, canvas.height - 70, 60, 60);

    // Bouton Settings (icône engrenage), juste à gauche du bouton Commandes
    const settingsIcon = showSettings ? settingsButtonActive : settingsButton;
    ctx.drawImage(settingsIcon, canvas.width - 140, canvas.height - 70, 60, 60);

    // Si la fenêtre des commandes est ouverte, on la dessine par dessus tout
    if (showCommands) {
        drawCommandsPanel();
    }
    ctx.shadowColor = 'transparent';
}

// Fenêtre affichant les commandes, dessinée sur score_board1.png
    function drawCommandsPanel() {
        ctx.drawImage(commandsPanel, canvas.width / 2 - 850 / 2, canvas.height / 2 - 180 / 2, 800, 360);
        
        // Centre du panneau selon sa position
        const panelCenterX = canvas.width / 2 ;
        const panelCenterY = canvas.height / 2 + 70;

        // Texte des commandes, centré sur le panneau
        ctx.font = '28px ' + gameFont;
        ctx.fillStyle = '#cedd59';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Use the "A" to go left, "D" to go right, and "space" to jump', panelCenterX, panelCenterY - 90);
        ctx.fillText('Aim with the mouse and click to shoot at ennemies', panelCenterX, panelCenterY - 54);
        ctx.fillText('Press key "F" to toggle fullscreen', panelCenterX, panelCenterY - 18);
        ctx.fillText('Press key "P" to pause the game', panelCenterX, panelCenterY + 18);
        ctx.fillText('Press key "R" to restart the game', panelCenterX, panelCenterY + 54);
        ctx.fillText('Press key "M" to return to the main menu', panelCenterX, panelCenterY + 90);
        
    }


function renderGameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    background.draw(); //Draw the background behind the game over screen
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '48px gameFont';
    // Draw the game over screen and the final score
    ctx.drawImage(
        scoreRender,
        canvas.width / 2 - 600 / 2,
        200,
        600, 200
    );
    ctx.drawImage(
        gameOverScreen,
        (canvas.width - 600) / 2,
        100,
        600, 150
    );
    //draw the buttons to restart the game or go to the main menu
        ctx.drawImage(
        restartButton,
        (canvas.width - (200 + 20 + 200)) / 2,
        420,
        200, 60
    );
    ctx.drawImage(
        mainMenuButton,
        (canvas.width - 420) / 2  +  200  + 20,
        420,
        200, 60
    );

    ctx.fillStyle = '#cedd59 ' ;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#000000';  // couleur de l'ombre
    ctx.shadowOffsetX = 4;         // pas de décalage horizontal
    ctx.shadowOffsetY = 4;         // décalage vertical de 3px vers le bas
    ctx.shadowBlur = 1;            // pas de flou, ombre nette
    ctx.font = '36px ' + gameFont;
    // Draw the "SCORE" label and the player's final score on the score board
    ctx.fillText('SCORE', canvas.width / 2 - 170, 240);
    ctx.fillText(player.score, canvas.width / 2 + 130, 240);

    // Draw the distance label and value below the score
    ctx.fillText('DISTANCE', canvas.width / 2 - 170, 305);
    ctx.fillText(Math.floor(player.distance/60) + 'm', canvas.width / 2 + 130, 305);

    // Draw the best score (persisted in localStorage) on the third slot of the score board
    const bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    ctx.fillText('BEST SCORE', canvas.width / 2 - 170, 367);
    ctx.fillText(bestScore, canvas.width / 2 + 130, 367);

    //Draw the restart button and main menu button text
    ctx.fillStyle = '#e0ff89 ' ;
    ctx.font = '30px ' + gameFont;
    ctx.fillText('RESTART', (canvas.width - 420) / 2 + 100, 420 + 28);
    ctx.fillText('MAIN MENU', (canvas.width - 420) / 2 + 220 + 100, 420 + 28);

    ctx.shadowColor = 'transparent'; // reset pour ne pas affecter les autres draw calls
}