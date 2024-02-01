
import { Piece } from '/js/Piece.js';
import { Vec2 } from '/js/util/Vec2.js';

export class PawnPiece extends Piece {

    moved = false;

    /**
    * @param {'black'|'white'} side 
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

        const moves = [];
        
        const dir = this.getDir();

        const ahead = new Vec2(pos.x, pos.y + dir);

        if (getPiece(ahead) === null) {
            moves.push(ahead);

            // First turn can move two spaces.
            if (!this.moved) {

                const doubleAhead = new Vec2(pos.x, pos.y + dir * 2);

                if (getPiece(doubleAhead) === null) {
                    moves.push(doubleAhead);
                }

            }
        }

        const leftAhead = new Vec2(pos.x - 1, pos.y + dir);
        const leftAheadPiece = getPiece(leftAhead);

        if (leftAheadPiece != null && leftAheadPiece.side !== this.side) {
            moves.push(leftAhead);
        }

        const rightAhead = new Vec2(pos.x + 1, pos.y + dir);
        const rightAheadPiece = getPiece(rightAhead);

        if (rightAheadPiece != null && rightAheadPiece.side !== this.side) {
            moves.push(rightAhead);
        }

        return moves;

    }

    getDir() {
        if (this.side == 'black') {
            return 1;
        }
        return -1;
    }

    /**
     * Handler for anything special to do once we've moved (ie, change our state.)
     * @param {Vec2} oldPos
     * @param {Vec2} newPos
     */
    onMove(oldPos, newPos) {
        this.moved = true;
    }

    toString() {
        return `${this.constructor.name}(side=${this.side}, moved=${this.moved})`;
    }

}
