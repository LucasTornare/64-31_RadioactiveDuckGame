// Radioactive Duck — avatar customization page

// DOM references
const pseudoInput = document.getElementById('pseudo');
const pseudoError = document.getElementById('pseudo-error');
const duckError   = document.getElementById('duck-error');
const stage       = document.getElementById('avatar-stage');
const playBtn     = document.getElementById('play-btn');

// Current choices
let selectedDuck = null;        // 'yellow' | 'pink' | 'white'

// Check the nickname: it must be 2 to 15 characters long
function validatePseudo() {
    const value = pseudoInput.value.trim();
    const ok = value.length >= 2 && value.length <= 15;
    pseudoError.textContent = (value.length > 0 && !ok)
        ? 'Nickname must be 2 to 15 characters long.'
        : '';
    return ok;
}
pseudoInput.addEventListener('input', validatePseudo);

// Show the chosen duck in the drop zone
function chooseDuck(color) {
    selectedDuck = color;
    stage.innerHTML = '<img src="ressources/images/player/duck_' + color + '.png" alt="' + color + ' duck">';
}

// Each duck can be dragged into the drop zone, or simply clicked
document.querySelectorAll('#duck-choices .duck-option').forEach((opt) => {
    opt.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', opt.dataset.value));
    opt.addEventListener('click', () => chooseDuck(opt.dataset.value));
});

// Drop zone: allow dropping and read which duck was dropped
stage.addEventListener('dragover', (e) => { e.preventDefault(); stage.classList.add('dragover'); });
stage.addEventListener('dragleave', () => stage.classList.remove('dragover'));
stage.addEventListener('drop', (e) => {
    e.preventDefault();
    stage.classList.remove('dragover');
    const color = e.dataTransfer.getData('text/plain');
    if (color) chooseDuck(color);
});


// Validate, save the player, then go to the game
playBtn.addEventListener('click', () => {
    if (!validatePseudo() || pseudoInput.value.trim() === '') {
        pseudoError.textContent = 'Choose a valid nickname to play.';
        pseudoInput.focus();
        return;
    }
    if (!selectedDuck) {
        duckError.textContent = 'Drag a duck into the slot first.';
        return;
    }

    const player = {
        pseudo: pseudoInput.value.trim(),
        duck: selectedDuck,
    };
    localStorage.setItem('duckPlayer', JSON.stringify(player));
    window.location.href = 'game.html';
});