import { helper } from "../../../game/tools/Rect";
import { TreeElementNotFoundException } from "./exceptions/TreeElementNotFoundException";

export class QuadTree<T extends helper.IRect> {
    private items: Array<T> = [];

    public pick(rect: helper.IRect): Array<T> {
        return [];
    }

    public add(element: T): void {
        this.items.push(element);
    }

    public remove(element: T) {
        const id = this.items.findIndex((other: T) => element === other);
        if (id === -1) throw new TreeElementNotFoundException();
        delete this.items[id];
    }

    public is_empty(): boolean {
        return this.items.length === 0;
    }
}