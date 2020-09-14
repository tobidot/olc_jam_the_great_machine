import { GameObjectComponent } from "../base/GameObjectComponent"
import { Rect, IRect } from "@game.object/ts-game-toolbox/dist/src/geometries/Rect"
import { ColliderFrameInformation } from "./ColliderFrameInformation";
import p5 from "p5";
import { GameObjectBoundingBoxWrapper } from "../../base/GameObjectBoundingBoxWrapper";
import { GameObject } from "../../base/GameObject";


export class ColliderComponent extends GameObjectComponent<ColliderFrameInformation> {
    public cached = new ColliderFrameInformation(this);
    public rect: Rect = new Rect(0, 0, 100, 100);
    public bounding_box_wrapper = new GameObjectBoundingBoxWrapper(new Rect(0, 0, 100, 100), this.game_object);

    public constructor(public game_object: GameObject) {
        super('collider');
        this.bounding_box_wrapper.x = this.rect.x;
        this.bounding_box_wrapper.y = this.rect.y;
        this.bounding_box_wrapper.w = this.rect.w;
        this.bounding_box_wrapper.h = this.rect.h;
    }

    public update(dt: number): void {
        this.game_object.game.game_object_collection.tree.change_element(this.bounding_box_wrapper, this.rect);
    }

    public before_update() {
        this.cached.reset();
    }

    public set_position_center(center: p5.Vector) {
        this.rect.x = center.x - this.rect.w / 2;
        this.rect.y = center.y - this.rect.h / 2;
    }

    public move_by(offset: p5.Vector) {
        this.rect.x += offset.x;
        this.rect.y += offset.y;
        this.cached.reset();
    }
}