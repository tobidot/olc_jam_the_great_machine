import p5 from "p5";
import { Translator, SameTypeTranslator } from "./Translator";

export class CoordinateSystem {
    public constructor(
        public fix: p5.Vector = new p5.Vector().set(0, 0),
        public x_axis: p5.Vector = new p5.Vector().set(1, 0),
        public y_axis: p5.Vector = new p5.Vector().set(0, 1),
    ) {

    }

    public create_translator_to(
        target_system: CoordinateSystem,
        source_name: string = 'source',
        target_name: string = 'target',
    ): SameTypeTranslator<p5.Vector> {
        return new Translator<p5.Vector, p5.Vector>(
            source_name,
            (source_pos: p5.Vector) => {
                return this.transform_to(source_pos, target_system);
            },
            target_name,
            (target_pos: p5.Vector) => {
                return target_system.transform_to(target_pos, this);
            }
        );
    }

    public transform_to_global(local_pos: p5.Vector): p5.Vector {
        const x_vector = p5.Vector.mult(this.x_axis, local_pos.x);
        const y_vector = p5.Vector.mult(this.y_axis, local_pos.y);
        const global_pos = x_vector.add(y_vector).add(this.fix);
        return global_pos;
    }


    public transform_from_global(global_pos: p5.Vector): p5.Vector {
        const target_relative = global_pos.sub(this.fix);
        const x_length = target_relative.dot(this.x_axis) / this.x_axis.magSq();
        const y_length = target_relative.dot(this.y_axis) / this.y_axis.magSq();
        return new p5.Vector().set(x_length, y_length);
    }

    public transform_to(source_pos: p5.Vector, target_system: CoordinateSystem): p5.Vector {
        return target_system.transform_from_global(this.transform_to_global(source_pos));
    }
}

export class FixedCenteredIntegerCoordinateSystem extends CoordinateSystem {
    public transform_to_global(local_pos: p5.Vector): p5.Vector {
        const x_vector = p5.Vector.mult(this.x_axis, local_pos.x + 0.5);
        const y_vector = p5.Vector.mult(this.y_axis, local_pos.y + 0.5);
        const global_pos = x_vector.add(y_vector).add(this.fix);
        return global_pos;
    }

    public transform_from_global(global_pos: p5.Vector): p5.Vector {
        const transformed = super.transform_from_global(global_pos);
        return transformed.set(
            Math.floor(transformed.x),
            Math.floor(transformed.y),
        );
    }
}