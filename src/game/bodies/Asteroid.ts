import { StellarBody } from "./StellarBody";
import p5, { Vector } from "p5";

export class Asteroid extends StellarBody {

    constructor(position: Vector = new p5.Vector) {
        super(position, Math.floor(Math.random() * 10) + 2);
    }
}