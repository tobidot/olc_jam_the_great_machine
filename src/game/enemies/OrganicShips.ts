import p5 from "p5";
import { Camera } from "../helper/Camera";
import { Drone } from "../drones/Drone";
import { Game } from "../Game";
import { LaserDeathEffect } from "../effects/LaserDeathEffect";
import { GameObject } from "../object/GameObject";
import { ColliderObject } from "../collision/Colider";

export class OrganicShip extends ColliderObject {
    private static readonly PIXEL_SIZE = 40;
    public position: p5.Vector;
    private velocity: p5.Vector;
    private rotation: number;
    private change_cd: number;
    private destroy_cd: number;

    constructor(game: Game, position: p5.Vector) {
        super(game, {
            x: position.x,
            y: position.y,
            w: 20,
            h: 20,
        });
        this.position = position;
        this.velocity = new p5.Vector;
        this.rotation = Math.random() * Math.PI + 2;
        this.change_cd = Math.random() * 5;
        this.destroy_cd = 0;
    }

    public update(dt: number, p: p5, drones: Array<Drone>) {
        this.position.add(this.velocity.copy().mult(dt));
        const project_ahead = this.velocity.copy().setMag(25);
        const rotation_offset = p5.Vector.fromAngle(this.rotation, 25);
        const force = project_ahead.add(rotation_offset).mult(dt);
        this.velocity.add(force).mult(0.99);
        if ((this.change_cd -= dt) < 0) {
            this.change_cd = Math.random() * 5;
            this.rotation = (Math.random() * Math.PI * 2);
        }
        if ((this.destroy_cd -= dt) <= 0) {
            let packet = drones.reduce(
                (packet: { drone: Drone, dist2: number } | null, drone: Drone): { drone: Drone, dist2: number } | null => {
                    const diff = drone.get_position().copy().sub(this.position);
                    const dist2 = diff.magSq();
                    if (packet && dist2 > packet.dist2) return packet;
                    if (dist2 > 800 * 800) return packet;

                    return {
                        drone,
                        dist2
                    };
                }, null);
            if (packet) {
                const { drone } = packet;
                drone.age -= 50;
                this.reset_destroy_cd();
                const color = 0xff0000ff;
                const laser_effect = new LaserDeathEffect(
                    this.position.copy(),
                    drone.get_position().copy(),
                    5,
                    color
                );
                this.game.add_effect(laser_effect);
            }
        }
    }

    public reset_destroy_cd() {
        this.destroy_cd = 1;
    }

    public draw(p: p5, camera: Camera) {
        p.stroke(70, 0, 250);
        p.fill(0, 200, 0);
        const size = OrganicShip.PIXEL_SIZE / Math.max(0.125, Math.sqrt(camera.zoom));
        const half_size = size / 2;
        p.strokeWeight(size / 10);
        p.ellipse(
            this.position.x,
            this.position.y,
            size,
            size,
        );

    }
}