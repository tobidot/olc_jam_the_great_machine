import p5 from "p5";
import { GameObject } from "../object/GameObject";
import { DroneFrameInformation } from "./DroneFrameInformation";
import { StellarBody } from "../bodies/StellarBody";

export class Drone extends GameObject {
    public static readonly PIXEL_SIZE: number = 5;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND: number = 200;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND__ROOT2: number = Math.sqrt(Drone.LIGHTSPEED_PIXEL_PER_SECOND);
    public frame_information: DroneFrameInformation = new DroneFrameInformation();
    public position: p5.Vector;
    public velocity: p5.Vector;


    public DEBUG_colliding: boolean = false;
    public attached_to: StellarBody | null = null;
    public attached_coords: p5.Vector | null = null;
    public progress: number = 0;



    constructor(position: p5.Vector = new p5.Vector) {
        super();
        this.position = position;
        this.velocity = new p5.Vector();
    }

    public draw(p: p5) {
        p.noStroke();
        p.fill(255, 0, 0);
        if (this.DEBUG_colliding) p.fill(0, 255, 0);
        p.rect(
            this.position.x - Drone.PIXEL_SIZE / 2,
            this.position.y - Drone.PIXEL_SIZE / 2,
            Drone.PIXEL_SIZE,
            Drone.PIXEL_SIZE
        );
    }

    public update(dt: number) {
        this.DEBUG_colliding = false;
        if (this.attached_to && this.attached_coords) {
            const cell = this.attached_to.get_cell_at(this.attached_coords);
            if (cell) {
                this.position.set(this.attached_to.cell_coord_to_global_coord(cell.coord));
                this.progress -= dt;
                if (this.progress < 0) {
                    this.attached_to.remove_cell_at(cell.coord);
                }
                // console.log(p5.Vector.sub(this.position, this.attached_to.get_position()));
            } else {
                this.attached_to = null;
                this.attached_coords = null;
            }
        } else {
            this.frame_information.stelar_body_relations.forEach((relation) => {
                const acting_force = relation.stelar_body.calculate_gravitational_force_on(1, this.position).mult(dt);
                this.apply_force(acting_force);
                if (relation.stelar_body.contains(this.position)) {
                    this.DEBUG_colliding = true;
                    const cell = relation.stelar_body.get_cell_at_global_coord(this.position);
                    if (cell && cell.occupied_by === null) {
                        this.attached_to = relation.stelar_body;
                        this.attached_coords = cell.coord;
                        this.velocity.set(0, 0);
                        this.position.set(this.attached_to.cell_coord_to_global_coord(cell.coord));
                        cell.occupied_by = this;
                        this.progress = 5;
                    } else {
                        // Space for debug
                    }
                }
            });
            if (!this.attached_to) {
                this.position.add(p5.Vector.mult(this.velocity, dt));
            }
        }
    }

    public apply_force(force: p5.Vector) {
        const velocity_sqrt = Math.pow(this.velocity.magSq() + force.magSq(), 0.25);
        const near_lighspeed_modifier = (Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2 - velocity_sqrt)
            / Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2;
        const effective_force = p5.Vector.mult(force, near_lighspeed_modifier);
        this.velocity.add(effective_force).limit(Drone.LIGHTSPEED_PIXEL_PER_SECOND * 0.9);
    }
}