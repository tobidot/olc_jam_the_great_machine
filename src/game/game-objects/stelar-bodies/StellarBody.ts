import { BodyCell } from "./BodyCell";
import p5, { Vector } from "p5";
import { CoordinateSystem, FixedCenteredIntegerCoordinateSystem } from "../../helper/CoordinatesSystem";
import { DroneAttachmentLink } from "../drone/DroneAttachementLink";
import { Game } from "../../Game";
import { HabitablePlanet } from "./HabitablePlanet";
import { ColliderComponent } from "../components/collision/ColliderComponent";
import { GameObject } from "../base/GameObject";

export class StelarBody extends GameObject {
    // Consts
    public static readonly GRAVITATIONAL_CONSTANT = 1000;
    public static readonly CELL_SIZE = 15;
    //    
    // 
    protected cellmap_size: number;
    protected cells: Array<BodyCell | null>;
    public is_to_delete: boolean = false;
    private frame_buffer: {
        mass_center: { mass: number, center: p5.Vector, global_center: p5.Vector } | null,
    } = {
            mass_center: null
        };

    constructor(game: Game, position: Vector, cellmap_size: number) {
        super(game);
        this.components.collider = new ColliderComponent(this);
        this.components.collider.rect.w = cellmap_size * StelarBody.CELL_SIZE;
        this.components.collider.rect.h = cellmap_size * StelarBody.CELL_SIZE;
        this.components.collider.set_position_center(position);

        this.cellmap_size = cellmap_size;
        this.cells = new Array<BodyCell>(cellmap_size * cellmap_size);
        this.for_each_cell((x, y, cell) => {
            cell = new BodyCell(this, new p5.Vector().set(x, y));
            return cell;
        });
        this.update(0);
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
        if (this.components.collider === undefined) throw new Error();
        if (this.frame_buffer.mass_center) return this.frame_buffer.mass_center;
        if (this.hasOwnProperty('ships')) {
            if ((<any>window).gog) debugger;
        }
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
        const position = this.components.collider?.cached.position_center.get().copy();
        if (mass === 0) return { mass, center, global_center: position };
        center.mult(1 / mass);
        const global_center = this.transform_cells_coordinates_to_global_coordinates(center.copy());
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

    public transform_cells_coordinates_to_global_coordinates(pos: p5.Vector): p5.Vector {
        if (this.components.collider === undefined) throw new Error();
        return pos.mult(StelarBody.CELL_SIZE).add(
            this.components.collider.rect.x + StelarBody.CELL_SIZE / 2,
            this.components.collider.rect.y + StelarBody.CELL_SIZE / 2
        );
    }

    public transform_global_coordinates_to_cells_coordinates(pos: p5.Vector): p5.Vector {
        if (this.components.collider === undefined) throw new Error();
        return pos.sub(this.components.collider.rect.x, this.components.collider.rect.y).mult(1 / StelarBody.CELL_SIZE);
    }

    public before_update() {
        super.before_update();
        this.reset_frame_buffers();
    }

    public update(dt: number) {
        super.update(dt);
    }

    public draw(p: p5) {
        const collider = this.components.collider;
        if (collider === undefined) throw new Error();
        p.fill(100);
        p.noStroke();
        const size = collider.rect.w;
        const hsize = size / 2;
        p.beginShape(p.QUADS);
        const start_x = collider.rect.x;
        const start_y = collider.rect.y;
        this.for_each_cell((x, y, cell) => {
            if (!cell) return cell;
            const left = start_x + x * StelarBody.CELL_SIZE;
            const right = start_x + (1 + x) * StelarBody.CELL_SIZE + 1;
            const top = start_y + y * StelarBody.CELL_SIZE;
            const bottom = start_y + (1 + y) * StelarBody.CELL_SIZE + 1;
            this.before_draw_cell(p, cell);
            p.vertex(left, top);
            p.vertex(right, top);
            p.vertex(right, bottom);
            p.vertex(left, bottom);
            return cell;
        });
        p.endShape();
    }

    public before_draw_cell(p: p5, cell: BodyCell) {
        p.fill(Math.min(200, cell.mass * 5));
    }

    public draw_roughly(p: p5) {
        const collider = this.components.collider;
        if (collider === undefined) throw new Error();
        this.before_draw_roughly(p);
        const start_x = collider.rect.x;
        const start_y = collider.rect.y;
        p.rect(start_x, start_y, collider.rect.w, collider.rect.w);
    }

    public before_draw_roughly(p: p5) {
        p.noStroke();
        const mass = this.get_mass_center().mass;
        const grayscale = Math.min(200, mass * 5 / (this.cellmap_size * this.cellmap_size))
        p.fill(grayscale);
        p.tint(255, grayscale)
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
        const force_maginitude = StelarBody.GRAVITATIONAL_CONSTANT * my_mass * other_mass / Math.max(100, distance2);
        if (distance2 < 0.001) return new p5.Vector().set(0, 0);
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
        const cell_id = Math.floor(cell_coord.x) + Math.floor(cell_coord.y) * this.cellmap_size;
        return cell_id;
    }

    public get_cell_at(cell_coord: p5.Vector): BodyCell | null {
        const cell_id = this.get_cell_id_at(cell_coord);
        if (cell_id === null) return null;
        return this.cells[cell_id];
    }

    public get_cell_at_global_coord(global_coord: p5.Vector): BodyCell | null {
        const cell_coord = this.transform_global_coordinates_to_cells_coordinates(global_coord.copy());
        return this.get_cell_at(cell_coord);
    }

    public contains_cell_coord(cell_coord: p5.Vector) {
        return cell_coord.x >= 0 && cell_coord.y >= 0 && cell_coord.x < this.cellmap_size && cell_coord.y < this.cellmap_size;
    }

    public reset_frame_buffers() {
        // if (this instanceof HabitablePlanet) debugger;
        this.frame_buffer.mass_center = null;
    }
}