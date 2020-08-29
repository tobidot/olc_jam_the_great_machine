import { DroneStelarBodyRelation } from "./DronePositionRelation";

export class DroneFrameInformation {
    public stelar_body_relations: Array<DroneStelarBodyRelation> = [];

    constructor() {

    }

    public reset() {
        this.stelar_body_relations = [];
    }

    public add_position_relation(relation: DroneStelarBodyRelation): void {
        this.stelar_body_relations[relation.stelar_body.uuid] = relation;
    }
}