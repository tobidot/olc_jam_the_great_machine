import p5, { Effect } from "p5";
import { Game } from "../../Game";
import { GameObject } from "../base/GameObject";
import { Drone } from "../drone/Drone";
import { OrganicShip } from "../organic-ship/OrganicShips";
import { StelarBody } from "../stelar-bodies/StellarBody";

export class GameObjectCollection {
    public readonly game: Game;

    // Deprecate these eventually
    public drones: Array<Drone> = [];
    public stellar_bodies: Array<StelarBody | null> = [];
    public organic_ships: Array<OrganicShip | null> = [];

    // 
    public game_objects: Array<GameObject | null> = [];


    public constructor(game: Game) {
        this.game = game;
    }

    public update(dt: number) {
        this.for_all_game_objects((game_object: GameObject) => {
            game_object.before_update();
        });

        // update
        this.for_all_game_objects((game_object: GameObject) => {
            game_object.update(dt);
        });
        // clean up
        this.for_all_game_objects((game_object: GameObject) => {
            if (game_object.state.is_to_delete) {
                game_object.before_destroy();
                const collider = game_object.components.collider;
                if (collider !== undefined) {
                    const bounding_box_wrapper = collider.bounding_box_wrapper;
                    this.game.game_object_tree.remove(bounding_box_wrapper);
                }
                this.remove(game_object);
            }
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
        if (collider !== undefined) {
            this.game.game_object_tree.add(collider.bounding_box_wrapper);
        }

        if (object instanceof OrganicShip) {
            return this.organic_ships.push(object);
        } else if (object instanceof Drone) {
            return this.drones.push(object);
        } else if (object instanceof StelarBody) {
            return this.stellar_bodies.push(object);
        }
        throw "";
    }

    public remove(object: GameObject) {
        object.before_destroy();
        const collider = object.components.collider;
        if (collider !== undefined) {
            this.game.game_object_tree.remove(collider.bounding_box_wrapper);
        }
        const go_id = this.game_objects.findIndex((check) => check === object);
        if (go_id !== -1) this.game_objects[go_id] = null;
        if (object instanceof OrganicShip) {
            const id = this.organic_ships.findIndex((check) => object === check);
            if (id !== -1) this.organic_ships[id] = null;
        }
    }

    public clear() {
        this.game_objects.forEach((game_object) => {
            if (game_object) game_object.before_destroy();
        });

        this.stellar_bodies = [];
        this.organic_ships = [];
        this.game_objects = [];
        this.drones = [];
    }
}