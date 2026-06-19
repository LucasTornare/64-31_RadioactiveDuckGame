# Radioactive Duck
 
A 2D pixel-art action shooter built with pure JavaScript and the HTML5 Canvas — no framework. You play a radioactive devil duck surviving waves of enemies in a post-nuclear arena: jump, aim, shoot, and rack up the highest score you can.
 
Course project for **HES-SO Valais-Wallis — Module 64-31, Web Development**.
 
## Team
 
- Ambre Morard
- Lucas Tornare
- Sonny Contat
## Gameplay
 
Survive as long as possible against waves of enemies (crow, fox, rat). Shoot them down to score points; let your health hit zero and it's game over.
 
## Controls
 
| Key / Input   | Action                     |
|---------------|----------------------------|
| `A` / `D`     | Move left / right          |
| `Space`       | Jump                       |
| Mouse move    | Aim                        |
| Mouse click   | Shoot                      |
| `Enter`       | Start the game (from menu) |
| `R`           | Restart                    |
| `M`           | Back to main menu          |
| `F`           | Fullscreen                 |
 
## Tech stack
 
- Pure JavaScript (no framework)
- HTML5 Canvas
- CSS (custom pixel font via `@font-face`)
- HTML5 Audio for music and sound effects
- `localStorage` for the best score
## Project structure
 
```
64-31_RadioactiveDuckGame/
├── index.html              # entry point
├── js/
│   ├── game.js             # main loop, game state, collisions
│   ├── player.js           # player state, movement, score
│   ├── enemy.js            # enemies (crow, fox, rat)
│   ├── projectile.js       # shooting / projectiles
│   ├── input-handler.js    # keyboard + mouse input
│   ├── game-render.js      # backgrounds, menu, rendering
│   ├── game-hud.js         # score, health bar
│   └── audio.js            # sounds and music
└── ressources/
    ├── css/style.css
    ├── fonts/
    ├── audio/
    └── images/
```
   
## Related project
 
This game is presented through a separate **headless React + WordPress** site (project description, logbook, results, and links). Demo and source links live on that site's *Links* page.
 
- Game demo: https://lucastornare.github.io/64-31_RadioactiveDuckGame/
- Presentation site: https://radioactive-duck-fdacdkdmbsfndged.switzerlandnorth-01.azurewebsites.net/description
