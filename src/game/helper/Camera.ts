import p5 from "p5";

export class Camera {
    public position: p5.Vector = new p5.Vector;
    public zoom: number = 1;
    public target_position: p5.Vector = new p5.Vector;
    public target_zoom: number = 1;

    public update(dt: number) {
        const diff = p5.Vector.sub(this.target_position, this.position).mult(Math.min(1, 0.9 * (dt * 60)));
        this.position.add(diff);
        this.zoom = this.zoom * 0.1 + this.target_zoom * 0.9;
    }

    public move(off: p5.Vector) {
        this.target_position.add(off);
    }

    public zoom_in() {
        this.target_zoom *= 0.5;
    }
    public zoom_out() {
        this.target_zoom *= 2;
    }
}