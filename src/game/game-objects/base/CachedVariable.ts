export class CachedVariable<T> {
    public is_valid: boolean = false;
    private generate_func: (ref: T) => T;
    private value: T;

    public constructor(initial: T, generate_func: (ref: T) => T) {
        this.value = initial;
        this.generate_func = generate_func;
    }

    public get(): T {
        if (this.is_valid === true) return this.value;
        this.is_valid = true;
        return this.value = this.generate_func(this.value);
    }
}