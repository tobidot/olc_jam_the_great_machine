import { ColliderObject } from "./Collider";

/**
 * @deprecated
 */
export class CollisionInformation {
    constructor(public readonly a: ColliderObject, public readonly b: ColliderObject) {

    }
}