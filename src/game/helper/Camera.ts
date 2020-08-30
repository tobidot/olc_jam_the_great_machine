import p5 from "p5";

export class Camera {
    public position: p5.Vector = new p5.Vector;
    public zoom: number = 1;
    public target_position: p5.Vector = new p5.Vector;
    public target_zoom: number = 1;
    private readonly smooth: number = 0.2;

    public update(dt: number) {
        const diff = p5.Vector.sub(this.target_position, this.position).mult(this.smooth);
        this.position.add(diff);
        this.zoom = this.zoom * (1 - this.smooth) + this.target_zoom * this.smooth;
    }

    public move(off: p5.Vector) {
        this.target_position.add(off);
    }

    public zoom_in() {
        this.target_zoom *= 0.75;
    }
    public zoom_out() {
        this.target_zoom *= 1.5;
    }
}