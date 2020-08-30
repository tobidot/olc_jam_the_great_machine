import p5 from "p5";
import { StelarBody } from "./bodies/StellarBody";
import { Asteroid } from "./bodies/Asteroid";
import { Drone } from "./drones/Drone";
import { Camera } from "./helper/Camera";
import { DroneSwarm } from "./drones/DroneSwam";

export class Game {
    private stellar_bodies: Array<StelarBody> = [];
    private camera: Camera = new Camera;
    private swarm: DroneSwarm = new DroneSwarm(this);

    public readonly universe_size = 5000;
    public readonly universe_density = 0.1;


    constructor() {

    }

    public init(p: p5) {
        const images = require('../assets/images/*.png');

        p.mouseWheel = (event: { delta: number }) => {
            if (event.delta > 0) this.camera.zoom_in();
            if (event.delta < 0) this.camera.zoom_out();
        };
        let prevMouse = new p5.Vector();
        p.mousePressed = () => {
            const x = p.mouseX;
            const y = p.mouseY;
            prevMouse.set(x, y);
        }
        p.mouseDragged = (event) => {
            const x = p.mouseX;
            const y = p.mouseY;
            this.camera.move(prevMouse.copy().sub(x, y).mult(-1 / this.camera.zoom));
            prevMouse.set(x, y);
        }
        p.keyPressed = () => {
            if (p.keyIsDown(32)) this.camera.target(this.swarm.center.mult(-1));
        };

        const universe_size = this.universe_size;
        const universe_max_bodies = universe_size * universe_size / 4000;
        const universe_bodies = universe_max_bodies * this.universe_density;
        const curve = (x: number): number => {
            return 1 - ((x) * (0.4 - x) * (0.9 - x) * 11) - 0.5;
        }
        const dice1 = Math.floor(Math.random() * universe_bodies) + 1;
        const dice2 = Math.floor(Math.random() * universe_bodies) + 1;

        {
            const count = dice1 + dice2;
            for (let i = 0; i < count; ++i) {
                const asteroid = new Asteroid();
                asteroid.set_position(
                    p5.Vector.random2D().mult(curve(Math.random()) * universe_size)
                );

                this.stellar_bodies.push(asteroid);
            }
        }

        {
            const count = 10;
            const center = p5.Vector.random2D().mult((Math.random() * 0.25) * universe_size + 0.6).add(universe_size / 2, universe_size / 2);
            for (let i = 0; i < count; ++i) {
                const off = p5.Vector.random2D().mult(10);
                this.swarm.queue_new_drone(center.copy().add(off));
            }

            const asteroid = new Asteroid(center.copy(), 2);
            this.stellar_bodies.push(asteroid);
            this.camera.target_position.set(this.camera.position.set(center.mult(-1)));
        }
    }

    public update(dt: number, p: p5) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.reset_frame_buffers();
            body.update(dt);
            if (body.is_to_delete) {
                this.stellar_bodies.splice(i, 1);
            }
        }
        this.swarm.update(dt, this.stellar_bodies);

        const cam_speed = 400 / this.camera.zoom;
        if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {
            this.camera.move(new p5.Vector().set(dt * cam_speed, 0));
        }
        if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {
            this.camera.move(new p5.Vector().set(-dt * cam_speed, 0));
        }
        if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {
            this.camera.move(new p5.Vector().set(0, dt * cam_speed));
        }
        if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {
            this.camera.move(new p5.Vector().set(0, -dt * cam_speed));
        }
        this.camera.update(dt);
    }

    public draw(p: p5) {
        p.background(0);
        p.translate(400, 300);
        p.scale(this.camera.zoom);
        p.translate(this.camera.position);
        p.noFill();
        p.stroke(50, 50, 200);
        p.strokeWeight(this.universe_size / 1000);
        p.ellipse(0, 0, this.universe_size * 2, this.universe_size * 2);
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];

            if (this.should_object_be_drawn(body.get_position())) {
                const rough_drawing = this.camera.zoom < 0.5;
                if (rough_drawing) {
                    body.draw_roughly(p);
                } else {
                    body.draw(p);
                }
            }
        }
        this.swarm.draw(p, this.camera);
        if (this.camera.zoom <= .25) {
            p.noStroke();
            p.fill(200, 200, 0);
            p.ellipse(this.swarm.center.x, this.swarm.center.y, 25 / this.camera.zoom, 25 / this.camera.zoom);
            p.noFill();
            p.stroke(200, 0, 0);
            p.strokeWeight(5 / this.camera.zoom);
            p.ellipse(this.swarm.center.x, this.swarm.center.y, this.swarm.deviation * 2, this.swarm.deviation * 2);
        }
    }

    public should_object_be_drawn(pos: p5.Vector): boolean {
        if (this.camera.zoom < 0.1) return true;
        const diff = pos.copy().add(this.camera.position);
        const dist2 = diff.magSq();
        return dist2 < 400 * 400 / (this.camera.zoom * this.camera.zoom);
    }

}