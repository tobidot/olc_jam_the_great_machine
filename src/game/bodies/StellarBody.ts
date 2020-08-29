import { BodyCell } from "./BodyCell";
import { Collider } from "../collision/Colider";
import p5, { Vector } from "p5";

export class StellarBody extends Collider {
    public static readonly GRAVITATIONAL_CONSTANT = 10;
    public static readonly CELL_MASS = 25;
    public static readonly CELL_SIZE = 20;
    public readonly cellmap_size: number;
    private cells: Array<BodyCell>;

    constructor(position: Vector, cellmap_size: number) {
        super(position, cellmap_size * StellarBody.CELL_SIZE);
        this.cellmap_size = cellmap_size;
        this.cells = new Array<BodyCell>(cellmap_size * cellmap_size);
        let i = 0;
        for (let y = 0; y < cellmap_size; ++y) {
            for (let x = 0; x < cellmap_size; ++x) {
                const cell = new BodyCell(new p5.Vector().set(x, y));
                cell.mass = 1;
                this.cells[i] = cell;
                i++;
            }
        }
    }

    public update(dt: number) {

    }

    public draw(p: p5) {
        p.fill(100);
        p.noStroke();
        const size = this.size;
        const hsize = size / 2;
        p.rect(
            this.position.x - hsize,
            this.position.y - hsize,
            size,
            size,
        );
    }

    public calculate_gravitational_force_on(other_mass: number, other_position: p5.Vector): p5.Vector {
        const my_mass = this.cellmap_size * this.cellmap_size * StellarBody.CELL_MASS;
        const distance2 = p5.Vector.sub(this.position, other_position).magSq();
        const force_maginitude = StellarBody.GRAVITATIONAL_CONSTANT * my_mass * other_mass / distance2;
        const force_direction = p5.Vector.sub(this.position, other_position);
        return force_direction.setMag(force_maginitude);
    }

    public get_position(): p5.Vector {
        return this.position;
    }

    public get_cell_at(cell_coord: p5.Vector): BodyCell | null {
        if (!this.contains_cell_coord(cell_coord)) return null;
        const cell_id = cell_coord.x + cell_coord.y * this.cellmap_size;
        return this.cells[cell_id];
    }

    public get_cell_at_global_coord(global_coord: p5.Vector): BodyCell | null {
        const cell_coord = this.global_coord_to_cell_coord(global_coord);
        return this.get_cell_at(cell_coord);
    }

    public cell_coord_to_global_coord(local: p5.Vector): p5.Vector {
        const half_size = this.get_half_cellmap_size();
        return local.copy().sub(half_size, half_size).add(0.5, 0.5).mult(StellarBody.CELL_SIZE).add(this.position);
    }

    public global_coord_to_cell_coord(global: p5.Vector): p5.Vector {
        const half_size = this.get_half_cellmap_size();
        const float_coord = global.copy().sub(this.position).mult(1 / StellarBody.CELL_SIZE).add(half_size, half_size);
        return float_coord.set(Math.floor(float_coord.x), Math.floor(float_coord.y));
    }

    public contains_cell_coord(cell_coord: p5.Vector) {
        return cell_coord.x >= 0 && cell_coord.y >= 0 && cell_coord.x < this.cellmap_size && cell_coord.y < this.cellmap_size;
    }

    public get_half_cellmap_size(): number {
        return this.cellmap_size / 2;
    }
}