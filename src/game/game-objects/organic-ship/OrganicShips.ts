import p5 from "p5";
import { Camera } from "../../helper/Camera";
import { Drone } from "../drone/Drone";
import { Game } from "../../Game";
import { LaserDeathEffect } from "../effects/LaserDeathEffect";
import { GameObject } from "../base/GameObject";
import { ColliderComponent } from "../components/collision/ColliderComponent";

export class OrganicShip extends GameObject {
    private static readonly PIXEL_SIZE = 40;
    public position: p5.Vector;
    private anchor: p5.Vector;
    private velocity: p5.Vector;
    private acceleration: p5.Vector;
    private change_cd: number;
    private destroy_cd: number;
    public radius: number;
    public drones: Array<Drone> = [];

    constructor(game: Game, position: p5.Vector) {
        super(game);

        this.components.collider = new ColliderComponent(this);
        this.components.collider.rect.w = 20;
        this.components.collider.rect.h = 20;
        this.components.collider.set_position_center(position);

        this.radius = 1;
        this.position = position;
        this.anchor = position.copy();
        this.velocity = new p5.Vector;
        this.acceleration = new p5.Vector;
        this.change_cd = 0;
        this.destroy_cd = 0;
    }

    public before_update() {
        super.before_update();
    }

    public update(dt: number) {
        super.update(dt);
        this.position.add(this.velocity.copy().mult(dt));
        this.velocity.add(this.acceleration).mult(0.99);
        if ((this.change_cd -= dt) < 0) {
            this.change_cd = Math.random() * 1 + 1;
            const target = this.anchor.copy().add(p5.Vector.random2D().mult(Math.random() * 125 * this.radius));
            const maginitude = Math.random() * 1.5 + 1.5;
            this.acceleration = target.sub(this.position).setMag(maginitude); // (Math.random() * Math.PI * 2);
        }
        if ((this.destroy_cd -= dt) <= 0) {
            let packet = this.drones.reduce(
                (packet: { drone: Drone, dist2: number } | null, drone: Drone): { drone: Drone, dist2: number } | null => {
                    if (drone.components.collider === undefined) throw new Error();
                    const diff = drone.components.collider.cached.position_center.get().copy().sub(this.position);
                    const dist2 = diff.magSq();
                    if (packet && dist2 > packet.dist2) return packet;
                    if (dist2 > 250 * 250) return packet;

                    return {
                        drone,
                        dist2
                    };
                }, null);
            if (packet) {
                const { drone } = packet;
                if (drone.components.collider === undefined) throw new Error();
                drone.age -= 50;
                this.reset_destroy_cd();
                const color = 0xffff00ff;
                const laser_effect = new LaserDeathEffect(
                    this.position.copy(),
                    drone.components.collider.cached.position_center.get().copy(),
                    0.5,
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
        if (this.game.assets.battleship) {
            const frame_offset = 0;
            p.image(this.game.assets.battleship, this.position.x, this.position.y, 32, 32, frame_offset, 0, 32, 32);
        } else {
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
}