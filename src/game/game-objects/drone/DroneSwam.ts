import p5 from "p5";
import { Drone } from "./Drone";
import { Game } from "../../Game";
import { StelarBody } from "../stelar-bodies/StellarBody";
import { Camera } from "../../helper/Camera";

export class DroneSwarm {
    public readonly game: Game;
    public center: p5.Vector = new p5.Vector;
    public deviation: number = 0;
    private queued_new_drones: Array<{ position: p5.Vector, cb(drone: Drone): void }> = [];
    private queued_dying_drones: Array<Drone> = [];
    public drones: Array<Drone> = [];


    public level_points: number = 0;
    public level_points_needed: number = 1;
    public level_progress: number = 0;
    public levels = {
        thruster_level: 1,
        stability_level: 1,
        collecting_level: 1000,
    }

    constructor(game: Game) {
        this.game = game;
    }

    public update(dt: number) {

        this.deviation = 0;
        let drone_center_sum = new p5.Vector;
        for (let i = 0; i < this.drones.length; ++i) {
            const drone = this.drones[i];
            if (drone.components.collider === undefined) throw new Error();
            drone.frame_information.reset();

            const possible_collisions = this.game.game_object_tree.pick(drone.components.collider.rect);
            for (let j = 0; j < possible_collisions.length; ++j) {
                const stelar_body = possible_collisions[j];
                if (stelar_body instanceof StelarBody) {
                    if (stelar_body.components.collider === undefined) throw new Error();
                    const to_other = p5.Vector.sub(drone.components.collider.cached.position_center.get(), stelar_body.components.collider.cached.position_center.get());
                    const distance2 = to_other.magSq();
                    drone.frame_information.add_position_relation({
                        stelar_body: stelar_body,
                        to_other,
                        distance2
                    });
                }
            }

            drone.update(dt);

            this.level_progress += 0.01 * dt / this.level_points_needed;

            drone_center_sum.add(drone.components.collider.cached.position_center.get());
            const center_deviation = this.center.copy().sub(drone.components.collider.cached.position_center.get()).magSq();
            if (center_deviation > this.deviation) {
                this.deviation = center_deviation;
            }
        }
        this.deviation = Math.sqrt(this.deviation);
        if (this.drones.length > 0) drone_center_sum.mult(1 / this.drones.length);
        this.center.set(drone_center_sum);

        this.queued_new_drones.forEach((data) => {
            const drone = new Drone(this.game, this, data.position);
            data.cb(drone);
            this.drones.push(drone);
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
            if (drone.components.collider === undefined) throw new Error();
            if (camera.zoom > 0.25 && this.should_object_be_drawn(drone.components.collider.cached.position_center.get(), camera)) {
                drone.draw(p);
            }
        }
    }

    public queue_new_drone(position: p5.Vector, cb) {
        if (this.drones.filter((drone) => drone !== null).length < 600) this.queued_new_drones.push({ position, cb });
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
        return 500;
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
        return 120 + level * 10;
    }

}