import { Game } from "../Game";

export class GameObject {
    public static next_uuid = 0;
    public readonly uuid = GameObject.next_uuid++;
}