import p5, { Vector } from "p5";
import { CollisionInformation } from "./CollisionInformation";
import { GameObject } from "../object/GameObject";
import { helper } from "../tools/Rect";
import { Game } from "../Game";

export class ColliderObject extends GameObject implements helper.rect.IRect {
    public x: number;
    public y: number;
    public h: number;
    public w: number;

    constructor(game: Game, rect: helper.rect.IRect) {
        super(game);
        this.x = rect.x;
        this.y = rect.y;
        this.w = rect.w;
        this.h = rect.h;
    }

    public get_half_size() {
        return this.w / 2;
    }

    public get_position(): p5.Vector {
        return new p5.Vector().set(this.x + this.w / 2, this.y + this.h / 2);
    }

    public set_position(pos: p5.Vector): void {
        this.x = pos.x - this.w / 2;
        this.y = pos.y - this.h / 2;
    }

    public set_top_left_position(pos: p5.Vector) {
        this.x = pos.x;
        this.y = pos.y;
    }

    public move(offset: p5.Vector) {
        this.x += offset.x;
        this.y += offset.y;
    }
}