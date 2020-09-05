type Printable<T> = { toString(): string };
type Class<T> = { new(...args: any): T, name: string };
type Named<T> = { name: string };

export class TestClass {
    public set_up() { console.log(this); }
    public tear_down() { }
    public set_class_up() { }
    public tear_class_down() { }

    public assertInstanceOf<T extends Printable<T>>(value: Printable<T>, expected: Class<T>): void {
        if (false === value instanceof expected) {
            throw new Error('Expected ' + value?.toString() + ' to be of instance ' + expected.name);
        }
        this.success();
    }

    public assertEquals<T>(value: T, expected: T): void {
        if (value !== expected) {
            throw new Error('Expected ' + String(value) + ' to be equal to ' + String(expected));
        }
        this.success();
    }

    public assertNotEquals<T>(value: T, expected: T): void {
        if (value === expected) {
            throw new Error('Expected ' + String(value) + ' to be NOT equal to ' + String(expected));
        }
        this.success();
    }

    public assertTrue<T>(value: boolean): void {
        if (value === false) {
            throw new Error('Expected ' + String(value) + ' to be true');
        }
        this.success();
    }

    public assertFalse<T>(value: boolean): void {
        if (value === true) {
            throw new Error('Expected ' + String(value) + ' to be false');
        }
        this.success();
    }

    private success() {
        console.log('.');
    }
}