import { Drone } from "../drone/Drone";

export class GameObjectCollection {
    public drones: Array<Drone> = [];

    public update(dt: number) {

    }

    public clear() {
        this.drones.forEach((drone) => {
            if (drone) drone.before_destroy();
        });
        this.drones = [];
    }
}