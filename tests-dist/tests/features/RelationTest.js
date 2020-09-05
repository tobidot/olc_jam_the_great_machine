"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.RelationTest = void 0;
var TestClass_1 = require("../base/TestClass");
var Relation_1 = require("../../src/game/tools/Relation");
var RelationTest = /** @class */ (function (_super) {
    __extends(RelationTest, _super);
    function RelationTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.a = new Link;
        _this.b = new Link;
        _this.c = new Link;
        return _this;
    }
    RelationTest.prototype.set_up = function () {
        this.a = new Link;
        this.a.value = 5;
        this.b = new Link;
        this.a.value = 10;
        this.c = new Link;
        this.a.value = 20;
    };
    RelationTest.prototype.test_create_relation = function () {
        var relation = LinkLinkRelation.connect(this.a, this.b);
        this.assertInstanceOf(relation, LinkLinkRelation);
    };
    RelationTest.prototype.test_connected_relations_are_not_null = function () {
        var relation = LinkLinkRelation.connect(this.a, this.b);
        this.assertNotEquals(relation.get_left(), null);
        this.assertNotEquals(relation.get_right(), null);
    };
    RelationTest.prototype.test_connected_objects_have_reference_to_relation = function () {
        var relation = LinkLinkRelation.connect(this.a, this.b);
        this.assertEquals(this.a.link_link_relation, relation);
        this.assertEquals(this.b.link_link_relation, relation);
    };
    RelationTest.prototype.test_new_relation_invalidates_old_relation = function () {
        var relation_ab = LinkLinkRelation.connect(this.a, this.b);
        var relation_bc = LinkLinkRelation.connect(this.b, this.c);
        var related_b_from_a = this.a.link_link_relation;
        this.assertEquals(relation_ab, related_b_from_a);
        this.assertEquals(related_b_from_a.get_left(), null);
        this.assertEquals(related_b_from_a.get_right(), null);
        var relation_ba = LinkLinkRelation.connect(this.b, this.a);
        var related_b_from_c = this.c.link_link_relation;
        this.assertEquals(this.b.link_link_relation, relation_ba);
        this.assertEquals(related_b_from_c.get_left(), null);
        this.assertEquals(related_b_from_c.get_right(), null);
    };
    RelationTest.prototype.test_with_multiple_relation_names_still_finds_other_object = function () {
        var user = new User;
        var comment = new Comment;
        var post = new Post;
        var comment_user = CommentUserRelation.connect(comment, user);
        var comment_post = CommentPostRelation.connect(comment, post);
        this.assertEquals(comment_user.get_left(), comment);
        this.assertEquals(comment_user.get_right(), user);
        this.assertEquals(comment_post.get_left(), comment);
        this.assertEquals(comment_post.get_right(), post);
    };
    return RelationTest;
}(TestClass_1.TestClass));
exports.RelationTest = RelationTest;
/**
 * Special Types
 */
var LinkLinkRelation = /** @class */ (function (_super) {
    __extends(LinkLinkRelation, _super);
    function LinkLinkRelation(link_left, link_right, relation) {
        return _super.call(this, link_left, link_right, relation ? relation : 'link_link_relation') || this;
    }
    LinkLinkRelation.prototype.get_other = function (link) {
        var left = this.get_left();
        var right = this.get_right();
        if (left === link)
            return right;
        return left;
    };
    LinkLinkRelation.connect = function (link_left, link_right, relation) {
        return Relation_1.Relation.connect_relation(LinkLinkRelation, link_left, link_right, relation);
    };
    return LinkLinkRelation;
}(Relation_1.Relation));
var Link = /** @class */ (function () {
    function Link() {
        this.link_link_relation = new LinkLinkRelation(null, null);
        this.value = 0;
    }
    return Link;
}());
var CommentUserRelation = /** @class */ (function (_super) {
    __extends(CommentUserRelation, _super);
    function CommentUserRelation(comment, user, relation) {
        return _super.call(this, comment, user, relation ? relation : 'comment_user_relation') || this;
    }
    CommentUserRelation.prototype.get_comment = function () { return this.get_left(); };
    CommentUserRelation.prototype.get_user = function () { return this.get_right(); };
    CommentUserRelation.connect = function (comment, user, relation) {
        return Relation_1.Relation.connect_relation(CommentUserRelation, comment, user, relation);
    };
    return CommentUserRelation;
}(Relation_1.Relation));
var CommentPostRelation = /** @class */ (function (_super) {
    __extends(CommentPostRelation, _super);
    function CommentPostRelation(comment, post, relation) {
        return _super.call(this, comment, post, relation ? relation : 'comment_post_relation') || this;
    }
    CommentPostRelation.prototype.get_comment = function () { return this.get_left(); };
    CommentPostRelation.prototype.get_post = function () { return this.get_right(); };
    CommentPostRelation.connect = function (comment, post, relation) {
        return Relation_1.Relation.connect_relation(CommentPostRelation, comment, post, relation);
    };
    return CommentPostRelation;
}(Relation_1.Relation));
var Comment = /** @class */ (function () {
    function Comment() {
        this.comment_user_relation = new CommentUserRelation(null, null);
        this.comment_post_relation = new CommentPostRelation(null, null);
    }
    return Comment;
}());
var User = /** @class */ (function () {
    function User() {
        this.comment_user_relation = new CommentUserRelation(null, null);
    }
    return User;
}());
var Post = /** @class */ (function () {
    function Post() {
        this.comment_post_relation = new CommentPostRelation(null, null);
    }
    return Post;
}());
