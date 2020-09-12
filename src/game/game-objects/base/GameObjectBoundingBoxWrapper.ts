import { Rect, IRect } from "@game.object/ts-game-toolbox/dist/src/geometries/Rect";
import { GameObjectComponent } from "../components/base/GameObjectComponent";
import { GameObject } from "./GameObject";

export class GameObjectBoundingBoxWrapper extends Rect {
    public game_object: GameObject | null;

    public constructor(rect: IRect, game_object: GameObject | null = null) {
        super(rect.x, rect.y, rect.w, rect.h);
        this.game_object = game_object;
        if (game_object === null) debugger;
    }
}