import { Maybe } from "./Maybe";
import { reverse, findIndex } from "ramda";
import { Fn2 } from "./Types";
import { erase } from "./Array";

export default class Stack<T> {
    private _stack: Array<T> = [];
    top (): Maybe<T> {
        return new Maybe(this._stack[this._stack.length - 1]);
    }

    pop (): Maybe<T> {
        return new Maybe(this._stack.pop());
    }

    size (): number {
        return this._stack.length;
    }

    push (value: T): void {
        this._stack.push(value);
    }

    remove(value: T, eq: Fn2<T, T, boolean>) {
        let index = findIndex(x => eq(x, value), this._stack);
        if (index != -1) {
            this._stack = erase(this._stack, index, 1);
        }
    }

    clear (): void {
        this._stack = [];
    }

    asArray(): Array<T> {
        return reverse(this._stack);
    }
}