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
        const drones = this.drones;
        for (let i = 0; i < drones.length; ++i) {
            const drone = drones[i];
            if (drone.components.collider === undefined) throw new Error();
            drone.frame_information.reset();

            const possible_collisions = this.game.game_object_tree.pick(drone.components.collider.rect);
            for (let j = 0; j < possible_collisions.length; ++j) {
                const stelar_body = possible_collisions[j].game_object;
                if (stelar_body instanceof StelarBody) {
                    if (stelar_body.components.collider === undefined) throw new Error();
                    const to_other = p5.Vector.sub(drone.components.collider.cached.position_center.get(), stelar_body.components.collider.cached.position_center.get());
                    const distance2 = to_other.magSq();
                    drone.frame_information.add_position_relation({
                        stelar_body: stelar_body,
                        to_other,
                        distance2
                    });
                }
            }

            drone.update(dt);
        }
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