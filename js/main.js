
import { Game } from './Game.js';

function init() {

    const game = new Game();
    requestAnimationFrame(game.update);

}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}
