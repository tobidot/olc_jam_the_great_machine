import { GameObject } from "../object/GameObject";
import p5, { Vector } from "p5";
import { OrganicShip } from "../enemies/OrganicShips";
import { Asteroid } from "../bodies/Asteroid";
import { Game } from "../Game";

export class Universe {
    protected starting_position = new p5.Vector;

    constructor(
        public readonly universe_size: number,
        public readonly universe_density: number,
        public readonly system_density: number,
        public readonly game: Game,
    ) {
    }

    public get_starting_position(): p5.Vector {
        return this.starting_position;
    }

    public generate() {
        this.genreate_asteroids();
        this.generate_starting_condition();
        this.generate_enemy_starting_condition();
    }

    protected genreate_asteroids() {
        const universe_size = this.universe_size;
        const universe_max_systems = universe_size / 70;
        const universe_systems = universe_max_systems * this.universe_density;
        // const dice1 = Math.floor(Math.random() * universe_systems / 3) + 1;
        // const dice2 = Math.floor(Math.random() * universe_systems / 3) + 1;
        // const dice3 = Math.floor(Math.random() * universe_systems / 3) + 1;
        {
            const systems_random = Math.random();
            const systems_random_smooth = systems_random * systems_random * 0.75 + 0.25;
            const count = systems_random_smooth * universe_systems;
            for (let i = 0; i < count; ++i) {
                const size = this.asteroid_distribution_function(Math.random()) * 800;
                const dist = (Math.random() * 0.6 + 0.2) * universe_size;
                const center = p5.Vector.random2D().mult(dist);
                this.create_system(center, size);
            }
        }
    }

    protected generate_starting_condition() {
        const count = 200;
        const center = p5.Vector.random2D().mult((Math.random() * 0.25) * this.universe_size + 0.6).add(this.universe_size / 2, this.universe_size / 2);
        for (let i = 0; i < count; ++i) {
            const off = p5.Vector.random2D().mult(10);

            this.game.swarm.queue_new_drone(center.copy().add(off));
        }
        this.create_system(center, 150);
        this.starting_position = center;
    }

    protected generate_enemy_starting_condition() {
        for (let i = 0; i < 10; ++i) {
            const ship = new OrganicShip(this.game, new p5.Vector().copy());
            this.game.add_game_object(ship);
        }
    }


    public create_system(center: p5.Vector, system_size: number) {
        const system_max_bodies = system_size / 5;
        const system_bodies = system_max_bodies * this.system_density;

        const dice1 = Math.floor(Math.random() * system_bodies / 2) + 1;
        const dice2 = Math.floor(Math.random() * system_bodies / 2) + 1;
        const count = dice1 + dice2;
        for (let i = 0; i < count; ++i) {
            const dist = this.asteroid_distribution_function(Math.random()) * system_size;
            const pos = p5.Vector.random2D().mult(dist).add(center);
            const asteroid = new Asteroid(this.game, pos);
            this.game.add_game_object(asteroid);
        }
    }

    protected asteroid_distribution_function(x: number) {
        return 1 - ((x) * (0.4 - x) * (0.9 - x) * 11) - 0.5;
    }

    public is_point_inside(pos: p5.Vector): boolean {
        return pos.magSq() < this.universe_size * this.universe_size;
    }

    public draw(p: p5) {
        p.noFill();
        p.stroke(50, 50, 200);
        p.strokeWeight(this.universe_size / 1000);
        p.ellipse(0, 0, this.universe_size * 2, this.universe_size * 2);
    }
}