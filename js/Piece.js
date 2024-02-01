
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
     * @param {(pos: Vec2) => Piece|null|undefined} getPiece
     * @param {Vec2} pos
     * @returns {Array<Vec2>}
     */
    getAvailableMoves(board, pos) {
        return [];
    }

    /**
     * Handler for anything special to do once we've moved (ie, change our state.)
     * @param {Vec2} oldPos
     * @param {Vec2} newPos
     */
    onMove(oldPos, newPos) {
        return;
    }

    toString() {
        return `${this.constructor.name}(side=${this.side}, name=${this.name})`;
    }

}
