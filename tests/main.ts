import { TestClass } from "./base/TestClass";
import { RelationTest } from "./features/RelationTest";
import { QuadTreeTest } from "./features/QuadTreeTest";

(() => {
    const argv = (<any>process).argv;
    const single_test_case_name = argv[2] || null;

    const tests: Array<TestClass> = [
        new QuadTreeTest(),
        new RelationTest(),
    ].filter((test_instance: any) => {
        return single_test_case_name === null || single_test_case_name === test_instance.__proto__.constructor.name;
    });

    console.log('Starting Tests ... ');
    for (const test of tests) {
        test.set_class_up();
        for (const test_name of Object.getOwnPropertyNames((<any>test).__proto__)) {
            const test_statement = test[test_name];
            if (typeof test_statement === "function" && test_name.indexOf('test') === 0) {
                console.log('\x1b[33mRun %s\x1b[0m', test_name);
                test.set_up();
                test_statement.call(test);
                test.tear_down();
                console.log('\x1b[32m%s\x1b[0m', 'Done.');
            }
        }
        test.tear_class_down();
    }
    console.log(' ... Tests finished');
})();