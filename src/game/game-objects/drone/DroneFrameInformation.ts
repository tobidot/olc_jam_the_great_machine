import { DroneStelarBodyRelation } from "./DronePositionRelation";
import p5 from "p5";
import { Drone } from "./Drone";

export class DroneFrameInformation {
    private velocity2: number | null = null;
    private force_modifier: number | null = null;
    private drone: Drone;

    constructor(drone: Drone) {
        this.drone = drone;
    }

    public reset() {
        this.velocity2 = null;
        this.force_modifier = null;
    }

    public get_force_modifier(): number {
        if (this.force_modifier) return this.force_modifier;
        return this.force_modifier = this.drone.calculate_force_modifier();
    }

    public get_velocity2(): number {
        if (this.velocity2) return this.velocity2;
        return this.velocity2 = this.drone.calculate_velocity2();
    }
}