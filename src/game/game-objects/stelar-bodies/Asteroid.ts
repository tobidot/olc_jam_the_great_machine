import { StelarBody } from "./StellarBody";
import p5, { Vector } from "p5";
import { Game } from "../../Game";

export class Asteroid extends StelarBody {

    constructor(game: Game, position: Vector = new p5.Vector, size?: number) {
        if (!size) size = Math.floor(Math.random() * 5) + 2;
        super(game, position, size);
    }

    public before_draw_roughly(p: p5) {
        p.noTint();
    }

    public draw_roughly(p: p5) {
        this.before_draw_roughly(p);
        if (this.game.assets.asteroid) {
            const rect = this.components.collider?.rect;
            if (rect === undefined) throw new Error();
            p.image(this.game.assets.asteroid, rect.x, rect.y, rect.w, rect.h);
        } else {
            super.draw_roughly(p);
        }
    }
}