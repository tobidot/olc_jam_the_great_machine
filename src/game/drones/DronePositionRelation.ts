import p5 from "p5";
import { StellarBody as StelarBody } from "../bodies/StellarBody";

export interface DroneStelarBodyRelation {
    stelar_body: StelarBody;
    to_other: p5.Vector;
    distance2: number;
}