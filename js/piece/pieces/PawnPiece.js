
import { Piece } from '../Piece.js';
import { Vec2 } from '../../util/math/Vec2.js';
import { QueenPiece } from './QueenPiece.js';

export class PawnPiece extends Piece {

    /** @type { { [key in Side]: HTMLImageElement|undefined|ErrorEvent } } */
    static img = {
        black: undefined,
        white: undefined
    };

    moved = false;

    /**
    * @param {Side} side 
    */
    constructor(side) {
        super('Pawn', side);
    }

    /**
     * @param {(pos: Vec2) => Piece|null|undefined} getPiece
     * @param {Vec2} pos
     * @returns {Array<Vec2>}
     */
    getAvailableMoves(getPiece, pos) {

        /** @type {Array<Vec2>} */
        const moves = [];
        const dir = this.dir;

        const ahead = pos.plus(dir);

        if (getPiece(ahead) === null) {
            moves.push(ahead);

            // First turn can move two spaces.
            if (!this.moved) {

                const doubleAhead = pos.plus(dir.multiply(2));

                if (getPiece(doubleAhead) === null) {
                    moves.push(doubleAhead);
                }

            }
        }

        const leftAhead = pos.plus(dir.plus(new Vec2(-1, 0)));
        const leftAheadPiece = getPiece(leftAhead);

        if (leftAheadPiece != null && leftAheadPiece.side !== this.side) {
            moves.push(leftAhead);
        }

        const rightAhead = pos.plus(dir.plus(new Vec2(1, 0)));
        const rightAheadPiece = getPiece(rightAhead);

        if (rightAheadPiece != null && rightAheadPiece.side !== this.side) {
            moves.push(rightAhead);
        }

        return moves;

    }

    get dir() {
        if (this.side == 'black') {
            return new Vec2(0, 1);
        }

        return new Vec2(0, -1);
    }

    /**
     * Handler for anything special to do once we've moved (ie, change our state.)
     * @param {(pos: Vec2) => Piece|null|undefined} getPiece
     * @param {(pos: Vec2, piece: Piece|null) => void} setPiece
     * @param {Vec2} oldPos
     * @param {Vec2} newPos
     */
    onMove(getPiece, setPiece, oldPos, newPos) {

        this.moved = true;
        
        const ahead = newPos.plus(this.dir);
        const aheadPiece = getPiece(ahead);

        if (aheadPiece === undefined) {
            // Reached the end of the board!
            setPiece(newPos, new QueenPiece(this.side));
            return;
        }
        
    }

    toString() {
        return `${this.constructor.name}(side=${this.side}, moved=${this.moved})`;
    }

}
