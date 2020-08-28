import { StellarBody } from "./StellarBody";
import { Vector } from "p5";

export class Asteroid extends StellarBody {

    constructor(position: Vector) {
        super(position, 5);
    }
}