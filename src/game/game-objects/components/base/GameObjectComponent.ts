import { FrameInformation } from "../../base/FrameInformation";

export abstract class GameObjectComponent<T extends FrameInformation> {
    constructor(public readonly name: string) {
    }

    public before_update() {

    }

    public before_destroy() {

    }

    public abstract update(dt: number): void;
}