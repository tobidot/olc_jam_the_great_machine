import { Shared } from "../shared/Shared";
import p5 from "p5";
import "p5";
// (<any>window).p5 = p5;
// import 'p5/lib/addons/p5.sound';
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
            if (signal.old) signal.old.removeChild(container);
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
    p.preload = function () {
        if (p.hasOwnProperty('soundFormats')) {
            (<any>p).soundFormats('mp3');
        }
    }
    let setup_done = false;
    p.setup = function () {
        p.createCanvas(800, 600, "p2d");
        if (setup_done) return;
        setup_done = true;
        game.init(p);
        p.frameRate(60);
    }
    p.draw = function () {
        game.update(1.0 / 60.0, p);
        game.draw(p);
    }
}