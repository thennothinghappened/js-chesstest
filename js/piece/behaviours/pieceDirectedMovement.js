
import { Piece } from '/js/piece/Piece.js';
import { Vec2 } from '/js/util/math/Vec2.js';

/**
 * @param {Piece} piece 
 * @param {(pos: Vec2) => Piece|null|undefined} getPiece
 * @param {Vec2} pos
 * @param {Array<Vec2>} dirs 
 * @returns {Array<Vec2>}
 */
export function pieceDirectedMovement(piece, getPiece, pos, dirs) {

    /** @type {Array<Vec2>} */
    const moves = [];

    dirs.forEach(dir => {

        let offset = pos;

        while (true) {
            offset = offset.plus(dir);
            const other = getPiece(offset);

            if (other !== null) {
                if (other instanceof Piece && other.side !== piece.side) {
                    moves.push(offset);
                }

                break;
            }

            moves.push(offset);
        }

    });


    return moves;
}
