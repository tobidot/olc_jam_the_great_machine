import { Asteroid } from "./Asteroid";
import { StelarBody } from "./StellarBody";
import { Game } from "../Game";
import p5, { Vector } from "p5";
import { BodyCell } from "./BodyCell";
import { OrganicShip } from "../enemies/OrganicShips";

export class HabitablePlanet extends StelarBody {
    public readonly ships: Array<OrganicShip>;
    public spawn_time_cd: number;
    public spawn_time: number;

    constructor(game: Game, position: Vector = new p5.Vector, size?: number) {
        if (!size) size = Math.floor(Math.random() * 10) + 4;
        super(game, position, size);
        this.ships = [];
        this.spawn_time = 60;
        this.spawn_time_cd = this.spawn_time / 4;
    }

    public update(dt: number) {
        this.spawn_time_cd -= dt * Math.sqrt(this.get_mass_center().mass / (100 * BodyCell.MAX_MASS));
        if (this.spawn_time_cd < 0) {
            this.spawn_time_cd = this.spawn_time + 30;
            const ship = new OrganicShip(this.game, new p5.Vector().set(this.x, this.y).copy());
            this.game.add_game_object(ship);
            this.ships.push(ship);
            ship.radius = Math.sqrt(this.ships.length);
        }
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
        let from = p.color(0, 50, 0);
        let to = p.color(100, 250, 20);
        let lerp = p.lerpColor(from, to, mass / (BodyCell.MAX_MASS * this.cellmap_size * this.cellmap_size));
        p.stroke(255, 0, 0);
        p.strokeWeight(4);
        p.fill(lerp);
    }

    public before_destroy() {
        this.ships.forEach((ship) => {
            ship.state.is_to_delete = true;
        });
    }
}