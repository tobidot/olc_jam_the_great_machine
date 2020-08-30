import { StelarBody } from "./StellarBody";
import p5, { Vector } from "p5";

export class Asteroid extends StelarBody {

    constructor(position: Vector = new p5.Vector) {
        const size = Math.floor(Math.random() * 5) + 2;
        super(position, size);
    }
}