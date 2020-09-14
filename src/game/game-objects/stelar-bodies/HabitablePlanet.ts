import { Asteroid } from "./Asteroid";
import { StelarBody } from "./StellarBody";
import { Game } from "../../Game";
import p5, { Vector } from "p5";
import { BodyCell } from "./BodyCell";
import { OrganicShip } from "../organic-ship/OrganicShips";
import { VisualComponent } from "../components/visual/VisualComponent";

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

        this.components.visual = new VisualComponent(this, game.camera, game.p);
        this.components.visual.base_color = game.p.color(0, 200, 50);
        this.components.visual.image = game.assets.planet ?? null;
        this.components.visual.draw_details_func = this.draw_details_func;
        this.components.visual.source_rect.w = 128;
        this.components.visual.source_rect.h = 128;
    }

    public update(dt: number) {
        super.update(dt);
        const collider = this.components.collider;
        if (collider === undefined) throw new Error();
        this.spawn_time_cd -= dt * Math.sqrt(this.get_mass_center().mass / (100 * BodyCell.MAX_MASS));
        if (this.spawn_time_cd < 0) {
            this.spawn_time_cd = this.spawn_time + 30;
            const ship = new OrganicShip(this.game, new p5.Vector().set(collider.rect.x, collider.rect.y).copy());
            this.game.game_object_collection.add(ship);
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

    public before_destroy() {
        this.ships.forEach((ship) => {
            ship.state.is_to_delete = true;
        });
    }
}