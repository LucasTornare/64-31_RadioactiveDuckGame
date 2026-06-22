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

// Parallax scrolling: each layer has its own `speed` (px/frame scrolled left).
// Lower speed = further away (background), higher speed = closer to the camera (foreground).
// Layers loop seamlessly by resetting layer.x to 0 once it has scrolled past -imgW.
class Background {
    constructor() {
        //x = horizontal scroll position
        //imgW & imgH = original image size / resize
        //y = vertical scroll position
        const h = canvas.height;

        this.cityLayers = [ // back to front
            { img: bgGreen,       x: 0, speed: 0.08, imgW: 2699, y: 0,      imgH: h      },
            { img: bgBuildings2, x: 0, speed: 0.2, imgW: 780, y: h*0.35, imgH: h*0.89 },
            { img: bgBuildings3, x: 0, speed: 0.4, imgW: 1800, y: h*0.0, imgH: h*1.23 },
            { img: bgBuildings4,  x: 0, speed: 0.6, imgW: 1638, y: h*.36,  imgH: h*.54  },
            { img: bgMiddle,      x: 0, speed: 0.8, imgW: 8000, y: h*0,      imgH: h      },
            { img: bgBarbedWires, x: 0, speed: 0.8, imgW: 1596, y: h*0.20, imgH: h*0.93 },
            { img: bgForeGround,  x: 0, speed: 1, imgW: 681, y: h*0.55, imgH: h*0.38 },
            { img: bgLastGround,  x: 0, speed: 1, imgW: 1384, y: h*0.90, imgH: h*0.14 },
        ];

        this.forestLayers = [ // back to front
            { img: bgGreen,      x: 0, speed: 0.2, imgW: 2699, y: 0,     imgH: h      },
            { img: bgMiddle,     x: 0, speed: 0.4, imgW: 8000, y: 0,     imgH: h      },
            { img: bgTrees2,     x: 0, speed: 0.6, imgW: 3100, y: h*.17, imgH: h*.83  },
            { img: bgTrees3,     x: 0, speed: 1.0, imgW: 1641, y: h*.33, imgH: h*.67  },
            { img: bgGrass,      x: 0, speed: 1.5, imgW: 2769, y: h*.58, imgH: h*.42  },
            { img: bgLastGround, x: 0, speed: 2.0, imgW: 1384, y: h*.86, imgH: h*.14  },
        ];

        // Zone actuellement active (ville ou forêt)
        this.currentZone = 'city';
        
        // Position et vitesse de la tour, indépendantes du tableau de layers
        // car elle ne doit pas se répéter à chaque imgW comme un vrai tile
        this.towerX = 580;
        this.towerSpeed = 1; // même vitesse que bgBarbedWires pour rester cohérente visuellement
    }

    // Draw a single parallax layer looped
    drawLayer(layer) {
        // Arrondit la position X du layer au pixel entier le plus proche (évite le flou)
        const x = Math.floor(layer.x);
        const imgW = layer.imgW;
        // Nombre de copies nécessaire pour couvrir tout le canvas même si imgW < canvas.width
        const copies = Math.ceil(canvas.width / imgW) + 1;
        for (let i = 0; i < copies; i++) {
            // +1 sur la largeur : léger chevauchement entre copies pour masquer le seam
            ctx.drawImage(layer.img, x + i * imgW, layer.y, imgW + 1, layer.imgH);
        }
    }

    // Draw all layers of the current zone
    draw(showTower = false) {
        const layers = this.currentZone === 'city' ? this.cityLayers : this.forestLayers;
        for (let i = 0; i < layers.length; i++) {
            this.drawLayer(layers[i]);
            // Draw tower after middle layer (index 4), before barbed wires
            if (this.currentZone === 'city' && i === 5 && showTower) {
                this.drawFoxTower();
            }
        }
    }

    //Draw the tower for the fox
    drawFoxTower() {
        const towerW = 200;
        const towerH = 207;
        const towerY = GROUND_Y - towerH - 8;
        ctx.drawImage(foxTower, this.towerX, towerY, towerW, towerH);
    }

    // Scroll and loop
    update() {
        const layers = this.currentZone === 'city' ? this.cityLayers : this.forestLayers;
        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            // Déplace le layer vers la gauche en soustrayant sa vitesse à sa position X
            layer.x -= layer.speed;

            // Vérifie si l'image est complètement sortie du canvas par la gauche
            if (layer.x <= -layer.imgW) {
                layer.x = 0; // remet l'image à sa place initial pour la boucle
            }
        }
        // Scroll de la tour, synchronisée avec le décor
        this.towerX -= this.towerSpeed;
    }

    // Switch to a different zone, call background.setZone('forest') to trigger transition
    setZone(zone) {
        this.currentZone = zone;
    }
}

// Instance unique utilisée par tout le jeu
const background = new Background();