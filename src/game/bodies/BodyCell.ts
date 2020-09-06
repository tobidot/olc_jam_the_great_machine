import p5 from "p5";
import { Drone } from "../drones/Drone";
import { DroneAttachmentLink } from "../drones/DroneAttachementLink";
import { StelarBody } from "./StellarBody";

export class BodyCell {
    public static MAX_MASS: number = 25;
    public static MIN_MASS: number = 5;
    public parent: StelarBody;
    public coord: p5.Vector;
    public mass: number = Math.floor(Math.random() * (BodyCell.MAX_MASS - BodyCell.MIN_MASS)) + BodyCell.MIN_MASS;
    public attached: DroneAttachmentLink | null = null;

    constructor(parent: StelarBody, coord: p5.Vector) {
        this.parent = parent;
        this.coord = coord;
    }
}