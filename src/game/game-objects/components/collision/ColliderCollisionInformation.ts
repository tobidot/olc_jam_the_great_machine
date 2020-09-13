import p5 from "p5";
import { ColliderComponent } from "./ColliderComponent";

export interface ColliderCollisionInformation {
    collider_source: ColliderComponent;
    collider_target: ColliderComponent;
    distance2: number;
    vector_from_source_to_target: p5.Vector;
}