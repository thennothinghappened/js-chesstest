
import { Piece } from '../Piece.js';
import { Vec2 } from '../../util/math/Vec2.js';

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

        /** @type {Array<Vec2>} */
        const moves = [];
        const dirs = [new Vec2(-1, -1), new Vec2(1, -1), new Vec2(1, 1), new Vec2(-1, 1)];

        dirs.forEach(dir => {
            
            let offset = pos;

            while (true) {
                offset = offset.plus(dir);
                const piece = getPiece(offset);

                if (piece !== null) {
                    if (piece instanceof Piece && piece.side !== this.side) {
                        moves.push(offset);
                    }

                    break;
                }

                moves.push(offset);
            }

        });

        return moves;

    }

    toString() {
        return `${this.constructor.name}(side=${this.side})`;
    }

}