
import { Piece } from '../Piece.js';
import { Vec2 } from '../../util/math/Vec2.js';
import { pieceDirectedMovement } from '../behaviours/pieceDirectedMovement.js';

export class BishopPiece extends Piece {

    /** @type { { [key in Side]: HTMLImageElement|undefined|ErrorEvent } } */
    static img = {
        black: undefined,
        white: undefined
    };

    /**
    * @param {Side} side 
    */
    constructor(side) {
        super('Bishop', side);
    }

    /**
     * @param {(pos: Vec2) => Piece|null|undefined} getPiece
     * @param {Vec2} pos
     * @returns {Array<Vec2>}
     */
    getAvailableMoves(getPiece, pos) {

        const dirs = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];
        const moves = pieceDirectedMovement(this, getPiece, pos, dirs);

        return moves;

    }

    toString() {
        return `${this.constructor.name}(side=${this.side})`;
    }

}
