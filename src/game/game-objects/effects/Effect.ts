import { GameObject } from "../base/GameObject";
import p5 from "p5";
import { Camera } from "../../helper/Camera";

export abstract class Effect {
    public is_finished: boolean = false;

    public abstract update(dt: number): void;
    public abstract draw(p: p5, camera: Camera): void;
}