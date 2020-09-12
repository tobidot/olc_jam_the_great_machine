import p5, { Vector } from "p5";
import { CollisionInformation } from "./CollisionInformation";
import { GameObject } from "../../base/GameObject";
import { helper } from "../../../tools/Rect";
import { Game } from "../../../Game";

/**
 * @deprecated
 */
export class ColliderObject extends GameObject {

    constructor(game: Game, rect: helper.rect.IRect) {
        super(game);
    }

}