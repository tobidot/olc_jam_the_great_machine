import { GameObjectComponent } from "../base/GameObjectComponent"
import { Rect, IRect } from "@game.object/ts-game-toolbox/dist/src/geometries/Rect"
import { ColliderFrameInformation } from "./ColliderFrameInformation";
import p5 from "p5";


export class ColliderComponent extends GameObjectComponent<ColliderFrameInformation> {
    public cached = new ColliderFrameInformation(this);
    public rect: Rect = new Rect(0, 0, 100, 100);

    public constructor() {
        super('Collider');
    }

    public update(dt: number): void {

    }

    public before_update() {
        this.cached.reset();
    }

    public set_position_center(center: p5.Vector) {
        this.rect.x = center.x - this.rect.w / 2;
        this.rect.h = center.y - this.rect.h / 2;
    }
}