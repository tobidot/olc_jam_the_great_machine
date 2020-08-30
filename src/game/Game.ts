import p5 from "p5";
import { StelarBody } from "./bodies/StellarBody";
import { Asteroid } from "./bodies/Asteroid";
import { Drone } from "./drones/Drone";
import { Camera } from "./helper/Camera";

export class Game {
    private stellar_bodies: Array<StelarBody> = [];
    private drones: Array<Drone> = [];
    private camera: Camera = new Camera;

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

        const universe_size = 500;
        const count = Math.floor(Math.random() * 20) + 5
        for (let i = 0; i < count; ++i) {
            const asteroid = new Asteroid();
            asteroid.set_position(
                p5.Vector.random2D().mult(Math.random() * universe_size).add(universe_size / 2, universe_size / 2)
            );

            this.stellar_bodies.push(asteroid);
        }

        {
            const count = 5;
            const center = p5.Vector.random2D().mult(Math.random() * universe_size).add(universe_size / 2, universe_size / 2);
            for (let i = 0; i < count; ++i) {
                const drone = new Drone();
                const off = p5.Vector.random2D().mult(10);
                drone.position.set(center.copy().add(off));
                drone.velocity.set(p5.Vector.random2D().mult(Math.random() * 25));
                this.drones.push(drone);
            }
        }
    }

    public update(dt: number, p: p5) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.update(dt);
            if (body.is_to_delete) {
                this.stellar_bodies.splice(i, 1);
            }
        }
        for (let i = 0; i < this.drones.length; ++i) {
            const drone = this.drones[i];
            drone.frame_information.reset();
            for (let j = 0; j < this.stellar_bodies.length; ++j) {
                const stelar_body = this.stellar_bodies[j];
                const to_other = p5.Vector.sub(drone.position, stelar_body.get_position());
                const distance2 = to_other.magSq();
                drone.frame_information.add_position_relation({
                    stelar_body: stelar_body,
                    to_other,
                    distance2
                });
            }
            drone.update(dt);

        }
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
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.draw(p);
        }
        for (let i = 0; i < this.drones.length; ++i) {
            const drone = this.drones[i];
            drone.draw(p);
        }
    }

}