import p5 from "p5";
import { StellarBody } from "./bodies/StellarBody";
import { Asteroid } from "./bodies/Asteroid";

export class Game {
    private stellar_bodies: Array<StellarBody> = [
        new Asteroid(new p5.Vector().set(5, 5)),
        new Asteroid(new p5.Vector().set(50, 50)),
    ];


    constructor() {

    }

    public init(p: p5) {
        const images = require('../assets/images/*.png');

        p.mousePressed = () => {
            const x = p.mouseX;
            const y = p.mouseY;
        }
    }

    public update(dt: number) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.update(dt);
        }
    }

    public draw(p: p5) {
        p.background(0);

        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.draw(p);
        }
    }

}