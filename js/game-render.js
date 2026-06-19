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

//BACKGROUNDS

//Shared background layers (used in both zones)
const bgGreen = new Image();
bgGreen.src = 'ressources/images/backgrounds/layer1_greenbackground.png';

const bgMiddle = new Image();
bgMiddle.src = 'ressources/images/backgrounds/middle_layer_greenhue.png';

const bgLastGround = new Image();
bgLastGround.src = 'ressources/images/backgrounds/last_layer_ground.png';

//City zone layers
const bgBuildings2 = new Image();
bgBuildings2.src = 'ressources/images/backgrounds/city_background/layer2_buildings.png';

const bgBuildings3 = new Image();
bgBuildings3.src = 'ressources/images/backgrounds/city_background/layer3_buildings.png';

const bgBuildings4 = new Image();
bgBuildings4.src = 'ressources/images/backgrounds/city_background/layer4_buildings.png';

const bgBarbedWires = new Image();
bgBarbedWires.src = 'ressources/images/backgrounds/city_background/layer5_barbedwires.png';

const bgForeGround = new Image();
bgForeGround.src = 'ressources/images/backgrounds/city_background/layer6_foreground_loop.png';

//Forest zone layers
const bgTrees2 = new Image();
bgTrees2.src = 'ressources/images/backgrounds/forest_background/layer2_trees.png';

const bgTrees3 = new Image();
bgTrees3.src = 'ressources/images/backgrounds/forest_background/layer3_trees.png';

const bgGrass = new Image();
bgGrass.src = 'ressources/images/backgrounds/forest_background/layer4_grass.png';

//Tower for Fox that is on it
const foxTower = new Image();
foxTower.src = 'ressources/images/backgrounds/tower.png';

//Game over screen
const gameOverScreen = new Image();
gameOverScreen.src = 'ressources/images/gameOver/gameover_header.png';

const scoreRender = new Image();
scoreRender.src = 'ressources/images/gameOver/score_board2.png';

const restartButton = new Image();
restartButton.src = 'ressources/images/gameMenu/button1.png';

const mainMenuButton = new Image();
mainMenuButton.src = 'ressources/images/gameMenu/button1.png';

const trophyHallButton = new Image();
trophyHallButton.src = 'ressources/images/gameMenu/button1.png';

//x = horizontal scroll position
//imgW & imgH = original image size / resize
//y = vertical scroll position 
const h = canvas.height;

const cityLayers = [ // back to front
    { img: bgGreen,       x: 0, speed: 0.08, imgW: 2699, y: 0,      imgH: h      },
    { img: bgBuildings2, x: 0, speed: 0.2, imgW: 780, y: h*0.35, imgH: h*0.89 },
    { img: bgBuildings3, x: 0, speed: 0.4, imgW: 1800, y: h*0.0, imgH: h*1.23 },
    { img: bgBuildings4,  x: 0, speed: 0.6, imgW: 1638, y: h*.36,  imgH: h*.54  },
    { img: bgMiddle,      x: 0, speed: 0.8, imgW: 8000, y: h*0,      imgH: h      },
    { img: bgBarbedWires, x: 0, speed: 0.8, imgW: 1596, y: h*0.20, imgH: h*0.93 },
    { img: bgForeGround,  x: 0, speed: 1, imgW: 681, y: h*0.55, imgH: h*0.38 },
    { img: bgLastGround,  x: 0, speed: 1, imgW: 1384, y: h*0.90, imgH: h*0.14 },

];

const forestLayers = [ // back to front
    { img: bgGreen,      x: 0, speed: 0.2, imgW: 2699, y: 0,     imgH: h      },
    { img: bgMiddle,     x: 0, speed: 0.4, imgW: 8000, y: 0,     imgH: h      },
    { img: bgTrees2,     x: 0, speed: 0.6, imgW: 3100, y: h*.17, imgH: h*.83  },
    { img: bgTrees3,     x: 0, speed: 1.0, imgW: 1641, y: h*.33, imgH: h*.67  },
    { img: bgGrass,      x: 0, speed: 1.5, imgW: 2769, y: h*.58, imgH: h*.42  },
    { img: bgLastGround, x: 0, speed: 2.0, imgW: 1384, y: h*.86, imgH: h*.14  },
];

// Current active zone (city or forest)
let currentZone = 'city';

// Draw a single parallax layer looped
function drawLayer(layer) {
    // Arrondit la position X du layer au pixel entier le plus proche (évite le flou)
    const x = Math.floor(layer.x);
    const imgW = layer.imgW;
    // Draw the image twice side by side
    ctx.drawImage(layer.img, x, layer.y, imgW, layer.imgH);
    ctx.drawImage(layer.img, x + imgW, layer.y, imgW, layer.imgH);
}

// Draw all layers of the current zone
function drawBackground() {
    const layers = currentZone === 'city'? cityLayers : forestLayers;
    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        drawLayer(layer);
        // Draw tower after middle layer (index 4), before barbed wires
        if (currentZone === 'city' && i === 5) {
            drawFoxTower();
        }
    }

}

//Draw the tower for the fox 
function drawFoxTower() {
    const towerW = 120;
    const towerH = 150;
    const towerX = 580; // same x as the fox so it looks like the fox is on the tower
    const towerY = GROUND_Y - towerH - 17;
    ctx.drawImage(foxTower, towerX, towerY, towerW, towerH);
}


// Scroll and loop
function updateBackground() {
    const layers = currentZone === 'city' ? cityLayers : forestLayers;
    for (let i = 0; i < layers.length; i++) {
        const layer = layers[i];
        // Déplace le layer vers la gauche en soustrayant sa vitesse à sa position X
        layer.x -= layer.speed;

        // Vérifie si l'image est complètement sortie du canvas par la gauche
        if (layer.x <= -layer.imgW) {
            layer.x = 0; // remet l'image à sa place initial pour la boucle
        }
    }
}

// Switch to a different zone call setZone('forest') to trigger transition
function setZone(zone) {
    currentZone = zone;
}

//Draw the header of the game, the button to start the game and the header "Press Enter to Start"
function renderMenu() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas before drawing the menu
    drawBackground(); //Draw the background behind the menu
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
    drawBackground(); //Draw the background behind the game over screen
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
    //draw the buttons to restart the game, go to the main menu or go to the trophy hall
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
    ctx.drawImage(
        trophyHallButton,
        canvas.width / 2 - 200 / 2,
        500,
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

    //Draw the restart button, main menu button and trophy hall button text
    ctx.fillStyle = '#e0ff89 ' ;
    ctx.font = '30px ' + gameFont;
    ctx.fillText('RESTART', (canvas.width - 420) / 2 + 100, 420 + 28);
    ctx.fillText('MAIN MENU', (canvas.width - 420) / 2 + 220 + 100, 420 + 28);
    ctx.fillText('TROPHY HALL', canvas.width / 2, 500 + 28);

    ctx.shadowColor = 'transparent'; // reset pour ne pas affecter les autres draw calls
}