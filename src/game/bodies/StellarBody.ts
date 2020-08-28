import { BodyCell } from "./BodyCell";
import { Collider } from "../collision/Colider";
import p5, { Vector } from "p5";

export class StellarBody extends Collider {
    public readonly size: number;
    private cells: Array<BodyCell>;

    constructor(position: Vector, size: number) {
        super(position, size);
        this.size = size;
        this.cells = new Array<BodyCell>(size * size);
    }

    public update(dt: number) {

    }

    public draw(p: p5) {
        p.fill(100);
        p.noStroke();
        p.rect(
            this.position.x - this.size / 2,
            this.position.y - this.size / 2,
            this.size,
            this.size,
        );
    }

}