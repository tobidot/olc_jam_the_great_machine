import p5 from "p5";
import { Drone } from "../drones/Drone";
import { DroneAttachmentLink } from "../drones/DroneAttachementLink";
import { StelarBody } from "./StellarBody";

export class BodyCell {
    public parent: StelarBody;
    public coord: p5.Vector;
    public mass: number = 0;
    public attached: DroneAttachmentLink | null = null;

    constructor(parent: StelarBody, coord: p5.Vector) {
        this.parent = parent;
        this.coord = coord;
    }
}