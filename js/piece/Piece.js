
import { Vec2 } from '../util/math/Vec2.js';

export class Piece {

    /** @type { { [key in Side]: HTMLImageElement|undefined|ErrorEvent } } */
    static img = {
        black: undefined,
        white: undefined
    };

    /**
    * @param {string} name 
    * @param {Side} side 
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
    getAvailableMoves(getPiece, pos) {
        return [];
    }

    /**
     * Handler for anything special to do once we've moved (ie, change our state.)
     * @param {(pos: Vec2) => Piece|null|undefined} getPiece
     * @param {(pos: Vec2, piece: Piece|null) => void} setPiece
     * @param {Vec2} oldPos
     * @param {Vec2} newPos
     */
    onMove(getPiece, setPiece, oldPos, newPos) {
        return;        
    }

    /**
     * Get the filename of the image for this piece
     * @param {Piece} piece 
     */
    static getImageFilename(piece) {
        return `/assets/pieces/${piece.side}/${piece.name}.png`;
    }

    /**
     * Load the image for this piece
     * @param {Piece} piece 
     */
    static loadImage(piece) {

        const filename = this.getImageFilename(piece);

        const img = new Image();
        
        img.addEventListener('error', (err) => {
            this.img[piece.side] = err;
        });

        img.src = filename;

        this.img[piece.side] = img;

    }

    toString() {
        return `${this.constructor.name}(side=${this.side}, name=${this.name})`;
    }

}
