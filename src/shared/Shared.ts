import { SharedSettings } from "./SharedSettings";
import { ObservableSocket } from "../tools/signals/ObservableSocket";

export class Shared {
    public settings: SharedSettings = {};
    public game_screen_container = new ObservableSocket<HTMLDivElement | null>(null);
    // public canvas = new ObservableSocket<HTMLCanvasElement | null>(null);

    private static instance: Shared;

    public static get_instance(): Shared {
        return Shared.instance || (Shared.instance = new Shared());
    }

    constructor() {

    }
}