
import { Game } from './Game.js';

function init() {

    const game = new Game();

    game.setupBoard();
    game.draw();

    const coord = game.canvasCoordToGrid(512 / 8 * 2, 512 / 8 * 1);
    const piece = game.getPiece(coord);

    console.log(piece.toString());

    if (piece !== undefined) {
        console.log(piece.getAvailableMoves(game.getPiece.bind(game), coord.x, coord.y))
    }
}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}
