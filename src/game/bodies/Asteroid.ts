import { StelarBody } from "./StellarBody";
import p5, { Vector } from "p5";
import { Game } from "../Game";

export class Asteroid extends StelarBody {

    constructor(game: Game, position: Vector = new p5.Vector, size?: number) {
        if (!size) size = Math.floor(Math.random() * 5) + 2;
        super(game, position, size);
    }
}