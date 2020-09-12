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

}