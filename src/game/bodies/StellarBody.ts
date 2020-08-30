import { BodyCell } from "./BodyCell";
import { Collider } from "../collision/Colider";
import p5, { Vector } from "p5";
import { CoordinateSystem, FixedCenteredIntegerCoordinateSystem } from "../helper/CoordinatesSystem";
import { Translator, SameTypeTranslator } from "../helper/Translator";
import { DroneAttachmentLink } from "../drones/DroneAttachementLink";

export class StelarBody extends Collider {
    // Consts
    public static readonly GRAVITATIONAL_CONSTANT = 1000;
    public static readonly CELL_SIZE = 15;
    //    
    // 
    private cellmap_size: number;
    private cells: Array<BodyCell | null>;
    private cells_coordinate_system: FixedCenteredIntegerCoordinateSystem;
    public readonly translator: {
        global_coord_to_cell_coord: SameTypeTranslator<p5.Vector>
    };
    public is_to_delete: boolean = false;
    private frame_buffer: {
        mass_center: { mass: number, center: p5.Vector, global_center: p5.Vector } | null,
    } = {
            mass_center: null
        };

    constructor(position: Vector, cellmap_size: number) {
        super(position, cellmap_size * StelarBody.CELL_SIZE);
        this.cellmap_size = cellmap_size;
        this.cells = new Array<BodyCell>(cellmap_size * cellmap_size);
        this.for_each_cell((x, y, cell) => {
            cell = new BodyCell(this, new p5.Vector().set(x, y));
            return cell;
        });
        this.cells_coordinate_system = new FixedCenteredIntegerCoordinateSystem(
            position.copy().sub(this.size / 2, this.size / 2),
            new p5.Vector().set(StelarBody.CELL_SIZE, 0),
            new p5.Vector().set(0, StelarBody.CELL_SIZE),
        );
        this.translator = {
            global_coord_to_cell_coord: (new CoordinateSystem).create_translator_to(this.cells_coordinate_system)
        };
    }

    public for_each_cell(callback: (x: number, y: number, cell: BodyCell | null) => BodyCell | null) {
        let i = 0;
        for (let y = 0; y < this.cellmap_size; ++y) {
            for (let x = 0; x < this.cellmap_size; ++x) {
                const cell = this.cells[i];
                this.cells[i] = callback(x, y, cell);
                i++;
            }
        }
    }

    public get_mass_center(): { mass: number, center: p5.Vector, global_center: p5.Vector } {
        if (this.frame_buffer.mass_center) return this.frame_buffer.mass_center;
        let mass = 0;
        let center = new p5.Vector();
        let count = 0;
        this.for_each_cell((x, y, cell) => {
            if (cell) {
                mass += cell.mass;
                center.add(x * cell.mass, y * cell.mass);
                count++;
            }
            return cell;
        });
        if (mass === 0) return { mass, center, global_center: this.position.copy() };
        center.mult(1 / mass);
        const global_center = this.translator.global_coord_to_cell_coord.translate_to_source(center);
        return this.frame_buffer.mass_center = {
            mass,
            center,
            global_center,
        };
    }

    public get_cellmap_size(): number {
        return this.cellmap_size;
    }

    public get_half_cellmap_size(): number {
        return this.cellmap_size / 2;
    }

    public get_position(): p5.Vector {
        return this.position.copy();
    }

    public set_position(pos: p5.Vector): void {
        this.cells_coordinate_system.fix.set(pos.copy().sub(this.size / 2, this.size / 2))
        this.position.set(pos);
    }

    public update(dt: number) {
    }

    public draw(p: p5) {
        p.fill(100);
        p.noStroke();
        const size = this.size;
        const hsize = size / 2;
        p.beginShape(p.QUADS);
        const start_x = this.position.x - hsize;
        const start_y = this.position.y - hsize;
        this.for_each_cell((x, y, cell) => {
            if (!cell) return cell;
            const left = start_x + x * StelarBody.CELL_SIZE;
            const right = start_x + (1 + x) * StelarBody.CELL_SIZE + 1;
            const top = start_y + y * StelarBody.CELL_SIZE;
            const bottom = start_y + (1 + y) * StelarBody.CELL_SIZE + 1;
            p.fill(Math.min(200, cell.mass * 5));
            p.vertex(left, top);
            p.vertex(right, top);
            p.vertex(right, bottom);
            p.vertex(left, bottom);
            return cell;
        });
        p.endShape();
    }


    public draw_roughly(p: p5) {
        const mass = this.get_mass_center().mass;
        p.fill(Math.min(200, mass * 5 / (this.cellmap_size * this.cellmap_size)));
        p.noStroke();
        const size = this.size;
        const hsize = size / 2;
        const start_x = this.position.x - hsize;
        const start_y = this.position.y - hsize;
        p.rect(start_x, start_y, size, size);
    }

    public calculate_gravitational_force_on(
        other_mass: number,
        other_position: p5.Vector
    ): p5.Vector {
        const my_mass_data = this.get_mass_center();
        const my_center = my_mass_data.center;
        const distance2 = Math.max(p5.Vector.sub(my_center, other_position).magSq(), this.cellmap_size * this.cellmap_size);
        return this.calculate_gravitational_force_on_relation(
            other_mass,
            my_center.copy().sub(other_position),
            distance2
        );
    }

    public calculate_gravitational_force_on_relation(
        other_mass: number,
        diff_other_to_center: p5.Vector,
        distance2: number
    ): p5.Vector {
        if (distance2 > 500 * 500) return new p5.Vector;
        const my_mass_data = this.get_mass_center();
        const my_mass = my_mass_data.mass;
        const force_maginitude = StelarBody.GRAVITATIONAL_CONSTANT * my_mass * other_mass / distance2;
        if (diff_other_to_center.magSq() < 0.01) return new p5.Vector();
        return diff_other_to_center.setMag(force_maginitude);
    }

    public remove_cell_at(coord: p5.Vector) {
        const cell_id = this.get_cell_id_at(coord);
        if (cell_id === null) throw "Cell at invalid coords";
        const cell = this.cells[cell_id];
        if (cell === null) throw "Cell does not exist";
        cell.attached = null;
        this.cells[cell_id] = null;
        let count = 0;
        this.for_each_cell((x, y, c) => { if (c) count++; return c; });
        if (count === 0) this.is_to_delete = true;
    }

    public get_cell_id_at(cell_coord: p5.Vector): number | null {
        if (!this.contains_cell_coord(cell_coord)) return null;
        const cell_id = cell_coord.x + cell_coord.y * this.cellmap_size;
        return cell_id;
    }

    public get_cell_at(cell_coord: p5.Vector): BodyCell | null {
        const cell_id = this.get_cell_id_at(cell_coord);
        if (cell_id === null) return null;
        return this.cells[cell_id];
    }

    public get_cell_at_global_coord(global_coord: p5.Vector): BodyCell | null {
        const cell_coord = this.translator.global_coord_to_cell_coord.translate(global_coord);
        return this.get_cell_at(cell_coord);
    }

    public contains_cell_coord(cell_coord: p5.Vector) {
        return cell_coord.x >= 0 && cell_coord.y >= 0 && cell_coord.x < this.cellmap_size && cell_coord.y < this.cellmap_size;
    }

    public reset_frame_buffers() {
        this.frame_buffer.mass_center = null;
    }
}