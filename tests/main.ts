import { TestClass } from "./base/TestClass";
import { RelationTest } from "./features/RelationTest";

(() => {
    console.log('Starting Tests ... ');
    const tests: Array<TestClass> = [
        new RelationTest()
    ];
    for (const test of tests) {
        test.set_class_up();
        for (const test_name in test) {
            const test_statement = test[test_name];
            if (typeof test_statement === "function" && test_name.indexOf('test') === 0) {
                console.log('Run ' + test_name);
                test.set_up();
                test_statement.call(test);
                test.tear_down();
                console.log('Done.');
            }
        }
        test.tear_class_down();
    }
    console.log(' ... Tests finished');
})();