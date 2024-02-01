
import { Piece } from '../Piece.js';
import { Vec2 } from '../../util/math/Vec2.js';

export class KnightPiece extends Piece {

    /** @type { { [key in Side]: HTMLImageElement|undefined|ErrorEvent } } */
    static img = {
        black: undefined,
        white: undefined
    };

    /**
    * @param {Side} side 
    */
    constructor(side) {
        super('Knight', side);
    }

    /**
     * @param {(pos: Vec2) => Piece|null|undefined} getPiece
     * @param {Vec2} pos
     * @returns {Array<Vec2>}
     */
    getAvailableMoves(getPiece, pos) {

        /** @type {Array<Vec2>} */
        const possibleMoves = [
            // Vertical
            pos.plus(new Vec2(-1, -2)),
            pos.plus(new Vec2(1, -2)),
            pos.plus(new Vec2(-1, 2)),
            pos.plus(new Vec2(1, 2)),

            // Horizontal
            pos.plus(new Vec2(-2, -1)),
            pos.plus(new Vec2(-2, 1)),
            pos.plus(new Vec2(2, -1)),
            pos.plus(new Vec2(2, 1))
        ];

        const moves = possibleMoves.filter(move => {

            const piece = getPiece(move);

            if (piece === undefined) {
                return false;
            }

            if (piece === null) {
                return true;
            }

            if (piece.side !== this.side) {
                return true;
            }

            return false;

        });

        return moves;

    }

    toString() {
        return `${this.constructor.name}(side=${this.side})`;
    }

}
