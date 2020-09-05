export class Relation<A, B> {
    public constructor(
        protected a: A,
        protected b: B,
        public readonly relation_reference: string,
    ) {
    }

    public get_left(): A | null {
        if (!this.is_relation_intact()) {
            return null;
        }
        return this.a;
    }

    public get_right(): B | null {
        if (!this.is_relation_intact()) {
            return null;
        }
        return this.b;
    }

    public is_relation_intact(): boolean {
        return this.a[this.relation_reference] === this &&
            this.b[this.relation_reference] === this;
    }

    public static connect_relation<A, B, R extends Relation<A, B>>(
        relation_class: { new(a: A, n: B, rel?: string): R },
        a: A,
        b: B,
        relation_reference?: string
    ): R {
        const relation = new relation_class(a, b, relation_reference);
        a[relation.relation_reference] = relation;
        b[relation.relation_reference] = relation;
        return relation;
    }
}