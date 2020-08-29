import { BodyCell } from "./BodyCell";
import { Collider } from "../collision/Colider";
import p5, { Vector } from "p5";

export class StellarBody extends Collider {
    public static readonly GRAVITATIONAL_CONSTANT = 10;
    public static readonly CELL_MASS = 25;
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

    public calculate_gravitational_force_on(other_mass: number, other_position: p5.Vector): p5.Vector {
        const my_mass = this.size * this.size * StellarBody.CELL_MASS;
        const distance2 = p5.Vector.sub(this.position, other_position).magSq();
        const force_maginitude = StellarBody.GRAVITATIONAL_CONSTANT * my_mass * other_mass / distance2;
        const force_direction = p5.Vector.sub(this.position, other_position);
        return force_direction.setMag(force_maginitude);
    }

    public get_position(): p5.Vector {
        return this.position;
    }

}