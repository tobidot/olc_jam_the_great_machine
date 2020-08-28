import p5 from "p5";

export class Game {
    public static assets: {
        sprinkler?: p5.Image,
        mud?: p5.Image,
        gras?: p5.Image,
        stones?: p5.Image,
        flowers?: p5.Image,
        action_next?: p5.Image,
    } = {};

    constructor() {

    }

    public init(p: p5) {
        const images = require('../assets/images/*.png');
        p.loadImage(images.sprinkler, (image) => { Game.assets.sprinkler = image; });
        p.loadImage(images.mud, (image) => { Game.assets.mud = image; });
        p.loadImage(images.flowers, (image) => { Game.assets.flowers = image; });
        p.loadImage(images.gras, (image) => { Game.assets.gras = image; });
        p.loadImage(images.stones, (image) => { Game.assets.stones = image; });
        p.loadImage(images.action_next, (image) => { Game.assets.action_next = image; });

        p.mousePressed = () => {
            const x = p.mouseX;
            const y = p.mouseY;
        }
    }

    public update(dt: number) {
    }

    public draw(p: p5) {
        p.background(0);


    }

}