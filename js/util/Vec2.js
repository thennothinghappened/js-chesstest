
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

    /**
    * @param {Vec2} other 
    */
    plus(other) {
        return new Vec2(this.x + other.x, this.y + other.y);
    }

    /**
    * @param {Vec2} other 
    */
    multiply(other) {
        return new Vec2(this.x * other.x, this.y * other.y);
    }

    toString() {
        return `${this.constructor.name}(x=${this.x}, y=${this.y})`;
    }

}

