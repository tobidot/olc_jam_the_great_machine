import p5 from "p5";
import { GameObject } from "../object/GameObject";
import { DroneFrameInformation } from "./DroneFrameInformation";
import { StelarBody } from "../bodies/StellarBody";
import { DroneAttachmentLink as DroneAttachmentLink } from "./DroneAttachementLink";

export class Drone extends GameObject {
    public static readonly PIXEL_SIZE: number = 5;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND: number = 200;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND__ROOT2: number = Math.sqrt(Drone.LIGHTSPEED_PIXEL_PER_SECOND);
    public frame_information: DroneFrameInformation = new DroneFrameInformation();
    public position: p5.Vector;
    public velocity: p5.Vector;


    public DEBUG_colliding: boolean = false;
    public attached: DroneAttachmentLink | null = null;
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
        if (this.update_when_attached(dt)) {
        } else {
            this.update_when_not_attached(dt);
        }
    }

    public update_when_not_attached(dt: number): boolean {
        this.frame_information.stelar_body_relations.forEach((relation) => {
            if (relation.stelar_body.contains(this.position)) {
                this.DEBUG_colliding = true;
                const cell = relation.stelar_body.get_cell_at_global_coord(this.position);
                if (cell && (cell.attached === null || cell.attached.get_attachement_data() === null)) {
                    const link = new DroneAttachmentLink(this, cell);
                    this.velocity.set(0, 0);
                    this.position.set(relation.stelar_body.translator.global_coord_to_cell_coord.translate_to_source(cell.coord));
                    this.progress = 5;
                } else {
                    // Space for debug
                }
            } else {
            }
            const acting_force = relation.stelar_body.calculate_gravitational_force_on(1, this.position).mult(dt);
            this.apply_force(acting_force);
        });
        if (this.attached === null) {
            this.position.add(p5.Vector.mult(this.velocity, dt));
        }
        return true;
    }

    public update_when_attached(dt: number): boolean {
        if (this.attached === null) return false;
        const attachment_data = this.attached.get_attachement_data();
        if (attachment_data === null) return false;
        const cell = attachment_data.stelar_body_cell;
        this.position.set(attachment_data.stelar_body.translator.global_coord_to_cell_coord.translate_to_source(cell.coord));
        this.progress -= dt;
        if (this.progress < 0) {
            this.attached = null;
            attachment_data.stelar_body.remove_cell_at(cell.coord);
        }
        return true;
    }

    public apply_force(force: p5.Vector) {
        const velocity_sqrt = Math.pow(this.velocity.magSq() + force.magSq(), 0.25);
        const near_lighspeed_modifier = (Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2 - velocity_sqrt)
            / Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2;
        const effective_force = p5.Vector.mult(force, near_lighspeed_modifier);
        this.velocity.add(effective_force).limit(Drone.LIGHTSPEED_PIXEL_PER_SECOND * 0.9);
    }

}