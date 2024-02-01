
/**
 * A vector with two components.
 */
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
     * Check if the components of this vector match another.
     * @param {Vec2} other 
     * @returns {Boolean}
     */
    equals(other) {
        return other.x === this.x && other.y === this.y;
    }

    /**
     * Add another Vec2 to this one, returning a new vector.
     * @param {Vec2|Number} other 
     */
    plus(other) {
        if (other instanceof Vec2) {
            return new Vec2(this.x + other.x, this.y + other.y);
        }
        return new Vec2(this.x + other, this.y + other);
    }

    /**
     * Multiply another Vec2 with this one, returning a new vector.
     * @param {Vec2|Number} other 
     */
    multiply(other) {
        if (other instanceof Vec2) {
            return new Vec2(this.x * other.x, this.y * other.y);
        }
        return new Vec2(this.x * other, this.y * other);
    }

    toString() {
        return `${this.constructor.name}(x=${this.x}, y=${this.y})`;
    }

}

