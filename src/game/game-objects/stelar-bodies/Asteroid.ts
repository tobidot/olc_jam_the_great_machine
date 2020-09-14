import { StelarBody } from "./StellarBody";
import p5, { Vector } from "p5";
import { Game } from "../../Game";
import { VisualComponent } from "../components/visual/VisualComponent";

export class Asteroid extends StelarBody {

    constructor(game: Game, position: Vector = new p5.Vector, size?: number) {
        if (!size) size = Math.floor(Math.random() * 5) + 2;
        super(game, position, size);

        this.components.visual = new VisualComponent(this, game.camera, game.p);
        this.components.visual.base_color = game.p.color(128);
        this.components.visual.image = game.assets.asteroid ?? null;
        this.components.visual.draw_details_func = this.draw_details_func;
        this.components.visual.source_rect.w = 64;
        this.components.visual.source_rect.h = 64;
    }
}