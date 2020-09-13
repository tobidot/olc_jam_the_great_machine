import { Game } from "../../Game";
import { helper } from "../../tools/Rect";
import { ColliderComponent } from "../components/collision/ColliderComponent";
import p5 from "p5";

export class GameObject {
    public static next_uuid = 0;
    public readonly uuid = GameObject.next_uuid++;
    public readonly game: Game;

    public components: {
        collider?: ColliderComponent
    } = {

        };

    public state = {
        is_to_delete: false,
    };

    public constructor(game: Game) {
        this.game = game;
    }

    public before_destroy() {
        this.components.collider?.before_destroy();
    }

    public before_update() {
        this.components.collider?.before_update();
    }

    public update(dt: number) {
        this.components.collider?.update(dt);
    }

    public debug_draw(p: p5) {
        const rect = this.components.collider?.rect;
        if (rect === undefined) return;
        p.rect(
            rect.x,
            rect.y,
            rect.w,
            rect.h
        );
    }
}