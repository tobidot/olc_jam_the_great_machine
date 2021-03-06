import p5 from "p5";
import { Game } from "../Game";
import { GameMenuElement } from "./GameMenuElement";
import { GameMenuLabel } from "./GameMenuLabel";
import { helper } from "../tools/Rect";
import { GameMenuButton } from "./GameMenuButton";
import { GameMenuRect } from "./GameMenuRect";
import { GameMenuControler } from "./GameMenuControler";

export class GameMenu {
    private elements: Array<GameMenuElement> = [];

    constructor(private game: Game) {


        let fps_counter = new GameMenuLabel(new helper.rect.Rect(750, 350, 50, 50))
            .set_background_color("#222222")
            .set_alignment("right", "center")
            .set_on_draw(() => {
                drone_counter.active = this.game.debug_stats.active;
                fps_counter.set_text(this.game.debug_stats.fps.current_fps.toString());
            });

        let drone_counter = new GameMenuLabel(new helper.rect.Rect(725, 400, 75, 50))
            .set_background_color("#228822")
            .set_alignment("right", "center")
            .set_on_draw(() => {
                drone_counter.active = this.game.debug_stats.active;
                drone_counter.set_text(this.game.debug_stats.drones_allive.toString());
            });


        let menu_bar = new GameMenuRect(new helper.rect.Rect(0, 500, 800, 100))
            .set_background_color("#442222");

        let speed_label = new GameMenuLabel(
            new helper.rect.Rect(50, 505, 200, 25)
        ).set_text('Velocity')
            .set_text_size(16);

        let speed_controler = new GameMenuControler(
            new helper.rect.Rect(50 - 25, 560 - 25, 50, 50),
            new helper.rect.Rect(50, 550, 200, 20),
        ).set_on_drag(() => {
            this.game.control.speed = speed_controler.relative_value_x * 200 + 120;
        });


        let distance_label = new GameMenuLabel(
            new helper.rect.Rect(350, 505, 200, 25)
        ).set_text('Swarm Distance')
            .set_text_size(16);

        let distance_controler = new GameMenuControler(
            new helper.rect.Rect(350 - 25, 560 - 25, 50, 50),
            new helper.rect.Rect(350, 550, 200, 20),
        ).set_on_drag(() => {
            this.game.control.distance = distance_controler.relative_value_x * 1000 + 50;
        });


        let move_label = new GameMenuLabel(
            new helper.rect.Rect(570, 540, 80, 25)
        ).set_text('Move')
            .set_text_size(16);

        let movement_controler = new GameMenuControler(
            new helper.rect.Rect(700 - 25, 550 - 25, 50, 50),
            new helper.rect.Rect(660, 510, 80, 80),
        ).set_on_drag(() => {
            this.game.control.offset.set(
                movement_controler.relative_value_x - 0.5,
                movement_controler.relative_value_y - 0.5,
            )
        });

        this.elements = [
            // thrusters_button,
            // thruster_count_label,
            // collectors_button,
            // collectors_count_label,
            // durability_button,
            // durability_count_label,
            // level_progress_bar,
            // unspent_points_label,
            menu_bar,
            speed_label,
            speed_controler,
            distance_label,
            distance_controler,
            movement_controler,
            move_label,
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
        let hit = false;
        this.elements.forEach((element) => {
            if (element.handle_drag(new p5.Vector().set(x, y), drag)) {
                hit = hit || true;
            };
        });
        return hit;
    }

    mouse_pressed(x: number, y: number): boolean {
        let hit = false;
        this.elements.forEach((element) => {
            if (element.handle_click(new p5.Vector().set(x, y))) {
                hit = hit || true;
            };
        });
        return hit;
    }

}