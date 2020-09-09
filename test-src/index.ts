import { RelationTest } from "./features/RelationTest";
import { QuadTreeTest } from "./features/QuadTreeTest";
import { TestDashboard } from "@game.object/ts-game-toolbox/dist/src/testing/TestDashboard";

const element = document.getElementById('test-dashboard');
if (!element) throw new Error('Element not found');
const dashboard = new TestDashboard();
element.append(dashboard.get_element());

dashboard.add_test([
    new QuadTreeTest(),
    new RelationTest(),
]);
