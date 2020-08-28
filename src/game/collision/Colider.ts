import p5, { Vector } from "p5";

export class Collider {
    protected position: Vector;
    protected size: number;

    constructor(position: Vector, size: number) {
        this.position = position;
        this.size = size;
    }

    public contains(point: Vector): boolean {
        const diff = this.position.sub(point);
        const has_overlap_x = Math.abs(diff.x) < this.size / 2;
        const has_overlap_y = Math.abs(diff.y) < this.size / 2;
        return has_overlap_x && has_overlap_y;
    }
}