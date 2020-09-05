import { QuadTree } from "../../src/tools/signals/trees/QuadTree";
import { TestClass } from "../base/TestClass";
import { helper } from "../../src/game/tools/Rect";
import p5 from "p5";
import { TreeElementNotFoundException } from "../../src/tools/signals/trees/exceptions/TreeElementNotFoundException";

export class QuadTreeTest extends TestClass {

    public tree = new QuadTree<DemoQuadElement<number>>();

    public set_up() {
        this.tree = new QuadTree();
    }

    public test_new_quad_tree_is_empty() {
        this.assert_true(this.tree.is_empty());
    }

    public test_quad_tree_pick_returns_empty_array() {
        const rect: helper.IRect = { x: 0, y: 0, w: 500, h: 500 };
        const result: Array<DemoQuadElement<number>> = this.tree.pick(rect);
        this.assert_true(result.length === 0);
    }

    public test_quad_tree_is_not_empty_after_add_element() {
        const element = new DemoQuadElement<number>(0, 0, 0, 0, 10);
        this.tree.add(element);
        this.assert_false(this.tree.is_empty());
    }

    public test_remove_element_from_empty_quad_tree_throws_element_not_found() {
        const element = new DemoQuadElement<number>(0, 0, 0, 0, 10);
        this.assert_exception(
            TreeElementNotFoundException,
            () => {
                this.tree.remove(element);
            }
        );
    }

    public test_quad_tree_is_empty_after_add_and_remove_element() {
        const element = new DemoQuadElement<number>(0, 0, 0, 0, 10);
        this.tree.add(element);
        this.tree.remove(element);
        this.assert_true(this.tree.is_empty());
    }

}

class DemoQuadElement<T> extends helper.Rect {
    public constructor(
        x: number, y: number, w: number, h: number, public data: T
    ) {
        super(x, y, w, h);
    }
}
