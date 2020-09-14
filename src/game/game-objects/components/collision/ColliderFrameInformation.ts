import { FrameInformation } from "../../base/FrameInformation";
import p5 from "p5";
import { CachedVariable } from "../../../tools/CachedVariable";
import { ColliderComponent } from "./ColliderComponent";
import { GameObjectBoundingBoxWrapper } from "../../base/GameObjectBoundingBoxWrapper";
import { Rect } from "@game.object/ts-game-toolbox/dist/src/geometries/Rect";
import { GameObject } from "../../base/GameObject";
import { ColliderCollisionInformation } from "./ColliderCollisionInformation";

export class ColliderFrameInformation extends FrameInformation {
    private collider: ColliderComponent;

    public position_center = new CachedVariable<p5.Vector>(
        new p5.Vector,
        (old: p5.Vector) => {
            return old.set(
                this.collider.rect.x + this.collider.rect.w / 2,
                this.collider.rect.y + this.collider.rect.h / 2,
            );
        });

    public collisions = new CachedVariable<Array<ColliderCollisionInformation | null>>(
        [],
        (old: Array<ColliderCollisionInformation | null>) => {
            let collision_count = 0;
            const possible_collisions = this.collider.game_object.game.game_object_collection.tree.pick(this.collider.rect);
            for (let j = 0; j < possible_collisions.length; ++j) {
                const other_game_object = possible_collisions[j].game_object;
                // guards
                if (other_game_object === null) continue;
                const other_collider = other_game_object.components.collider;
                if (other_collider === undefined) throw new Error();

                // set collision data
                let collision_slot: Partial<ColliderCollisionInformation> | null = old[collision_count];
                if (!collision_slot) { collision_slot = {}; }
                const to_other = p5.Vector.sub(
                    this.collider.cached.position_center.get(),
                    other_collider.cached.position_center.get(),
                );
                const distance2 = to_other.magSq();
                collision_slot.collider_source = this.collider;
                collision_slot.collider_target = other_collider;
                collision_slot.vector_from_source_to_target = to_other;
                collision_slot.distance2 = distance2;
                old[collision_count] = collision_slot as ColliderCollisionInformation;
                collision_count++;
            }
            old.fill(null, collision_count);
            return old;
        }
    )


    public constructor(collider: ColliderComponent) {
        super()
        this.collider = collider;
    }

    public reset() {
        this.position_center.is_valid = false;
    }
}