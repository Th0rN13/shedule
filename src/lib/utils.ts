export function* chunks<T>(arr: Array<T>, n: number): Generator<Array<T>> {
    for (let i = 0; i < arr.length; i += n) {
        yield arr.slice(i, i + n);
    }
}