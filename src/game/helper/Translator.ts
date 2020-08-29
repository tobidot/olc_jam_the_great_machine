type Translation<A, B> = (input: A) => B

export class Translator<SOURCE, TARGET> {

    constructor(
        private readonly source_type: string,
        private readonly from_source_to_target: Translation<SOURCE, TARGET>,
        private readonly target_type: string,
        private readonly from_target_to_source: Translation<TARGET, SOURCE>,
    ) {

    }

    public translate(value: SOURCE): TARGET {
        return this.from_source_to_target(value);
    }

    public translate_to_target(value: SOURCE): TARGET {
        return this.from_source_to_target(value);
    }

    public translate_to_source(value: TARGET): SOURCE {
        return this.from_target_to_source(value);
    }

    public translate_to(value: SOURCE | TARGET, target: string = this.target_type): SOURCE | TARGET {
        switch (target) {
            case this.target_type:
                return this.translate_to_target(value as SOURCE);
            case this.source_type:
                return this.translate_to_source(value as TARGET);
            default:
                throw "invalid target type type";
        }
    }
}

export type SameTypeTranslator<T> = Translator<T, T>;