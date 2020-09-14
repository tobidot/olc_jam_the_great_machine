import { Rect } from "@game.object/ts-game-toolbox/dist/src/geometries/Rect";
import p5 from "p5";
import { Camera } from "../../../helper/Camera";
import { GameObject } from "../../base/GameObject";
import { GameObjectComponent } from "../base/GameObjectComponent";
import { VisualFrameInformation } from "./VisualFrameInformation";

export class VisualComponent extends GameObjectComponent<VisualFrameInformation> {
    public readonly game_object: GameObject;
    public readonly p: p5;
    public readonly camera: Camera;
    public source_rect = new Rect(0, 0, 8, 8);
    public rect: Rect = new Rect(0, 0, 100, 100);
    // visuals
    public base_color: p5.Color;
    public image: p5.Image | null = null;

    // animation
    public animation: p5.Image | null = null;
    public animation_step: number = 0;
    public animation_frame: number = 0;
    public animation_max_step: number = 60;
    public animation_frames: { [at_tick: number]: number } = [];

    constructor(game_object: GameObject, camera: Camera, p: p5) {
        super('visual');
        this.game_object = game_object;
        this.camera = camera;
        this.p = p;
        this.base_color = p.color(255, 0, 255);
    }

    public update(dt: number): void {
        const collider = this.game_object.components.collider;
        if (!collider) return;
        this.rect.x = collider.rect.x;
        this.rect.y = collider.rect.y;
        this.rect.w = collider.rect.w;
        this.rect.h = collider.rect.h;
    }

    public draw() {
        if (this.has_animation() && this.camera.zoom < 2) {
            this.draw_animation();
        } else if (this.has_image() && this.camera.zoom < 10) {
            this.draw_image();
        } else {
            this.draw_symbol();
        }
    }

    public has_animation(): this is VisualComponentWithAnimation {
        if (this.animation) return true;
        return false;
    }

    public has_image(): this is VisualComponentWithImage {
        if (this.image) return true;
        return false;
    }

    public draw_symbol() {
        this.p.noStroke();
        this.p.fill(this.base_color);
        this.p.rect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    }

    public draw_image(this: VisualComponentWithImage) {
        this.p.image(
            this.image, this.rect.x, this.rect.y, this.rect.w, this.rect.h,
            this.source_rect.x, this.source_rect.y, this.source_rect.w, this.source_rect.h
        );
    }

    public draw_animation(this: VisualComponentWithAnimation) {
        this.advance_animation_step();
        const source_rect = this.get_animation_rect();
        this.p.image(
            this.animation, this.rect.x, this.rect.y, this.rect.w, this.rect.h,
            source_rect.x, source_rect.y, source_rect.w, source_rect.h
        );
    }

    public get_animation_rect(): Rect {
        const frame_offset = this.animation_frame * 8;
        return new Rect(frame_offset, 0, 8, 8);
    }

    public advance_animation_step() {
        this.animation_step++;
        if (this.animation_step >= this.animation_max_step) {
            this.animation_step = 0;
        }
        if (this.animation_frames[this.animation_step]) {
            this.animation_frame = this.animation_frames[this.animation_step];
        }
    }

    public before_destroy() {
        super.before_destroy();
    }
}

type VisualComponentWithAnimation = VisualComponent & {
    animation: p5.Image;
};

type VisualComponentWithImage = VisualComponent & {
    image: p5.Image;
};
