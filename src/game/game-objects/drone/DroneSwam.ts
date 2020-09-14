import p5 from "p5";
import { Drone } from "./Drone";
import { Game } from "../../Game";
import { StelarBody } from "../stelar-bodies/StellarBody";
import { Camera } from "../../helper/Camera";
import { GameObjectComponent } from "../components/base/GameObjectComponent";
import { GameObject } from "../base/GameObject";

export class DroneSwarm {
    public readonly game: Game;
    public center: p5.Vector = new p5.Vector;
    public deviation: number = 0;
    private queued_new_drones: Array<{ position: p5.Vector, cb(drone: Drone): void }> = [];
    private queued_dying_drones: Array<Drone> = [];


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
        let drone_count = 0;
        this.game.game_object_collection.for_all_game_objects((drone: GameObject) => {
            if (drone instanceof Drone === false) return;
            const drone_collider = drone.components.collider;
            if (drone_collider === undefined) return;

            this.level_progress += 0.01 * dt / this.level_points_needed;

            drone_count++;
            drone_center_sum.add(drone_collider.cached.position_center.get());
            const center_deviation = this.center.copy().sub(drone_collider.cached.position_center.get()).magSq();
            if (center_deviation > this.deviation) {
                this.deviation = center_deviation;
            }
        });

        const drones = this.game.game_object_collection.game_objects.filter(go => go instanceof Drone);
        this.deviation = Math.sqrt(this.deviation);
        if (drones.length > 0) drone_center_sum.mult(1 / drone_count);
        this.center.set(drone_center_sum);

        this.queued_new_drones.forEach((data) => {
            const drone = new Drone(this.game, this, data.position);
            data.cb(drone);
            this.game.game_object_collection.add(drone);
        });
        this.queued_new_drones = [];
        this.queued_dying_drones.forEach((drone) => {
            drone.attached = null;
            this.game.game_object_collection.remove(drone);
        });
        this.queued_dying_drones = [];

        while (this.level_progress > 1) {
            this.level_points++;
            this.level_points_needed = this.level_points_needed * 1.5 + 0.1;
            this.level_progress = 0;
        }
    }

    public draw(p: p5, camera: Camera) {
    }

    public queue_new_drone(position: p5.Vector, cb) {
        const drones_count = this.game.game_object_collection.game_objects.filter(go => go instanceof Drone).length;
        if (drones_count < 600) this.queued_new_drones.push({ position, cb });
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