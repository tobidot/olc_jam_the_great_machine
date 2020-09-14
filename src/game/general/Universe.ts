import { GameObject } from "../game-objects/base/GameObject";
import p5, { Vector } from "p5";
import { OrganicShip } from "../game-objects/organic-ship/OrganicShips";
import { Asteroid } from "../game-objects/stelar-bodies/Asteroid";
import { Game } from "../Game";
import { HabitablePlanet } from "../game-objects/stelar-bodies/HabitablePlanet";
import { Drone } from "../game-objects/drone/Drone";

export class Universe {
    protected starting_position = new p5.Vector;
    public initial_mass = 0;
    public initial_asteroids = 0;

    constructor(
        public readonly universe_size: number,
        public readonly universe_density: number,
        public readonly system_density: number,
        public readonly planets: number,
        public readonly drones: number,
        public readonly game: Game,
    ) {
    }

    public get_starting_position(): p5.Vector {
        return this.starting_position;
    }

    public generate() {
        this.initial_mass = 0;
        this.initial_asteroids = 0;
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
        const count = this.drones;
        const center = p5.Vector.random2D().mult((Math.random() * 0.25) * this.universe_size + 0.6).add(this.universe_size / 2, this.universe_size / 2);
        for (let i = 0; i < count; ++i) {
            const off = p5.Vector.random2D().mult(10);
            const drone = new Drone(this.game, this.game.swarm, center.copy().add(off));
            this.game.game_object_collection.add(drone);
        }
        this.create_system(center, 150);
        this.starting_position = center;
    }

    protected generate_enemy_starting_condition() {
        for (let i = 0; i < this.planets; ++i) {
            const planet_pos = this.random_point_inside().mult(0.8);
            // const ship = new OrganicShip(this.game, planet_pos);
            const planet = new HabitablePlanet(this.game, planet_pos);
            // planet.ships.push(ship);
            // this.game.add_game_object(ship);
            this.game.game_object_collection.add(planet);
            this.initial_mass += planet.get_mass_center().mass;
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
            this.game.game_object_collection.add(asteroid);
            this.initial_mass += asteroid.get_mass_center().mass;
            this.initial_asteroids++;
        }
    }

    protected asteroid_distribution_function(x: number) {
        return 1 - ((x) * (0.4 - x) * (0.9 - x) * 11) - 0.5;
    }

    public random_point_inside(): p5.Vector {
        return p5.Vector.random2D().setMag(Math.random() * this.universe_size);
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