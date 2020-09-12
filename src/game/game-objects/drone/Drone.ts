import p5 from "p5";
import { GameObject } from "../base/GameObject";
import { DroneFrameInformation } from "./DroneFrameInformation";
import { StelarBody } from "../stelar-bodies/StellarBody";
import { DroneAttachmentLink as DroneAttachmentLink } from "./DroneAttachementLink";
import { DroneSwarm } from "./DroneSwam";
import { DroneStelarBodyRelation } from "./DronePositionRelation";
import { Game } from "../../Game";
import { ColliderObject } from "../components/collision/Collider";
import { helper } from "../../tools/Rect";

export class Drone extends ColliderObject {
    public static readonly PIXEL_SIZE: number = 8;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND: number = 200;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND__ROOT2: number = Math.sqrt(Drone.LIGHTSPEED_PIXEL_PER_SECOND);


    public parent: Drone | null = null;
    public target: p5.Vector = new p5.Vector;
    public cd_update_aim: number = 0;
    public update_aim_rotate: number = 0;

    public frame_information: DroneFrameInformation = new DroneFrameInformation(this);
    public velocity: p5.Vector;
    public swarm_ref: DroneSwarm;

    public DEBUG_colliding: boolean = false;
    public attached: DroneAttachmentLink | null = null;
    public fuels: number = 5;
    public progress: number = 0;
    public duplicate_progress: number = 100;
    public age: number = 0;
    public animation_step: number = 0;
    public animation_max_step: number = 160;
    public frame = 0;
    public frames = {
        0: 0,
        8: 1,
        16: 2,
        24: 3,
        32: 4,
        40: 5,
        48: 6,
        56: 7,
        80: 5,
        88: 6,
        96: 5,
        104: 4,
        112: 3,
        120: 2,
        128: 1,
        136: 0,
    }

    constructor(game: Game, drone_swarm: DroneSwarm, position: p5.Vector = new p5.Vector) {
        super(game, {
            x: position.x,
            y: position.y,
            w: Drone.PIXEL_SIZE,
            h: Drone.PIXEL_SIZE,
        });
        this.velocity = new p5.Vector();
        this.swarm_ref = drone_swarm;
        this.duplicate_progress = drone_swarm.get_production_cost();
        this.age = this.swarm_ref.get_durability();
        this.target = this.get_position();
        this.update_aim_rotate = Math.floor(Math.random() * 8);
    }

    public draw(p: p5) {
        if (!this.attached) this.animation_step = 0;
        if (this.game.assets.drone_idle_sheet) {
            this.animation_step++;
            if (this.animation_step >= this.animation_max_step) {
                this.animation_step = 0;
            }
            if (this.frames[this.animation_step]) {
                this.frame = this.frames[this.animation_step];
            }
            const frame_offset = this.frame * 8;
            p.image(this.game.assets.drone_idle_sheet, this.x, this.y, 8, 8, frame_offset, 0, 8, 8);
        } else {
            p.noStroke();
            p.fill(255, 0, 0);
            // if (this.DEBUG_colliding) p.fill(0, 255, 0);
            p.rect(
                this.x,
                this.y,
                Drone.PIXEL_SIZE,
                Drone.PIXEL_SIZE
            );
        }
    }

    public update(dt: number) {
        this.DEBUG_colliding = false;
        if (this.update_when_attached(dt)) {
        } else {
            this.update_when_not_attached(dt);
        }
        // clone yourself
        if (this.fuels > 25) {
            const progress = dt * 25;
            this.fuels -= progress;
            this.duplicate_progress -= progress;
            if (this.duplicate_progress <= 0) {
                this.duplicate_progress = this.swarm_ref.get_production_cost();
                this.swarm_ref.queue_new_drone(this.get_position().copy(), (drone: Drone) => {
                    drone.parent = this;
                });
            }
        }
        const control_modifier = this.game.control.distance / 1000 + this.game.control.speed / 100;
        this.age -= dt * control_modifier;
        if (this.age < 0) {
            this.swarm_ref.queue_dying_drone(this);
        }
    }

    public update_when_not_attached(dt: number): boolean {
        this.frame_information.stelar_body_relations.forEach((relation) => {
            const is_colliding = helper.rect.overlap(relation.stelar_body, this);
            if (is_colliding) {
                this.DEBUG_colliding = true;
                if (!this.handle_attach_to_relation(relation)) {
                };
            }
        });
        if (this.attached === null) {
            const diff = this.target.copy().sub(this.x, this.y)
            if ((this.cd_update_aim-- < 0 && diff.magSq() < 10000)) {
                this.cd_update_aim = 30;
                let target = new p5.Vector;
                if (this.parent && this.parent.state.is_to_delete === false) {
                    target = this.parent.get_position().copy();
                } else {
                    const control_offset = this.game.control.offset.copy().mult(50 * Math.sqrt(this.game.control.speed));
                    target = this.swarm_ref.center.copy().add(control_offset);
                }
                const off = p5.Vector.fromAngle((this.update_aim_rotate++) * Math.PI / 4).mult(this.game.control.distance);
                this.target = p5.Vector.add(target, off);
            }
            const wanted_velocity = diff.setMag(this.game.control.speed);
            this.velocity.lerp(wanted_velocity, 0.01);
            this.move(p5.Vector.mult(this.velocity, dt));

        }
        return true;
    }

    public handle_attach_to_relation(relation: DroneStelarBodyRelation): boolean {
        const cell = relation.stelar_body.get_cell_at_global_coord(this.get_position());
        if (cell && (cell.attached === null || cell.attached.get_attachement_data() === null)) {
            const link = new DroneAttachmentLink(this, cell);
            this.velocity.set(0, 0);
            this.set_position(relation.stelar_body.transform_cells_coordinates_to_global_coordinates(cell.coord.copy()));
            this.progress = this.swarm_ref.get_time_to_dock();
            return true;
        }
        return false;
    }

    public update_when_attached(dt: number): boolean {
        if (this.attached === null) return false;
        const attachment_data = this.attached.get_attachement_data();
        if (attachment_data === null) return false;
        const cell = attachment_data.stelar_body_cell;
        this.set_position(attachment_data.stelar_body.transform_cells_coordinates_to_global_coordinates(cell.coord.copy()));
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
                        this.progress = this.swarm_ref.get_time_to_dig();
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