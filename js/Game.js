
import { Vec2 } from '/js/util/Vec2.js';
import { Piece } from '/js/Piece.js';
import { PawnPiece } from '/js/pieces/PawnPiece.js';


/** @typedef {'none'|'piece_selected'} GameState */

export class Game {

    /** @type {GameState} */
    gameState = 'none';

    /** @type {Vec2|undefined} */
    selectedBoardPos = undefined;

    /** @type {Array<Vec2>|undefined} */
    currentPieceMoves = undefined;

    constructor() {

        this.rows = 8;
        this.columns = 8;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        document.body.appendChild(this.canvas);
        this.canvas.width = 512;
        this.canvas.height = 512;

        /** @type {Array<Array<Piece|undefined>>} */
        this.board = Array(this.rows)
            .fill(undefined)
            .map(_ => Array(this.columns).fill(undefined));

        /** @type {Array<Piece>} */
        this.outPieces = [];

        this.canvas.addEventListener('click', this.onClickBoard.bind(this));

    }

    setupBoard() {

        this.board[1] = this.board[1].map(_ => new PawnPiece('black'));
        this.board[6] = this.board[6].map(_ => new PawnPiece('white'));

    }

    /**
     * @param {MouseEvent} ev
     */
    onClickBoard(ev) {

        const mouseBoardPos = this.canvasCoordToGrid(ev.clientX, ev.clientY);
        const mouseBoardPiece = this.getPiece(mouseBoardPos);

        switch (this.gameState) {

            case 'none': {
                

                if (mouseBoardPiece === undefined) {
                    this.selectedBoardPos = undefined;
                    this.currentPieceMoves = undefined;
                    return;
                }

                this.selectedBoardPos = mouseBoardPos;
                this.currentPieceMoves = mouseBoardPiece.getAvailableMoves(this.getPiece.bind(this), mouseBoardPos.x, mouseBoardPos.y);

                this.onStateChange('piece_selected');

                return;
            }

            case 'piece_selected': {

                const move = this.currentPieceMoves.find((m) => mouseBoardPos.equals(m));

                if (move === undefined) {
                    this.onStateChange('none');
                    return;
                }

                this.movePiece(this.selectedBoardPos, move);
                this.onStateChange('none');

                return;
            }



        }

    }

    /**
     * @param {GameState} newState 
     */
    onStateChange(newState) {

        // Leave event
        switch (this.gameState) {

            case 'none': {
                break;
            }

            case 'piece_selected': {

                this.selectedBoardPos = undefined;
                this.currentPieceMoves = undefined;

                break;

            }

        }

        // Enter event
        switch (newState) {
                
            case 'none': {
                
                break;

            }

            case 'piece_selected': {

                break;

            }

        }

        this.gameState = newState;

        this.draw();
    }

    draw() {

        const lightColour = '#afacab';
        const darkColour = '#5f5c5b';
        const selectedColour = 'rgba(225, 140, 130, 0.6)';
        const movePosColour = 'rgba(180, 250, 180, 0.6)';

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

                if (piece === undefined) {
                    return;
                }

                this.ctx.fillStyle = (piece.side === 'black') ? '#000000' : '#ffffff';
                this.ctx.fillText(`${piece}`, startX, endY);

            });

        });

        if (this.selectedBoardPos !== undefined) {

            const startX = this.selectedBoardPos.x * boxWidth;
            const startY = this.selectedBoardPos.y * boxHeight;

            this.ctx.fillStyle = selectedColour;
            this.ctx.fillRect(startX, startY, boxWidth, boxHeight);

        }

        if (this.currentPieceMoves !== undefined) {

            this.ctx.fillStyle = movePosColour;
            
            this.currentPieceMoves.forEach((pos) => {

                const startX = pos.x * boxWidth;
                const startY = pos.y * boxHeight;
                
                this.ctx.fillRect(startX, startY, boxWidth, boxHeight);

            });
        }

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

        console.log(movingPiece);

        if (overwrittenPiece !== undefined) {
            this.outPieces.push(overwrittenPiece);
        }

        this.board[oldPos.y][oldPos.x] = undefined;
        this.board[newPos.y][newPos.x] = movingPiece;

        movingPiece.onMove(oldPos.x, oldPos.y, newPos.x, newPos.y);

        console.log(this.board[oldPos.y]);

    }


}
