import p5 from "p5";
import { Game } from "./Game";

export class GameMenu {
    constructor(private game: Game) {

    }

    public draw(p: p5) {
        p.fill("#442222");
        p.noStroke();
        p.rect(0, 500, 800, 100);
        this.draw_button(p, 25, 510, 'Thrusters', this.game.swarm.levels.thruster_level);
        this.draw_button(p, 275, 510, 'Collectors', this.game.swarm.levels.collecting_level);
        this.draw_button(p, 525, 510, 'Durability', this.game.swarm.levels.stability_level);
        p.fill(40);
        p.rect(0, 575, 600, 25);
        p.fill(200, 200, 0);
        p.rect(0, 575, 600 * this.game.swarm.level_progress, 25);

        p.textSize(24);
        p.fill(0, 255, 0);
        p.text('Upgrades: ' + this.game.swarm.level_points.toString(), 610, 590);
    }

    public draw_button(p: p5, x: number, y: number, text: string, level: number) {
        p.stroke(0);
        p.textSize(24);
        p.strokeWeight(1);
        p.fill("#888888");
        p.rect(x, y, 200, 50);
        p.fill(255);
        p.text(text, x + 10, y + 25);
        p.textSize(32);
        p.fill(0, 255, 0);
        p.text(level.toString(), x + 205, y + 35);
    }

    mouse_dragged(x: number, y: number, drag: p5.Vector) {

    }

    mouse_pressed(x: number, y: number) {
        if (y > 560 || y < 510) return;
        const button_index = Math.floor((x - 25) / 250);
        const off_x = x - (button_index * 250 + 25);
        if (off_x > 200) return;
        if (this.game.swarm.level_points <= 0) return;
        this.game.swarm.level_points--;
        switch (button_index) {
            case 0: this.game.swarm.levels.thruster_level++; break;
            case 1: this.game.swarm.levels.collecting_level++; break;
            case 2: this.game.swarm.levels.stability_level++; break;
        }
    }

}