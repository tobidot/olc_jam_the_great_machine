import p5 from "p5";
import { StelarBody } from "./bodies/StellarBody";
import { Asteroid } from "./bodies/Asteroid";
import { Drone } from "./drones/Drone";
import { Camera } from "./helper/Camera";
import { DroneSwarm } from "./drones/DroneSwam";
import { OrganicShip } from "./enemies/OrganicShips";
import { Effect } from "./effects/Effect";
import { GameMenu } from "./game-menu/GameMenu";
import { Shared } from "../shared/Shared";
import { QuadTree } from "../tools/signals/trees/QuadTree";
import { GameObject } from "./object/GameObject";
import { Universe } from "./general/Universe";
import { ColliderObject } from "./collision/Colider";
import { PerformanceTracker } from "./tools/PerformanceTracker";
import { HabitablePlanet } from "./bodies/HabitablePlanet";

export class Game {
    private shared: Shared = Shared.get_instance();
    private camera: Camera = new Camera;
    private menu: GameMenu = new GameMenu(this);
    private ship_spawn: number = 60;
    private background_music: any;

    // entities
    public swarm: DroneSwarm = new DroneSwarm(this);
    private stellar_bodies: Array<StelarBody | null> = [];
    private organic_ships: Array<OrganicShip | null> = [];
    private effects: Array<Effect> = [];
    public aim: p5.Vector = new p5.Vector;
    public control = {
        distance: 100,
        speed: 50,
        offset: new p5.Vector
    }

    public game_object_tree: QuadTree<ColliderObject> = new QuadTree<ColliderObject>({ x: 0, y: 0, w: 100, h: 100 });
    public game_objects: Array<GameObject> = [];

    public universe: Universe = new Universe(5000, 0, 0, 0, 0, this);



    public game_stats = {
        enemy_ships: 0,
        habitats_remaining: 0,
        asteroids_remaining: 0,
        asteroids_remaining_percent: 0,
        drones: 0,
    }
    public debug_stats = {
        active: this.shared.debug_mode.get(),
        fps: new PerformanceTracker(),
        drones_allive: 0,
    };

    constructor() {
        this.shared.debug_mode.add((mode) => {
            this.debug_stats.active = mode.new;
        });
        this.shared.game.set(this);
    }

    public add_game_object(object: GameObject) {
        if (object instanceof ColliderObject) {
            this.game_object_tree.add(object);
        }

        if (object instanceof OrganicShip) {
            return this.organic_ships.push(object);
        } else if (object instanceof Drone) {
            return  // this.swarm.queue_new_drone()
        } else if (object instanceof Effect) {
            return this.effects.push(object);
        } else if (object instanceof StelarBody) {
            return this.stellar_bodies.push(object);
        }
        throw "";
    }

    public remove_game_object(object: GameObject) {
        object.before_destroy();
        if (object instanceof ColliderObject) {
            this.game_object_tree.remove(object);
        }
        if (object instanceof OrganicShip) {
            const id = this.organic_ships.findIndex((check) => object === check);
            if (id !== -1) this.organic_ships[id] = null;
        }
    }


    public for_each(callback: (game_object: GameObject) => void) {
        this.game_objects.forEach(callback);
    }

    public init(p: p5) {
        const images = require('../assets/images/*.png');
        const sounds = require('../assets/sound/*.mp3');
        if (p.hasOwnProperty('loadSound')) {
            const loadSound = (<any>p).loadSound;
            loadSound(sounds.the_great_machine_no_lead, (sound) => {
                sound.setLoop(true);
                // sound.play();
                this.shared.background_music.set(sound);
            });
        }

        p.noSmooth();
        p.mouseWheel = (event: { delta: number }) => {
            if (event.delta > 0) this.camera.zoom_in();
            if (event.delta < 0) this.camera.zoom_out();
        };
        let prevMouse = new p5.Vector();
        p.mousePressed = () => {
            const x = p.mouseX;
            const y = p.mouseY;
            prevMouse.set(x, y);
            if (p.mouseButton === p.LEFT) {
                this.menu.mouse_pressed(x, y);
            } else if (p.mouseButton === p.RIGHT) {
                const x = (p.mouseX - 400) / this.camera.zoom - this.camera.position.x;
                const y = (p.mouseY - 300) / this.camera.zoom - this.camera.position.y;
                this.aim.set(x, y);
            }
        }
        p.mouseDragged = (event) => {
            const x = p.mouseX;
            const y = p.mouseY;
            const drag = prevMouse.copy().sub(x, y);
            prevMouse.set(x, y);
            if (p.mouseButton === p.LEFT) {
                if (this.menu.mouse_dragged(x, y, drag)) return;
                // const x = (p.mouseX - 400) / this.camera.zoom - this.camera.position.x;
                // const y = (p.mouseY - 300) / this.camera.zoom - this.camera.position.y;
                // this.aim.set(x, y);
                this.camera.move(drag.mult(-1 / this.camera.zoom));
            }
        }
        p.keyPressed = () => {
            if (p.keyIsDown(32)) this.camera.target(this.swarm.center.mult(-1));
        };

        this.restart_game();

    }


    public restart_game() {
        this.swarm.drones.forEach((drone) => {
            if (drone) drone.before_destroy();
        });
        this.swarm.drones = [];
        this.stellar_bodies.forEach((body) => {
            if (body) body.before_destroy();
        });
        this.stellar_bodies = [];
        this.organic_ships.forEach((ship) => {
            ship?.before_destroy();
        })
        this.organic_ships = [];
        this.game_objects = [];


        this.universe = new Universe(
            this.shared.universe_size.get(),
            this.shared.asteroid_density.get(),
            this.shared.system_density.get(),
            this.shared.planets.get(),
            this.shared.drones.get(),
            this
        );
        const tree_size = this.universe.universe_size * 1.5 + 500;
        this.game_object_tree = new QuadTree<ColliderObject>({
            x: -tree_size,
            y: -tree_size,
            w: tree_size * 2,
            h: tree_size * 2
        });
        this.universe.generate();
        this.camera.target_position.set(this.camera.position.set(this.universe.get_starting_position().copy().mult(-1)));


    }


    public update(dt: number, p: p5) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            if (body === null) continue;
            body.reset_frame_buffers();
            body.update(dt);
            if (body.is_to_delete) {
                body.before_destroy();
                this.game_object_tree.remove(body);
                this.stellar_bodies[i] = null;
            }
        }
        this.swarm.update(dt);
        this.organic_ships.forEach((ship) => {
            if (ship === null) return;
            if (ship.state.is_to_delete) {
                return this.remove_game_object(ship);
            }
            ship.update(dt, p, this.swarm.drones);
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

        if (this.debug_stats.active) {
            this.debug_stats.drones_allive = this.swarm.drones.length;
            this.debug_stats.fps.update();
        }
        {
            this.game_stats.enemy_ships = this.organic_ships.filter(body => body !== null).length;
            this.game_stats.habitats_remaining = this.stellar_bodies.filter(body => body && body instanceof HabitablePlanet).length;
            this.game_stats.asteroids_remaining = this.stellar_bodies.filter(body => body && body instanceof Asteroid).length;
            this.game_stats.asteroids_remaining_percent = 100 * this.game_stats.asteroids_remaining / this.universe.initial_asteroids;
            this.game_stats.drones = this.swarm.drones.length;
        }
    }

    public draw(p: p5) {
        p.background(0);
        p.push();
        p.translate(400, 300);
        p.scale(this.camera.zoom);
        p.translate(this.camera.position);
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            if (body === null) continue;
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
            if (ship) ship.draw(p, this.camera);
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

        p.stroke(0, 0, 200);
        p.strokeWeight(2 / this.camera.zoom);
        p.fill(200, 200, 0);
        p.ellipse(this.aim.x, this.aim.y, 20 / this.camera.zoom, 20 / this.camera.zoom);

        this.debug_draw(p);
        p.pop();
        this.menu.draw(p);
    }

    public debug_draw(p: p5) {
        if (!this.debug_stats.active) return;
        this.game_object_tree.debug_draw(p);
        // mouse in game coords
        const x = (p.mouseX - 400) / this.camera.zoom - this.camera.position.x;
        const y = (p.mouseY - 300) / this.camera.zoom - this.camera.position.y;
        p.fill(0, 200, 0);
        p.ellipse(x, y, 20 / this.camera.zoom, 20 / this.camera.zoom);
        const all_selected = this.game_object_tree.pick({
            x,
            y,
            w: 0,
            h: 0,
        });
        p.noFill();
        p.stroke(255, 0, 0);
        for (let selected of all_selected) {
            p.rect(selected.x, selected.y, selected.w, selected.h);
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