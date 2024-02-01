
class Vec2 {

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

}

class Piece {

    /**
    * @param {string} name 
    * @param {'black'|'white'} side 
    */
    constructor(name, side) {
        this.name = name;
        this.side = side;
    }

    /**
     * @param {Array<Array<Piece|undefined>>} board 
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

class PawnPiece extends Piece {

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

class Game {

    constructor() {

        this.rows = 8;
        this.columns = 8;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);
        this.canvas.width = 512;
        this.canvas.height = 512;

        /** @type {Array<Array<Piece|undefined>>} */
        this.board = Array(this.rows).fill(Array(this.columns).fill(undefined));

        /** @type {Array<Piece>} */
        this.outPieces = [];

        this.canvas.addEventListener('click', ());

    }

    setupBoard() {

        this.board[1] = this.board[1].map(_ => new PawnPiece('black'));
        this.board[6] = this.board[6].map(_ => new PawnPiece('white'));



    }

    /**
     * @param {MouseEvent} e
     */
    onClickBoard(e) {
        
    }

    draw() {

        const lightColour = '#afacab';
        const darkColour = '#5f5c5b';

        const boxWidth = this.canvas.width / this.columns;
        const boxHeight = this.canvas.height / this.rows;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.board.forEach((row, rowIndex) => {

            const startY = rowIndex * boxHeight;
            const endY = startY + boxHeight;

            row.forEach((piece, colIndex) => {

                const startX = colIndex * boxWidth;
                const endX = startX + boxWidth;

                this.ctx.fillStyle = ((colIndex + rowIndex) % 2 === 0) ? lightColour : darkColour;
                this.ctx.fillRect(startX, startY, boxWidth, boxHeight);

                this.ctx.fillStyle = '#ffffff';
                this.ctx.fillText(`${piece}`, startX, endY);

            });

        });

    }

    /**
     * @param {Vec2} pos
     * @returns {Piece|undefined}
     */
    getPiece(pos) {

        if (pos.x < 0 || pos.y < 0 || pos.x >= this.columns || pos.y >= this.rows) {
            return undefined;
        }

        return this.board[pos.y][pos.x];

    }

    /**
     * @param {Number} canvasX
     * @param {Number} canvasY
     */
    canvasCoordToGrid(canvasX, canvasY) {
        return new Vec2(Math.floor(canvasX / this.canvas.width * this.columns), Math.floor(canvasY / this.canvas.height * this.rows));
    }

    /**
     * @param {Vec2} oldPos
     * @param {Vec2} newPos
     */
    movePiece(oldPos, newPos) {

        const movingPiece = this.getPiece(oldPos);
        const overwrittenPiece = this.getPiece(newPos);

        if (overwrittenPiece !== undefined) {
            this.outPieces.push(overwrittenPiece);
        }

        this.board[oldPos.y][oldPos.x] = undefined;
        this.board[newPos.y][newPos.x] = movingPiece;

    }


}

function init() {
    
    console.log('kaboom');

    const game = new Game();

    game.setupBoard();
    game.draw();

    const coord = game.canvasCoordToGrid(512 / 8 * 2, 512 / 8 * 1);
    const piece = game.getPiece(coord);

    console.log(piece.toString());

    if (piece !== undefined) {
        console.log(piece.getAvailableMoves(game.getPiece.bind(game), coord.x, coord.y))
    }
}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('DOMContentLoaded', init);
}
