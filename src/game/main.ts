import { Shared } from "../shared/Shared";
import p5 from "p5";
import { Game } from "./Game";

export function load_game() {
    let innerContainer = document.createElement('div');
    let p5Instance = new p5(setup_p5_instance, innerContainer);
    connect_container_to_game_screen(innerContainer, p5Instance);
}

function connect_container_to_game_screen(container: HTMLDivElement, p5Instance: p5) {
    let shared = Shared.get_instance();
    shared.game_screen_container.add((signal) => {
        let canvas = (<any>p5Instance).canvas as HTMLCanvasElement;
        if (signal.new === null) {
            if (canvas) {
                canvas.style.visibility = "hidden";
            }
            signal.old.removeChild(container);
        } else {
            signal.new.append(container);
            if (canvas) {
                canvas.style.visibility = "visible";
                canvas.style.width = "100%";
                canvas.style.height = "auto";
            }
        }
    });
}

function setup_p5_instance(p: p5) {
    let game = new Game();
    p.setup = function () {
        // where does this canvas come from=?
        (<any>p).canvas.remove();
        p.createCanvas(800, 600, "p2d");
        game.init(p);
    }
    p.draw = function () {
        game.update(1 / 60);
        game.draw(p);
    }
}