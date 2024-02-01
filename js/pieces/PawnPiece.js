
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
     * @param {(pos: Vec2) => Piece|undefined} getPiece
     * @param {Number} x
     * @param {Number} y 
     * @returns {Array<Vec2>}
     */
    getAvailableMoves(getPiece, x, y) {

        const moves = [];
        
        const dir = this.getDir();

        const ahead = new Vec2(x, y + dir);

        if (getPiece(ahead) === undefined) {
            moves.push(ahead);
        }

        // First turn can move two spaces.
        if (!this.moved) {
            
            const doubleAhead = new Vec2(x, y + dir * 2);

            if (getPiece(doubleAhead) === undefined) {
                moves.push(doubleAhead);
            }

        }

        const leftAhead = new Vec2(x - 1, y + dir);
        const leftAheadPiece = getPiece(leftAhead);
        
        if (leftAheadPiece !== undefined && leftAheadPiece.side !== this.side) {
            moves.push(leftAhead);
        }

        const rightAhead = new Vec2(x + 1, y + dir);
        const rightAheadPiece = getPiece(rightAhead);
        
        if (rightAheadPiece !== undefined && rightAheadPiece.side !== this.side) {
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
     * @param {Number} oldX 
     * @param {Number} oldY 
     * @param {Number} x 
     * @param {Number} y 
     */
    onMove(oldX, oldY, x, y) {
        this.moved = true;
    }

    toString() {
        return `${this.constructor.name}(side=${this.side}, moved=${this.moved})`;
    }

}
