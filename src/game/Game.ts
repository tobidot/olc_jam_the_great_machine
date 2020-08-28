import p5 from "p5";
import { StellarBody } from "./bodies/StellarBody";
import { Asteroid } from "./bodies/Asteroid";
import { Drone } from "./drones/Drone";

export class Game {
    private stellar_bodies: Array<StellarBody> = [
        new Asteroid(new p5.Vector().set(5, 5)),
        new Asteroid(new p5.Vector().set(50, 50)),
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

        for (let i = 0; i < 5; ++i) {
            const drone = new Drone();
            drone.position.set(p5.Vector.random2D().mult(Math.random() * 500).add(250, 250));
            drone.velocity.set(p5.Vector.random2D().mult(Math.random() * 25));
            this.drones.push(drone);
        }
    }

    public update(dt: number) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.update(dt);
        }
        for (let i = 0; i < this.drones.length; ++i) {
            const drone = this.drones[i];
            drone.update(dt);
            console.log(drone);
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