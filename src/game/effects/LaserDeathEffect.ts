import p5 from "p5";
import { Effect } from "./Effect";
import { Camera } from "../helper/Camera";

export class LaserDeathEffect extends Effect {
    private strength: number = 0;
    public time: number = 0;

    constructor(public source: p5.Vector, public target: p5.Vector, public duration: number, public color: number) {
        super();
    }

    public update(dt: number) {
        this.time += dt;
        const p = this.time / this.duration;
        this.strength = Math.max(1, this.calc_strength(p) * 5);
        this.source.add(this.target.copy().sub(this.source).mult(0.3 * dt));
        if (this.time > this.duration) {
            this.is_finished = true;
        }
    }

    public calc_strength(x: number) {
        return -x * (x - 0.5) * (x * 2 - 1) * 10 + 0.5;
    }

    public draw(p: p5, camera: Camera) {
        const color = p.color(this.color);
        color.setAlpha(this.strength);
        p.noFill();
        p.strokeWeight(this.strength);
        p.color(this.color);
        p.line(this.source.x, this.source.y, this.target.x, this.target.y);
    }
}