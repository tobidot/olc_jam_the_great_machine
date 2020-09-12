import { Rect } from "@game.object/ts-game-toolbox/dist/src/geometries/Rect";
import { GameObjectComponent } from "../components/base/GameObjectComponent";
import { GameObject } from "./GameObject";

export class GameObjectBoundingBoxWrapper extends Rect {
    public game_object: GameObject | null = null;
}