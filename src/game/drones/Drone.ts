import p5 from "p5";

export class Drone {
    public static readonly pixel_size: number = 5;
    public position: p5.Vector;
    public velocity: p5.Vector;

    constructor(position: p5.Vector = new p5.Vector) {
        this.position = position;
        this.velocity = new p5.Vector();
    }

    public draw(p: p5) {
        p.noStroke();
        p.fill(255, 0, 0);
        p.rect(
            this.position.x - Drone.pixel_size / 2,
            this.position.y - Drone.pixel_size / 2,
            Drone.pixel_size,
            Drone.pixel_size
        );
    }

    public update(dt: number) {
        this.position.add(p5.Vector.mult(this.velocity, dt));
    }
}