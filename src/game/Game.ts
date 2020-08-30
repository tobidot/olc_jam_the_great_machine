import p5 from "p5";
import { StelarBody } from "./bodies/StellarBody";
import { Asteroid } from "./bodies/Asteroid";
import { Drone } from "./drones/Drone";
import { Camera } from "./helper/Camera";
import { DroneSwarm } from "./drones/DroneSwam";
import { OrganicShip } from "./enemies/OrganicShips";
import { Effect } from "./effects/Effect";

export class Game {
    private stellar_bodies: Array<StelarBody> = [];
    private camera: Camera = new Camera;
    private swarm: DroneSwarm = new DroneSwarm(this);
    private organic_ships: Array<OrganicShip> = [];
    private effects: Array<Effect> = [];


    public readonly universe_size = 5000;
    public readonly universe_density = 0.6;
    public readonly system_density = 0.3;


    constructor() {

    }

    public init(p: p5) {
        const images = require('../assets/images/*.png');

        p.mouseWheel = (event: { delta: number }) => {
            if (event.delta > 0) this.camera.zoom_in();
            if (event.delta < 0) this.camera.zoom_out();
        };
        let prevMouse = new p5.Vector();
        p.mousePressed = () => {
            const x = p.mouseX;
            const y = p.mouseY;
            prevMouse.set(x, y);
        }
        p.mouseDragged = (event) => {
            const x = p.mouseX;
            const y = p.mouseY;
            this.camera.move(prevMouse.copy().sub(x, y).mult(-1 / this.camera.zoom));
            prevMouse.set(x, y);
        }
        p.keyPressed = () => {
            if (p.keyIsDown(32)) this.camera.target(this.swarm.center.mult(-1));
        };

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

        {
            const count = 10;
            const center = p5.Vector.random2D().mult((Math.random() * 0.25) * universe_size + 0.6).add(universe_size / 2, universe_size / 2);
            for (let i = 0; i < count; ++i) {
                const off = p5.Vector.random2D().mult(10);
                this.swarm.queue_new_drone(center.copy().add(off));
            }
            this.create_system(center, 150);
            this.camera.target_position.set(this.camera.position.set(center.copy().mult(-1)));



        }

        for (let i = 0; i < 10; ++i) {
            const ship = new OrganicShip(this, new p5.Vector().copy());
            this.organic_ships.push(ship);
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
            const asteroid = new Asteroid(pos);
            this.stellar_bodies.push(asteroid);
        }
    }

    public asteroid_distribution_function(x: number) {
        return 1 - ((x) * (0.4 - x) * (0.9 - x) * 11) - 0.5;
    }

    public update(dt: number, p: p5) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            body.reset_frame_buffers();
            body.update(dt);
            if (body.is_to_delete) {
                this.stellar_bodies.splice(i, 1);
            }
        }
        this.swarm.update(dt, this.stellar_bodies);
        this.organic_ships.forEach((ship) => {
            ship.update(dt, p, this.swarm.drones);

            const dist_to_univers_center = ship.position.magSq();
            if (dist_to_univers_center > this.universe_size * this.universe_size) {
                ship.position.set(0, 0);
            }
        });
        this.effects = this.effects.filter((effect) => {
            effect.update(dt);
            return !effect.is_finished;
        });

        const cam_speed = 400 / this.camera.zoom;
        if (p.keyIsDown(p.LEFT_ARROW) || p.keyIsDown(65)) {
            this.camera.move(new p5.Vector().set(dt * cam_speed, 0));
        }
        if (p.keyIsDown(p.RIGHT_ARROW) || p.keyIsDown(68)) {
            this.camera.move(new p5.Vector().set(-dt * cam_speed, 0));
        }
        if (p.keyIsDown(p.UP_ARROW) || p.keyIsDown(87)) {
            this.camera.move(new p5.Vector().set(0, dt * cam_speed));
        }
        if (p.keyIsDown(p.DOWN_ARROW) || p.keyIsDown(83)) {
            this.camera.move(new p5.Vector().set(0, -dt * cam_speed));
        }
        this.camera.update(dt);
    }

    public draw(p: p5) {
        p.background(0);
        p.translate(400, 300);
        p.scale(this.camera.zoom);
        p.translate(this.camera.position);
        p.noFill();
        p.stroke(50, 50, 200);
        p.strokeWeight(this.universe_size / 1000);
        p.ellipse(0, 0, this.universe_size * 2, this.universe_size * 2);
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];

            if (this.should_object_be_drawn(body.get_position())) {
                const rough_drawing = this.camera.zoom < 0.5;
                if (rough_drawing) {
                    body.draw_roughly(p);
                } else {
                    body.draw(p);
                }
            }
        }
        this.swarm.draw(p, this.camera);
        this.organic_ships.forEach((ship) => {
            ship.draw(p, this.camera);
        });
        this.effects.forEach((effect) => {
            effect.draw(p, this.camera);
        });

        if (this.camera.zoom <= .25) {
            p.noStroke();
            p.fill(200, 200, 0);
            p.ellipse(this.swarm.center.x, this.swarm.center.y, 25 / this.camera.zoom, 25 / this.camera.zoom);
            p.noFill();
            p.stroke(200, 0, 0);
            p.strokeWeight(5 / this.camera.zoom);
            p.ellipse(this.swarm.center.x, this.swarm.center.y, this.swarm.deviation * 2, this.swarm.deviation * 2);
        }
    }

    public should_object_be_drawn(pos: p5.Vector): boolean {
        if (this.camera.zoom < 0.1) return true;
        const diff = pos.copy().add(this.camera.position);
        const dist2 = diff.magSq();
        return dist2 < 400 * 400 / (this.camera.zoom * this.camera.zoom);
    }


    public add_effect(effect: Effect) {
        this.effects.push(effect);
    }
}