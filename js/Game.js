
import { Vec2 } from './util/math/Vec2.js';
import { Piece } from './piece/Piece.js';
import { PawnPiece } from './piece/pieces/PawnPiece.js';
import { RookPiece } from './piece/pieces/RookPiece.js';
import { BishopPiece } from './piece/pieces/BishopPiece.js';
import { pieceList } from '/js/piece/pieceList.js';
import { KnightPiece } from '/js/piece/pieces/KnightPiece.js';
import { QueenPiece } from './piece/pieces/QueenPiece.js';

/**
 * @typedef GameStateHandler
 * @prop {() => void} enter
 * @prop {() => GameState} update
 * @prop {() => void} exit
 * @prop {() => void} draw
 */

export class Game {

    /** @type {HTMLCanvasElement} */
    canvas;

    /** @type {CanvasRenderingContext2D} */
    ctx;

    /** @type {GameState} */
    gameState = 'init';

    /** @type {Side} */
    turn = 'white';

    mouseX = 0;
    mouseY = 0;

    mouseJustPressed = false;
    mouseJustReleased = false;
    mouseDown = false;

    /** @type {Vec2?} */
    selectedPiecePos = null;

    /** @type { { [key in GameState]: GameStateHandler } } */
    stateHandlers = {
        init: {
            enter: () => {

                this.board[1] = this.board[1].map(() => new PawnPiece('black'));
                this.board[6] = this.board[6].map(() => new PawnPiece('white'));
                
                this.board[0] = [new RookPiece('black'), new KnightPiece('black'), new BishopPiece('black'), null, new QueenPiece('black'), new BishopPiece('black'), new KnightPiece('black'), new RookPiece('black')];
                this.board[7] = [new RookPiece('white'), new KnightPiece('white'), new BishopPiece('white'), null, new QueenPiece('white'), new BishopPiece('white'), new KnightPiece('white'), new RookPiece('white')];

            },
            update: () => {
                return 'none';
            },
            exit: () => {
                
            },
            draw: () => {

            }
        },
        none: {
            enter: () => {

            },
            update: () => {

                if (!this.mouseJustPressed) {
                    return 'none';
                }

                const mouseBoardPos = this.canvasCoordToGrid(this.mouseX, this.mouseY);
                const mouseBoardPiece = this.getPiece(mouseBoardPos);

                if (!(mouseBoardPiece instanceof Piece)) {
                    return 'none';
                }

                if (mouseBoardPiece.side !== this.turn) {
                    return 'none';
                }

                this.selectedPiecePos = mouseBoardPos;

                return 'piece_selected';
                
            },
            exit: () => {

            },
            draw: () => {
                this.drawClear();
                this.drawBoard();
            }
        },
        piece_selected: {
            enter: () => {

            },
            update: () => {

                if (!this.mouseJustPressed) {
                    return 'piece_selected';
                }

                if (this.selectedPiecePos === null) {
                    throw 'Invalid state! No piece position selected.';
                }

                const selectedPiece = this.getPiece(this.selectedPiecePos);

                if (!(selectedPiece instanceof Piece)) {
                    throw `Invalid state! Expected piece at position ${this.selectedPiecePos}, found ${selectedPiece}`;
                }

                const mouseBoardPos = this.canvasCoordToGrid(this.mouseX, this.mouseY);

                const moves = selectedPiece.getAvailableMoves(this.getPiece, this.selectedPiecePos);
                const move = moves.find((m) => mouseBoardPos.equals(m));
                
                if (move === undefined) {
                    return 'none';
                }

                this.movePiece(this.selectedPiecePos, move);
                this.switchTurn();

                return 'none';

            },
            exit: () => {
                this.selectedPiecePos = null;
            },
            draw: () => {

                const selectedColour = 'rgba(225, 140, 190, 0.6)';
                const movePosColour = 'rgba(180, 250, 180, 0.6)';

                if (this.selectedPiecePos === null) {
                    throw 'Invalid state! No piece position selected.';
                }

                const selectedPiece = this.getPiece(this.selectedPiecePos);

                if (!(selectedPiece instanceof Piece)) {
                    throw `Invalid state! Expected piece at position ${this.selectedPiecePos}, found ${selectedPiece}`;
                }
                
                this.drawClear();
                this.drawBoard();
                
                const startX = this.selectedPiecePos.x * this.drawnBoxWidth;
                const startY = this.selectedPiecePos.y * this.drawnBoxHeight;
    
                this.ctx.fillStyle = selectedColour;
                this.ctx.fillRect(startX, startY, this.drawnBoxWidth, this.drawnBoxHeight);
    
                const moves = selectedPiece.getAvailableMoves(this.getPiece, this.selectedPiecePos);
    
                this.ctx.fillStyle = movePosColour;
    
                moves.forEach((pos) => {
    
                    const startX = pos.x * this.drawnBoxWidth;
                    const startY = pos.y * this.drawnBoxHeight;
    
                    this.ctx.fillRect(startX, startY, this.drawnBoxHeight, this.drawnBoxWidth);
    
                });
        
            }
        }
    };

    constructor() {

        this.rows = 8;
        this.columns = 8;

        this.canvas = document.createElement('canvas');
        
        const ctx = this.canvas.getContext('2d');

        if (ctx === null) {
            throw 'Failed to acquire 2D context!';
        }

        this.ctx = ctx;

        document.body.appendChild(this.canvas);
        this.canvas.width = 512;
        this.canvas.height = 512;

        /** @type {Array<Array<Piece?>>} */
        this.board = Array(this.rows)
            .fill(undefined)
            .map(_ => Array(this.columns).fill(null));

        /** @type {Array<Piece>} */
        this.outPieces = [];

        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mousemove', this.onMouseMove);

        /** @type { { [key in Side]: HTMLImageElement } } */
        this.fallbackImgs = {
            black: new Image(),
            white: new Image()
        };

        this.fallbackImgs.black.src = Piece.getImageFilename(new Piece('Fallback', 'black'));
        this.fallbackImgs.white.src = Piece.getImageFilename(new Piece('Fallback', 'white'));

        pieceList.forEach(PieceType => {
            PieceType.loadImage(new PieceType('black'));
            PieceType.loadImage(new PieceType('white'));
        });

        this.stateHandlers[this.gameState].enter();

    }

    update = () => {

        const handler = this.stateHandlers[this.gameState];

        handler.draw();
        const nextState = handler.update();

        if (nextState !== this.gameState) {

            console.debug(`Switching state: ${this.gameState} -> ${nextState}`);
            
            const nextHandler = this.stateHandlers[nextState];

            handler.exit();
            nextHandler.enter();

            this.gameState = nextState;
        }

        requestAnimationFrame(this.update);

    }

    /**
     * Switch which player's turn it is!
     */
    switchTurn() {
        if (this.turn === 'black') {

            this.turn = 'white';
            return;
        }

        this.turn = 'black';
    }

    /**
     * @param {MouseEvent} ev
     */
    onMouseDown = (ev) => {

        this.mouseDown = true;
        this.mouseJustPressed = true;
        this.update();
        this.mouseJustPressed = false;

    }

    /**
     * @param {MouseEvent} ev
     */
    onMouseUp = (ev) => {

        this.mouseDown = false;
        this.mouseJustReleased = true;
        this.update();
        this.mouseJustReleased = false;

    }

    /**
     * @param {MouseEvent} ev
     */
    onMouseMove = (ev) => {

        const boundingRect = this.canvas.getBoundingClientRect();

        this.mouseX = ev.clientX - boundingRect.left;
        this.mouseY = ev.clientY - boundingRect.top;

    }

    drawClear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBoard() {

        const lightColour = '#afacab';
        const darkColour = '#5f5c5b';

        this.ctx.imageSmoothingEnabled = false;

        this.board.forEach((row, rowIndex) => {

            const startY = rowIndex * this.drawnBoxHeight;
            const endY = startY + this.drawnBoxHeight;

            row.forEach((piece, colIndex) => {

                const startX = colIndex * this.drawnBoxWidth;
                const endX = startX + this.drawnBoxWidth;

                this.ctx.fillStyle = ((colIndex + rowIndex) % 2 === 0) ? lightColour : darkColour;
                this.ctx.fillRect(startX, startY, this.drawnBoxWidth, this.drawnBoxHeight);

                if (!(piece instanceof Piece)) {
                    return;
                }

                let img = piece.constructor.img[piece.side];
                
                if (!(img instanceof HTMLImageElement)) {
                    img = this.fallbackImgs[piece.side];
                }

                this.ctx.drawImage(img, startX, startY, this.drawnBoxWidth, this.drawnBoxHeight);

            });

        });

    }

    get drawnBoxWidth() {
        return this.canvas.width / this.columns;
    }

    get drawnBoxHeight() {
        return this.canvas.height / this.rows;
    }

    /**
     * @param {Vec2} pos
     * @returns {Piece|null|undefined}
     */
    getPiece = (pos) => {

        if (pos.x < 0 || pos.y < 0 || pos.x >= this.columns || pos.y >= this.rows) {
            return undefined;
        }

        return this.board[pos.y][pos.x];

    }

    /**
     * @param {Vec2} pos
     * @param {Piece|null} piece
     */
    setPiece = (pos, piece) => {

        if (pos.x < 0 || pos.y < 0 || pos.x >= this.columns || pos.y >= this.rows) {
            throw `Unable to set piece at position ${pos}!`;
        }

        this.board[pos.y][pos.x] = piece;

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

        if (!(movingPiece instanceof Piece)) {
            throw `Tried to move piece at position ${oldPos}, which isn't a piece!`;
        }

        if (overwrittenPiece instanceof Piece) {
            this.outPieces.push(overwrittenPiece);
        }

        this.setPiece(oldPos, null);
        this.setPiece(newPos, movingPiece);

        movingPiece.onMove(this.getPiece, this.setPiece, oldPos, newPos);

    }


}
