import p5 from "p5";
import { Game } from "../Game";
import { GameMenuElement } from "./GameMenuElement";
import { GameMenuLabel } from "./GameMenuLabel";
import { helper } from "../tools/Rect";
import { GameMenuButton } from "./GameMenuButton";
import { GameMenuRect } from "./GameMenuRect";

export class GameMenu {
    private elements: Array<GameMenuElement> = [];

    constructor(private game: Game) {
        let textColor = "#00dd00";
        let buttonColor = "#444444";

        let thrusters_button = (new GameMenuButton(new helper.rect.Rect(25, 510, 200, 50)))
            .set_background_color(buttonColor)
            .set_text_color(textColor)
            .set_text('Thrusters')
            .set_on_click(() => this.buy_level('thrusters'));
        let collectors_button = (new GameMenuButton(new helper.rect.Rect(275, 510, 200, 50)))
            .set_background_color(buttonColor)
            .set_text_color(textColor)
            .set_text('Collectors')
            .set_on_click(() => this.buy_level('collectors'));
        let durability_button = (new GameMenuButton(new helper.rect.Rect(525, 510, 200, 50)))
            .set_background_color(buttonColor)
            .set_text_color(textColor)
            .set_text('Durability')
            .set_on_click(() => this.buy_level('durability'));

        let label_back_color = "#aaaa00";
        let label_front_color = "#111";
        let thruster_count_label = (new GameMenuLabel(new helper.rect.Rect(225, 510, 40, 50)))
            .set_background_color(label_back_color)
            .set_text_color(label_front_color)
            .set_on_draw(() => {
                thruster_count_label.set_text(this.game.swarm.levels.thruster_level.toString());
            });
        let collectors_count_label = (new GameMenuLabel(new helper.rect.Rect(475, 510, 40, 50)))
            .set_background_color(label_back_color)
            .set_text_color(label_front_color)
            .set_on_draw(() => {
                collectors_count_label.set_text(this.game.swarm.levels.collecting_level.toString());
            });
        let durability_count_label = (new GameMenuLabel(new helper.rect.Rect(725, 510, 40, 50)))
            .set_background_color(label_back_color)
            .set_text_color(label_front_color)
            .set_on_draw(() => {
                durability_count_label.set_text(this.game.swarm.levels.stability_level.toString());
            });

        let unspent_points_label = (new GameMenuLabel(new helper.rect.Rect(650, 580, 125, 20)))
            .set_background_color(label_front_color)
            .set_text_color("#bbbb00")
            .set_text_size(24)
            .set_alignment("left", "center")
            .set_on_draw(() => {
                unspent_points_label.set_text(this.game.swarm.level_points.toString());
            });

        let progress_color = "#008800";
        let level_progress_bar = (new GameMenuRect(new helper.rect.Rect(0, 580, 800, 20)))
            .set_background_color(progress_color)
            .set_on_draw(() => {
                const green = Math.trunc(this.game.swarm.level_progress * 255).toString(16).padStart(2, '0');
                level_progress_bar.background_color = "#00" + green + "00";
                level_progress_bar.rect.w = this.game.swarm.level_progress * 600;
            });

        let fps_counter = new GameMenuLabel(new helper.rect.Rect(750, 400, 50, 50))
            .set_background_color("#222222")
            .set_alignment("right", "center")
            .set_on_draw(() => {
                fps_counter.set_text(this.game.debug_stats.fps.current_fps.toString());
            });

        let drone_counter = new GameMenuLabel(new helper.rect.Rect(725, 450, 75, 50))
            .set_background_color("#228822")
            .set_alignment("right", "center")
            .set_on_draw(() => {
                drone_counter.set_text(this.game.debug_stats.drones_allive.toString());
            });


        this.elements = [
            thrusters_button,
            thruster_count_label,
            collectors_button,
            collectors_count_label,
            durability_button,
            durability_count_label,
            level_progress_bar,
            unspent_points_label,
            fps_counter,
            drone_counter,
            ...this.create_stats_dislpay(),
        ];
    }

    public create_stats_dislpay() {
        let drone_counter = new GameMenuLabel(new helper.rect.Rect(625, 0, 80, 25))
            .set_text_size(16)
            .set_text_color("#ffffff")
            .set_background_color("#000000")
            .set_alignment("left", "center")
            .set_on_draw(() => {
                drone_counter.set_text("Drones : " + this.game.game_stats.drones.toString());
            });
        let asteroids_counter = new GameMenuLabel(new helper.rect.Rect(625, 25, 80, 25))
            .set_text_size(16)
            .set_text_color("#ffffff")
            .set_background_color("#000000")
            .set_alignment("left", "center")
            .set_on_draw(() => {
                const asteroids_abs = this.game.game_stats.asteroids_remaining.toString();
                const asteroids_percent = this.game.game_stats.asteroids_remaining_percent.toFixed(1);
                asteroids_counter.set_text("Asteroids : " + asteroids_abs + " (" + asteroids_percent + "%)");
            });
        let habitats_counter = new GameMenuLabel(new helper.rect.Rect(625, 50, 80, 25))
            .set_text_size(16)
            .set_text_color("#ffffff")
            .set_background_color("#000000")
            .set_alignment("left", "center")
            .set_on_draw(() => {
                const habitats = this.game.game_stats.habitats_remaining.toString();
                habitats_counter.set_text("Planets : " + habitats);
            });
        let ships_counter = new GameMenuLabel(new helper.rect.Rect(625, 75, 80, 25))
            .set_text_size(16)
            .set_text_color("#ffffff")
            .set_background_color("#000000")
            .set_alignment("left", "center")
            .set_on_draw(() => {
                const ships = this.game.game_stats.enemy_ships.toString();
                ships_counter.set_text("Destroyer : " + ships);
            });

        return [
            asteroids_counter,
            drone_counter,
            habitats_counter,
            ships_counter,
        ];
    }

    public draw(p: p5) {
        p.fill("#442222");
        p.noStroke();
        p.rect(0, 500, 800, 100);

        // this.draw_button(p, 25, 510, 'Thrusters', this.game.swarm.levels.thruster_level);
        // this.draw_button(p, 275, 510, 'Collectors', this.game.swarm.levels.collecting_level);
        // this.draw_button(p, 525, 510, 'Durability', this.game.swarm.levels.stability_level);

        // p.fill(40);
        // p.rect(0, 575, 600, 25);
        // p.fill(200, 200, 0);
        // p.rect(0, 575, 600 * this.game.swarm.level_progress, 25);

        // p.textSize(24);
        // p.fill(0, 255, 0);
        // p.text('Upgrades: ' + this.game.swarm.level_points.toString(), 610, 590);

        this.elements.forEach((element) => {
            element.draw(p);
        })
    }



    protected buy_level(type: string) {
        // if (this.game.swarm.level_points <= 0) return;
        this.game.swarm.level_points--;
        switch (type) {
            case "thrusters": this.game.swarm.levels.thruster_level++; break;
            case "durability": this.game.swarm.levels.stability_level++; break;
            case "collectors": this.game.swarm.levels.collecting_level++; break;
        }
    }

    protected buy_thruster_level() {
    }

    public draw_button(p: p5, x: number, y: number, text: string, level: number) {
        p.stroke(0);
        p.textSize(24);
        p.strokeWeight(1);
        p.fill("#888888");
        p.rect(x, y, 200, 50);

        // p.fill(255);
        // p.text(text, x + 10, y + 25);
        // p.textSize(32);
        // p.fill(0, 255, 0);
        // p.text(level.toString(), x + 205, y + 35);
    }

    mouse_dragged(x: number, y: number, drag: p5.Vector) {

    }

    mouse_pressed(x: number, y: number) {
        this.elements.forEach((element) => {
            element.handle_click(new p5.Vector().set(x, y));
        });
    }

}