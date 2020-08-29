import { Collider } from "./Colider";

export class CollisionInformation {
    constructor(public readonly a: Collider, public readonly b: Collider) {

    }
}