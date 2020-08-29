import p5 from "p5";
import { Drone } from "../drones/Drone";

export class BodyCell {
    public coord: p5.Vector;
    public mass: number = 0;
    public occupied_by: Drone | null = null;

    constructor(coord: p5.Vector) {
        this.coord = coord;
    }
}