import { TestClass } from "../base/TestClass";
import { Relation } from "../../src/game/tools/Relation";


export class RelationTest extends TestClass {
    private a: Link = new Link;
    private b: Link = new Link;
    private c: Link = new Link;

    public set_up() {
        this.a = new Link;
        this.a.value = 5;
        this.b = new Link;
        this.a.value = 10;
        this.c = new Link;
        this.a.value = 20;
    }

    public test_create_relation() {
        let relation = LinkLinkRelation.connect(this.a, this.b);
        this.assertInstanceOf(relation, LinkLinkRelation);
    }

    public test_connected_relations_are_not_null() {
        let relation = LinkLinkRelation.connect(this.a, this.b);
        this.assertNotEquals(relation.get_left(), null);
        this.assertNotEquals(relation.get_right(), null);
    }

    public test_connected_objects_have_reference_to_relation() {
        let relation = LinkLinkRelation.connect(this.a, this.b);
        this.assertEquals(this.a.link_link_relation, relation);
        this.assertEquals(this.b.link_link_relation, relation);
    }

    public test_new_relation_invalidates_old_relation() {
        const relation_ab = LinkLinkRelation.connect(this.a, this.b);
        const relation_bc = LinkLinkRelation.connect(this.b, this.c);

        const related_b_from_a = this.a.link_link_relation;
        this.assertEquals(relation_ab, related_b_from_a);
        this.assertEquals(related_b_from_a.get_left(), null);
        this.assertEquals(related_b_from_a.get_right(), null);

        const relation_ba = LinkLinkRelation.connect(this.b, this.a);
        const related_b_from_c = this.c.link_link_relation;
        this.assertEquals(this.b.link_link_relation, relation_ba);
        this.assertEquals(related_b_from_c.get_left(), null);
        this.assertEquals(related_b_from_c.get_right(), null);
    }

    public test_with_multiple_relation_names_still_finds_other_object() {
        let user: User = new User;
        let comment: Comment = new Comment;
        let post = new Post;
        const comment_user = CommentUserRelation.connect(comment, user);
        const comment_post = CommentPostRelation.connect(comment, post);
        this.assertEquals(comment_user.get_left(), comment);
        this.assertEquals(comment_user.get_right(), user);
        this.assertEquals(comment_post.get_left(), comment);
        this.assertEquals(comment_post.get_right(), post);
    }

}


/**
 * Special Types
 */

class LinkLinkRelation extends Relation<Link | null, Link | null> {
    public constructor(link_left: Link | null, link_right: Link | null, relation?: string) {
        super(link_left, link_right, relation ? relation : 'link_link_relation');
    }
    public get_other(link: Link): Link | null {
        const left = this.get_left();
        const right = this.get_right();
        if (left === link) return right;
        return left;
    }
    public static connect(link_left: Link | null, link_right: Link | null, relation?: string): LinkLinkRelation {
        return Relation.connect_relation<Link | null, Link | null, LinkLinkRelation>(LinkLinkRelation, link_left, link_right, relation);
    }
}

interface LinkRelatable {
    link_link_relation: LinkLinkRelation;
}

class Link implements LinkRelatable {
    public link_link_relation = new LinkLinkRelation(null, null);
    public value: number = 0;
}

class CommentUserRelation extends Relation<Comment | null, User | null> {
    public constructor(comment: Comment | null, user: User | null, relation?: string) {
        super(comment, user, relation ? relation : 'comment_user_relation');
    }
    public get_comment(): Comment | null { return this.get_left(); }
    public get_user(): User | null { return this.get_right(); }

    public static connect(comment: Comment | null, user: User | null, relation?: string): CommentUserRelation {
        return Relation.connect_relation<Comment | null, User | null, CommentUserRelation>(CommentUserRelation, comment, user, relation);
    }
}

class CommentPostRelation extends Relation<Comment | null, Post | null> {
    public constructor(comment: Comment | null, post: Post | null, relation?: string) {
        super(comment, post, relation ? relation : 'comment_post_relation');
    }
    public get_comment(): Comment | null { return this.get_left(); }
    public get_post(): Post | null { return this.get_right(); }

    public static connect(comment: Comment | null, post: Post | null, relation?: string): CommentPostRelation {
        return Relation.connect_relation<Comment | null, Post | null, CommentPostRelation>(CommentPostRelation, comment, post, relation);
    }
}

interface UserCommentRelatable {
    comment_user_relation: CommentUserRelation;
}

interface CommentPostRelatable {
    comment_post_relation: Relation<Comment | null, Post | null>;
}

class Comment implements UserCommentRelatable, CommentPostRelatable {
    comment_user_relation = new CommentUserRelation(null, null);
    comment_post_relation = new CommentPostRelation(null, null);
}

class User implements UserCommentRelatable {
    comment_user_relation = new CommentUserRelation(null, null);
}

class Post implements CommentPostRelatable {
    comment_post_relation = new CommentPostRelation(null, null);
}