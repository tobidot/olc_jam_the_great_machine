export interface Rect {
    x: number, y: number, w: number, h: number
}

export namespace helper {
    export namespace rect {
        export function contains(rect: Rect, x: number, y: number) {
            return (x > rect.x && y > rect.y && x < rect.x + rect.w && y < rect.y + rect.h);
        }
    }
}