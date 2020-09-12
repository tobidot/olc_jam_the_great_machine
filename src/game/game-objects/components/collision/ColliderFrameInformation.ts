import { FrameInformation } from "../../base/FrameInformation";
import p5 from "p5";
import { CachedVariable } from "../../base/CachedVariable";
import { ColliderComponent } from "./ColliderComponent";
import { GameObjectBoundingBoxWrapper } from "../../base/GameObjectBoundingBoxWrapper";
import { Rect } from "@game.object/ts-game-toolbox/dist/src/geometries/Rect";

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

    public bounding_box_wrapper = new CachedVariable<GameObjectBoundingBoxWrapper>(
        new GameObjectBoundingBoxWrapper(0, 0, 100, 100),
        (old: GameObjectBoundingBoxWrapper) => {
            old.x = this.collider.rect.x;
            old.y = this.collider.rect.y;
            old.w = this.collider.rect.w;
            old.h = this.collider.rect.h;
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