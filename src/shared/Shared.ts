import { ObservableSocket } from "../tools/signals/ObservableSocket";
import p5 from "p5";

export class Shared {
    public game_screen_container = new ObservableSocket<HTMLDivElement | null>(null);
    public background_music = new ObservableSocket<p5.SoundFile | null>(null);
    public debug_mode = new ObservableSocket<boolean>(false);


    private static instance: Shared;
    public static get_instance(): Shared { return Shared.instance || (Shared.instance = new Shared()); }
    private constructor() { }
}