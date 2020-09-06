import { Asteroid } from "./Asteroid";
import { StelarBody } from "./StellarBody";
import { Game } from "../Game";
import p5, { Vector } from "p5";
import { BodyCell } from "./BodyCell";

export class HabitablePlanet extends StelarBody {

    constructor(game: Game, position: Vector = new p5.Vector, size?: number) {
        if (!size) size = Math.floor(Math.random() * 10) + 4;
        super(game, position, size);
    }

    public before_draw_cell(p: p5, cell: BodyCell) {
        if (cell.mass < BodyCell.MIN_MASS + 4) {
            let from = p.color(10, 10, 90);
            let to = p.color(70, 70, 150);
            let lerp = p.lerpColor(from, to, cell.mass / (BodyCell.MIN_MASS + 4));
            p.fill(lerp);
        } else {
            let from = p.color(80, 170, 10);
            let to = p.color(60, 60, 20);
            let lerp = p.lerpColor(from, to, cell.mass / BodyCell.MAX_MASS);
            p.fill(lerp);
        }
    }

    public before_draw_roughly(p: p5) {
        const mass = this.get_mass_center().mass;
        let from = p.color(80, 170, 10);
        let to = p.color(60, 60, 20);
        let lerp = p.lerpColor(from, to, mass / (BodyCell.MAX_MASS * this.cellmap_size * this.cellmap_size));
        p.stroke(255, 0, 0);
        p.strokeWeight(4);
        p.fill(lerp);
    }

}