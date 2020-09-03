export interface IRect {
    x: number, y: number, w: number, h: number
}


export namespace helper {

    export class Rect implements IRect {
        public constructor(public x: number = 0, public y: number = 0, public w: number = 0, public h: number = 0) {

        }

        public contains(x: number, y: number) {
            return helper.rect.contains(this, x, y)
        }
    }

    export namespace rect {
        export function contains(rect: IRect, x: number, y: number) {
            return (x > rect.x && y > rect.y && x < rect.x + rect.w && y < rect.y + rect.h);
        }
    }
}