
import { Game } from './Game.js';

function init() {

    const game = new Game();

    game.setupBoard();
    game.draw();

}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}
