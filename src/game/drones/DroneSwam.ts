import p5 from "p5";
import { Drone } from "./Drone";
import { Game } from "../Game";
import { StelarBody } from "../bodies/StellarBody";
import { Camera } from "../helper/Camera";

export class DroneSwarm {
    public readonly game: Game;
    public center: p5.Vector = new p5.Vector;
    public deviation: number = 0;
    private queued_new_drones: Array<p5.Vector> = [];
    private queued_dying_drones: Array<Drone> = [];
    public drones: Array<Drone> = [];

    public level_points: number = 0;
    public level_points_needed: number = 1;
    public level_progress: number = 0;
    public levels = {
        thruster_level: 1,
        stability_level: 1,
        collecting_level: 1,
    }

    constructor(game: Game) {
        this.game = game;
    }

    public update(dt: number, stelar_bodies: Array<StelarBody>) {

        this.deviation = 0;
        let drone_center_sum = new p5.Vector;
        for (let i = 0; i < this.drones.length; ++i) {
            const drone = this.drones[i];
            drone.frame_information.reset();

            for (let j = 0; j < stelar_bodies.length; ++j) {
                const stelar_body = stelar_bodies[j];
                const to_other = p5.Vector.sub(drone.position, stelar_body.get_position());
                const distance2 = to_other.magSq();
                drone.frame_information.add_position_relation({
                    stelar_body: stelar_body,
                    to_other,
                    distance2
                });
            }

            drone.update(dt);
            const dist_to_univers_center = drone.position.magSq();
            if (dist_to_univers_center > this.game.universe_size * this.game.universe_size) {
                drone.position.set(0, 0);
            }

            this.level_progress += 0.01 * dt / this.level_points_needed;

            drone_center_sum.add(drone.position);
            const center_deviation = this.center.copy().sub(drone.position).magSq();
            if (center_deviation > this.deviation) {
                this.deviation = center_deviation;
            }
        }
        this.deviation = Math.sqrt(this.deviation);
        if (this.drones.length > 0) drone_center_sum.mult(1 / this.drones.length);
        this.center.set(drone_center_sum);

        this.queued_new_drones.forEach((pos) => {
            this.drones.push(new Drone(this, pos));
        });
        this.queued_new_drones = [];
        this.queued_dying_drones.forEach((drone) => {
            drone.attached = null;
            const i = this.drones.indexOf(drone);
            this.drones.splice(i, 1);
        });
        this.queued_dying_drones = [];

        while (this.level_progress > 1) {
            this.level_points++;
            this.level_points_needed = this.level_points_needed * 1.5 + 0.1;
            this.level_progress = 0;
        }
    }

    public draw(p: p5, camera: Camera) {
        for (let i = 0; i < this.drones.length; ++i) {
            const drone = this.drones[i];
            if (camera.zoom > 0.25 && this.should_object_be_drawn(drone.position, camera)) {
                drone.draw(p);
            }
        }
    }

    public queue_new_drone(position: p5.Vector) {
        this.queued_new_drones.push(position);
    }

    public queue_dying_drone(drone: Drone) {
        this.queued_dying_drones.push(drone);
    }


    public should_object_be_drawn(pos: p5.Vector, camera: Camera): boolean {
        if (camera.zoom < 0.1) return true;
        const diff = pos.copy().add(camera.position);
        const dist2 = diff.magSq();
        return dist2 < 400 * 400 / (camera.zoom * camera.zoom);
    }

    public get_production_cost(): number {
        return 250;
    }

    public get_impuls_strength(): number {
        const level = Math.floor(this.levels.thruster_level);
        return level * level * 4;
    }

    public get_time_to_dock(): number {
        const level = Math.floor(this.levels.collecting_level);
        return (20 + level) / (4 * level);
    }

    public get_time_to_dig(): number {
        const level = Math.floor(this.levels.collecting_level);
        return (2 + level) / (2 * level);
    }

    public get_drone_weight(): number {
        return 1;
    }

    public get_durability(): number {
        const level = Math.floor(this.levels.stability_level);
        return 80 + level * 10;
    }

}