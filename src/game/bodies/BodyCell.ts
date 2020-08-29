import p5 from "p5";

export class BodyCell {
    public coord: p5.Vector;
    public mass: number = 0;

    constructor(coord: p5.Vector) {
        this.coord = coord;
    }
}