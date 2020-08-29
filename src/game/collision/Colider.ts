import p5, { Vector } from "p5";
import { CollisionInformation } from "./CollisionInformation";
import { GameObject } from "../object/GameObject";

export class Collider extends GameObject {
    protected position: Vector;
    protected size: number;

    constructor(position: Vector, size: number) {
        super();
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