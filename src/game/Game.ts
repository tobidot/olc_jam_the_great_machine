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

    public game_object_tree: QuadTree<ColliderObject> = new QuadTree<ColliderObject>({ x: 0, y: 0, w: 100, h: 100 });
    public game_objects: Array<GameObject> = [];

    public universe: Universe = new Universe(5000, 0, 0, this);

    public debug_stats = {
        active: true,
        fps: new PerformanceTracker(),
        drones_allive: 0,
    };

    constructor() {
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


    public for_each(callback: (game_object: GameObject) => void) {
        this.game_objects.forEach(callback);
    }

    public init(p: p5 & p5.SoundFile) {
        const images = require('../assets/images/*.png');
        const sounds = require('../assets/sound/*.mp3');
        p.loadSound(sounds.the_great_machine_no_lead, (sound: p5.SoundFile) => {
            sound.setLoop(true);
            // sound.play();
            this.shared.background_music.set(sound);
        });

        p.noSmooth();
        p.mouseWheel = (event: { delta: number }) => {
            if (event.delta > 0) this.camera.zoom_in();
            if (event.delta < 0) this.camera.zoom_out();
        };
        let prevMouse = new p5.Vector();
        p.mousePressed = () => {
            const x = p.mouseX;
            const y = p.mouseY;
            if (y < 500) {
                prevMouse.set(x, y);
            } else {
                this.menu.mouse_pressed(x, y);
            }
        }
        p.mouseDragged = (event) => {
            const x = p.mouseX;
            const y = p.mouseY;
            const drag = prevMouse.copy().sub(x, y);
            if (y < 500) {
                this.camera.move(drag.mult(-1 / this.camera.zoom));
                prevMouse.set(x, y);
            } else {
                this.menu.mouse_dragged(x, y, drag);
            }
        }
        p.keyPressed = () => {
            if (p.keyIsDown(32)) this.camera.target(this.swarm.center.mult(-1));
        };

        this.game_object_tree = new QuadTree<ColliderObject>({
            x: -this.universe.universe_size,
            y: -this.universe.universe_size,
            w: this.universe.universe_size * 2,
            h: this.universe.universe_size * 2
        });

        this.universe = new Universe(5000, 0.6, 0.3, this);
        this.universe.generate();
        this.camera.target_position.set(this.camera.position.set(this.universe.get_starting_position().copy().mult(-1)));


    }


    public update(dt: number, p: p5) {
        for (let i = 0; i < this.stellar_bodies.length; ++i) {
            const body = this.stellar_bodies[i];
            if (body === null) break;
            body.reset_frame_buffers();
            body.update(dt);
            if (body.is_to_delete) {
                this.stellar_bodies[i] = this.stellar_bodies[this.stellar_bodies.length - 1];
                this.stellar_bodies[this.stellar_bodies.length - 1] = null;
            }
        }
        this.swarm.update(dt);
        this.organic_ships.forEach((ship) => {
            if (ship === null) return;
            ship.update(dt, p, this.swarm.drones);

            if (this.universe.is_point_inside(ship.position)) {
                ship.position.set(0, 0);
            }
        });

        if ((this.ship_spawn -= dt) < 0) {
            this.ship_spawn = 60;
            const ship = new OrganicShip(this, new p5.Vector().copy());
            this.organic_ships.push(ship);
        }
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