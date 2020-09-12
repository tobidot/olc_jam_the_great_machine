import { Drone } from "./Drone";
import { StelarBody as StelarBody } from "../stelar-bodies/StellarBody";
import p5 from "p5";
import { BodyCell } from "../stelar-bodies/BodyCell";

interface Attachable {
    attached: DroneAttachmentLink | null
}

interface AttachmentData {
    drone: Drone;
    stelar_body: StelarBody;
    stelar_body_cell: BodyCell;
}

export class DroneAttachmentLink {
    private data: AttachmentData | null;

    constructor(
        drone: Drone,
        stelar_body_cell: BodyCell
    ) {
        this.data = {
            drone,
            stelar_body: stelar_body_cell.parent,
            stelar_body_cell,
        };
        drone.attached = this;
        stelar_body_cell.attached = this;
    }

    public get_attachement_data(): AttachmentData | null {
        this.assert_consitency();
        return this.data;
    }

    protected assert_consitency(): boolean {
        if (this.data) {
            const is_drone_attached = this.data.drone.attached === this;
            const is_stelar_body_cell_attached = this.data.stelar_body_cell.attached === this;
            if (is_drone_attached && is_stelar_body_cell_attached) {
                return true;
            } else {
                this.data.drone.attached = null;
                this.data.stelar_body_cell.attached = null;
                return false;
            }
        }
        return false;
    }

}