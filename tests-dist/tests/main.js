"use strict";
exports.__esModule = true;
var RelationTest_1 = require("./features/RelationTest");
(function () {
    console.log('Starting Tests ... ');
    var tests = [
        new RelationTest_1.RelationTest()
    ];
    for (var _i = 0, tests_1 = tests; _i < tests_1.length; _i++) {
        var test = tests_1[_i];
        test.set_class_up();
        for (var test_name in test) {
            var test_statement = test[test_name];
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
