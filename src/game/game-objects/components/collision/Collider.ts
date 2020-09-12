import p5, { Vector } from "p5";
import { CollisionInformation } from "./CollisionInformation";
import { GameObject } from "../../base/GameObject";
import { helper } from "../../../tools/Rect";
import { Game } from "../../../Game";

/**
 * @deprecated
 */
export class ColliderObject extends GameObject implements helper.rect.IRect {
    public x: number;
    public y: number;
    public h: number;
    public w: number;
    private position_center_is_valid: boolean = false;
    private position_center: p5.Vector = new p5.Vector;

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
        if (this.position_center_is_valid) return this.position_center;
        this.position_center_is_valid = true;
        return this.position_center.set(this.x + this.w / 2, this.y + this.h / 2);
    }

    public set_position(pos: p5.Vector): void {
        this.x = pos.x - this.w / 2;
        this.y = pos.y - this.h / 2;
        this.position_center_is_valid = false;
    }

    public set_top_left_position(pos: p5.Vector) {
        this.x = pos.x;
        this.y = pos.y;
        this.position_center_is_valid = false;
    }

    public move(offset: p5.Vector) {
        this.x += offset.x;
        this.y += offset.y;
        this.position_center_is_valid = false;
    }
}