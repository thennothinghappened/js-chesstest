
export class Vec2 {

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
    * @param {Vec2} other 
    */
    equals(other) {
        return other.x === this.x && other.y === this.y;
    }

    toString() {
        return `${this.constructor.name}(x=${this.x}, y=${this.y})`;
    }

}

