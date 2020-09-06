import { Game } from "../Game";
import { helper } from "../tools/Rect";

export class GameObject {
    public static next_uuid = 0;
    public readonly uuid = GameObject.next_uuid++;
    public readonly game: Game;
    public state = {
        is_to_delete: false,
    };

    public constructor(game: Game) {
        this.game = game;
    }

    public before_destroy() {

    }
}