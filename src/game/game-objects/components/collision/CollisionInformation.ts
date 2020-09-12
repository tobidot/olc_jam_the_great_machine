import { ColliderObject } from "./Colider";

export class CollisionInformation {
    constructor(public readonly a: ColliderObject, public readonly b: ColliderObject) {

    }
}