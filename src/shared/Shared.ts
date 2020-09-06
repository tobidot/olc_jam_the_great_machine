import { ObservableSocket } from "../tools/signals/ObservableSocket";
import p5 from "p5";
import { Game } from "../game/Game";

export class Shared {
    public game = new ObservableSocket<Game | null>(null);
    public game_screen_container = new ObservableSocket<HTMLDivElement | null>(null);
    public background_music = new ObservableSocket<p5.SoundFile | null>(null);

    public debug_mode = new ObservableSocket<boolean>(false);
    public universe_size = new ObservableSocket<number>(2000);
    public system_density = new ObservableSocket<number>(0.2);
    public asteroid_density = new ObservableSocket<number>(0.8);
    public planets = new ObservableSocket<number>(2);
    public drones = new ObservableSocket<number>(10);


    private static instance: Shared;
    public static get_instance(): Shared { return Shared.instance || (Shared.instance = new Shared()); }
    private constructor() { }
}