
import { Vec2 } from '/js/util/Vec2.js';

export class Piece {

    /**
    * @param {string} name 
    * @param {'black'|'white'} side 
    */
    constructor(name, side) {
        this.name = name;
        this.side = side;
    }

    /**
     * @param {(pos: Vec2) => Piece|undefined} getPiece
     * @param {Number} x
     * @param {Number} y 
     * @returns {Array<Vec2>}
     */
    getAvailableMoves(board, x, y) {
        return [];
    }

    /**
     * Handler for anything special to do once we've moved (ie, change our state.)
     * @param {Number} oldX 
     * @param {Number} oldY 
     * @param {Number} x 
     * @param {Number} y 
     */
    onMove(oldX, oldY, x, y) {
        return;
    }

    toString() {
        return `${this.constructor.name}(side=${this.side}, name=${this.name})`;
    }

}
