import p5 from "p5";
import { GameObject } from "../object/GameObject";
import { DroneFrameInformation } from "./DroneFrameInformation";
import { StelarBody } from "../bodies/StellarBody";
import { DroneAttachmentLink as DroneAttachmentLink } from "./DroneAttachementLink";
import { DroneSwarm } from "./DroneSwam";
import { DroneStelarBodyRelation } from "./DronePositionRelation";

export class Drone extends GameObject {
    public static readonly PIXEL_SIZE: number = 5;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND: number = 200;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND__ROOT2: number = Math.sqrt(Drone.LIGHTSPEED_PIXEL_PER_SECOND);
    public frame_information: DroneFrameInformation = new DroneFrameInformation(this);
    public position: p5.Vector;
    public velocity: p5.Vector;
    public swarm_ref: DroneSwarm;

    public DEBUG_colliding: boolean = false;
    public attached: DroneAttachmentLink | null = null;
    public fuels: number = 25;
    public progress: number = 0;
    public duplicate_progress: number = 100;

    constructor(drone_swarm: DroneSwarm, position: p5.Vector = new p5.Vector) {
        super();
        this.position = position;
        this.velocity = new p5.Vector();
        this.swarm_ref = drone_swarm;
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
        this.restrict_velocity();
        if (this.fuels > 25) {
            this.fuels -= dt;
            this.duplicate_progress += dt;
            if (this.duplicate_progress <= 0) {
                this.duplicate_progress = 100;
                this.swarm_ref.queue_new_drone(this.position.copy());
            }
        }
    }

    public update_when_not_attached(dt: number): boolean {
        this.frame_information.stelar_body_relations.forEach((relation) => {
            const is_colliding = relation.stelar_body.contains(this.position);
            if (is_colliding) {
                this.DEBUG_colliding = true;
                if (!this.handle_attach_to_relation(relation)) {
                    const cm_size = relation.stelar_body.get_half_cellmap_size();
                    if (relation.distance2 < cm_size * cm_size) {
                        const acting_force = relation.stelar_body.calculate_gravitational_force_on_relation(
                            1,
                            this.position,
                            relation.distance2
                        ).mult(dt);
                        this.apply_force(acting_force);
                    }
                };
            }
            if (!is_colliding) {
                const acting_force = relation.stelar_body.calculate_gravitational_force_on(1, this.position).mult(dt);
                this.apply_force(acting_force);
            }
        });
        if (this.attached === null) {
            // drive away from center if possible
            if (this.fuels > 0) {
                const diff = this.position.copy().sub(this.swarm_ref.center.copy());
                const impuls = diff.setMag(this.swarm_ref.get_impuls_strength() * dt);
                this.apply_force(impuls);
                this.fuels -= 1 * dt;
            }
            // if (this.velocity.magSq() > 10000) this.velocity.mult(0.99);
            this.position.add(p5.Vector.mult(this.velocity, dt));
        }
        return true;
    }

    public handle_attach_to_relation(relation: DroneStelarBodyRelation): boolean {
        const cell = relation.stelar_body.get_cell_at_global_coord(this.position);
        if (cell && (cell.attached === null || cell.attached.get_attachement_data() === null)) {
            const link = new DroneAttachmentLink(this, cell);
            this.velocity.set(0, 0);
            this.position.set(relation.stelar_body.translator.global_coord_to_cell_coord.translate_to_source(cell.coord));
            this.progress = 6;
            return true;
        }
        return false;
    }

    public update_when_attached(dt: number): boolean {
        if (this.attached === null) return false;
        const attachment_data = this.attached.get_attachement_data();
        if (attachment_data === null) return false;
        const cell = attachment_data.stelar_body_cell;
        this.position.set(attachment_data.stelar_body.translator.global_coord_to_cell_coord.translate_to_source(cell.coord));
        this.progress -= dt;
        if (this.progress < 0) {
            if (this.attached) {
                const data = this.attached.get_attachement_data();
                if (data) {
                    data.stelar_body_cell.mass--;
                    this.fuels += 50;
                    if (data.stelar_body_cell.mass <= 0) {
                        attachment_data.stelar_body.remove_cell_at(cell.coord);
                    } else {
                        this.progress = 4;
                    }
                }
            }
        }
        return true;
    }

    public apply_force(force: p5.Vector) {
        const half_lightspeed = Drone.LIGHTSPEED_PIXEL_PER_SECOND / 2;
        const velocity2 = this.frame_information.get_velocity2();
        if (velocity2 < half_lightspeed * half_lightspeed) {
            this.velocity.add(force);
            return this.velocity;
        }
        const force_modifier = this.frame_information.get_force_modifier();
        const effective_force = force.copy().mult(force_modifier);
        this.velocity.add(effective_force);
        return this.velocity;
        // .mult(Drone.LIGHTSPEED_PIXEL_PER_SECOND / Math.sqrt(velocity2));
    }

    public calculate_force_modifier() {
        const velocity2 = this.frame_information.get_velocity2();
        const half_lightspeed = Drone.LIGHTSPEED_PIXEL_PER_SECOND / 2;
        if (velocity2 < half_lightspeed * half_lightspeed) return 1;
        const velocity_falloff = Math.pow(velocity2, 0.25);
        const near_lighspeed_modifier = (Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2 - velocity_falloff)
            / Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2;
        return Math.max(0.001, near_lighspeed_modifier);
    }

    public calculate_velocity2(): number {
        return this.velocity.magSq();
    }

    public restrict_velocity() {
        this.velocity.limit(Drone.LIGHTSPEED_PIXEL_PER_SECOND * 0.9);
    }
}