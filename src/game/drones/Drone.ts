import p5 from "p5";
import { GameObject } from "../object/GameObject";
import { DroneFrameInformation } from "./DroneFrameInformation";

export class Drone extends GameObject {
    public static readonly PIXEL_SIZE: number = 5;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND: number = 200;
    public static readonly LIGHTSPEED_PIXEL_PER_SECOND__ROOT2: number = Math.sqrt(Drone.LIGHTSPEED_PIXEL_PER_SECOND);
    public frame_information: DroneFrameInformation = new DroneFrameInformation();
    public position: p5.Vector;
    public velocity: p5.Vector;

    constructor(position: p5.Vector = new p5.Vector) {
        super();
        this.position = position;
        this.velocity = new p5.Vector();
    }

    public draw(p: p5) {
        p.noStroke();
        p.fill(255, 0, 0);
        p.rect(
            this.position.x - Drone.PIXEL_SIZE / 2,
            this.position.y - Drone.PIXEL_SIZE / 2,
            Drone.PIXEL_SIZE,
            Drone.PIXEL_SIZE
        );
    }

    public update(dt: number) {
        this.frame_information.stelar_body_relations.forEach((relation) => {
            const acting_force = relation.stelar_body.calculate_gravitational_force_on(1, this.position).mult(dt);
            this.apply_force(acting_force);
        });
        this.position.add(p5.Vector.mult(this.velocity, dt));
    }

    public apply_force(force: p5.Vector) {
        const velocity_sqrt = Math.pow(this.velocity.magSq() + force.magSq(), 0.25);
        const near_lighspeed_modifier = (Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2 - velocity_sqrt)
            / Drone.LIGHTSPEED_PIXEL_PER_SECOND__ROOT2;
        const effective_force = p5.Vector.mult(force, near_lighspeed_modifier);
        this.velocity.add(effective_force).limit(Drone.LIGHTSPEED_PIXEL_PER_SECOND * 0.9);
    }
}