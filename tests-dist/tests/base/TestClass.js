"use strict";
exports.__esModule = true;
exports.TestClass = void 0;
var TestClass = /** @class */ (function () {
    function TestClass() {
    }
    TestClass.prototype.set_up = function () { console.log(this); };
    TestClass.prototype.tear_down = function () { };
    TestClass.prototype.set_class_up = function () { };
    TestClass.prototype.tear_class_down = function () { };
    TestClass.prototype.assertInstanceOf = function (value, expected) {
        if (false === value instanceof expected) {
            throw new Error('Expected ' + (value === null || value === void 0 ? void 0 : value.toString()) + ' to be of instance ' + expected.name);
        }
        this.success();
    };
    TestClass.prototype.assertEquals = function (value, expected) {
        if (value !== expected) {
            throw new Error('Expected ' + String(value) + ' to be equal to ' + String(expected));
        }
        this.success();
    };
    TestClass.prototype.assertNotEquals = function (value, expected) {
        if (value === expected) {
            throw new Error('Expected ' + String(value) + ' to be NOT equal to ' + String(expected));
        }
        this.success();
    };
    TestClass.prototype.assertTrue = function (value) {
        if (value === false) {
            throw new Error('Expected ' + String(value) + ' to be true');
        }
        this.success();
    };
    TestClass.prototype.assertFalse = function (value) {
        if (value === true) {
            throw new Error('Expected ' + String(value) + ' to be false');
        }
        this.success();
    };
    TestClass.prototype.success = function () {
        console.log('.');
    };
    return TestClass;
}());
exports.TestClass = TestClass;
