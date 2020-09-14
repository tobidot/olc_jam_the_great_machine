import p5, { Effect } from "p5";
import { QuadTree } from "../../../tools/trees/QuadTree";
import { Game } from "../../Game";
import { GameObject } from "../base/GameObject";
import { GameObjectBoundingBoxWrapper } from "../base/GameObjectBoundingBoxWrapper";
import { Drone } from "../drone/Drone";
import { OrganicShip } from "../organic-ship/OrganicShips";
import { StelarBody } from "../stelar-bodies/StellarBody";

export class GameObjectCollection {
    public readonly game: Game;
    public readonly game_objects: Array<GameObject | null> = [];
    public readonly tree: QuadTree<GameObjectBoundingBoxWrapper>;


    public constructor(game: Game) {
        this.game = game;
        this.tree = new QuadTree<GameObjectBoundingBoxWrapper>({
            x: -50, y: -50,
            w: 100, h: 100,
        });
    }

    public for_all_game_objects(callback: (game_object: GameObject) => void) {
        this.game_objects.forEach((game_object) => {
            if (game_object) callback(game_object);
        });
    }

    public add(object: GameObject) {
        this.game_objects.push(object);

        const collider = object.components.collider;
        if (collider === undefined) throw "";
        this.tree.add(collider.bounding_box_wrapper);
    }

    public remove(object: GameObject) {
        object.before_destroy();
        const collider = object.components.collider;
        if (collider !== undefined) {
            this.tree.remove(collider.bounding_box_wrapper);
        }
        const go_id = this.game_objects.findIndex((check) => check === object);
        if (go_id !== -1) this.game_objects[go_id] = null;
    }

    public clear() {
        this.game_objects.forEach((game_object) => {
            if (game_object) game_object.before_destroy();
        });

        this.game_objects.fill(null);
        this.tree.clear();
    }
}