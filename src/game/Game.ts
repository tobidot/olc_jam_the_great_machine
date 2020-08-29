import p5 from "p5";
import { StellarBody } from "./bodies/StellarBody";
import { Asteroid } from "./bodies/Asteroid";
import { Drone } from "./drones/Drone";

export class Game {
    private stellar_bodies: Array<StellarBody> = [
    ];
    private drones: Array<Drone> = [

    ];


    constructor() {

    }

    public init(p: p5) {
        const images = require('../assets/images/*.png');

        p.mousePressed = () => {
            const x = p.mouseX;
            const y = p.mouseY;
        }

        const count = Math.floor(Math.random() * 50) + 5
        for (let i = 0; i < count; ++i) {
            const asteroid = new Asteroid();
            asteroid.get_position().set(
                p5.Vector.random2D().mult(Math.random() * 500).add(250, 250)
            );

            this.stellar_bodies.push(asteroid);
        }

        {
            const count = Math.floor(Math.random() * 10) + 2
            for (let i = 0; i < count; ++i) {
                const drone = new Drone();
                drone.position.set(p5.Vector.random2D().mult(Math.random() * 500).add(250, 250));
                drone.velocity.set(p5.Vector.random2D().mult(Math.random() * 25));
                this.drones.push(drone);
            }
        }
    }

    public update(dt: number) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.update(dt);
        }
        for (let i = 0; i < this.drones.length; ++i) {
            const drone = this.drones[i];
            for (let j = 0; j < this.stellar_bodies.length; ++j) {
                const stelar_body = this.stellar_bodies[j];
                const acting_force = stelar_body.calculate_gravitational_force_on(1, drone.position).mult(dt);
                drone.apply_force(acting_force);
            }
            drone.update(dt);

        }
    }

    public draw(p: p5) {
        p.background(0);

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