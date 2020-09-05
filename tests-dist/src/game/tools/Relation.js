"use strict";
exports.__esModule = true;
exports.Relation = void 0;
var Relation = /** @class */ (function () {
    function Relation(a, b, relation_reference) {
        this.a = a;
        this.b = b;
        this.relation_reference = relation_reference;
    }
    Relation.prototype.get_left = function () {
        if (!this.is_relation_intact()) {
            return null;
        }
        return this.a;
    };
    Relation.prototype.get_right = function () {
        if (!this.is_relation_intact()) {
            return null;
        }
        return this.b;
    };
    Relation.prototype.is_relation_intact = function () {
        return this.a[this.relation_reference] === this &&
            this.b[this.relation_reference] === this;
    };
    Relation.connect_relation = function (relation_class, a, b, relation_reference) {
        var relation = new relation_class(a, b, relation_reference);
        a[relation.relation_reference] = relation;
        b[relation.relation_reference] = relation;
        return relation;
    };
    return Relation;
}());
exports.Relation = Relation;
