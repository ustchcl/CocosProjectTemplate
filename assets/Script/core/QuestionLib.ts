import * as R from "ramda"
import { Maybe } from "../basic/Maybe";
import { Fn } from "../basic/Types";

export class QuestionLib<T> {
    private _arr: Array<T> = [];
    private _iterate: number = 0;

    public constructor(arr: Array<T>) {
        this._iterate = 0;
        this._arr = R.clone(arr);
    }

    next(): Maybe<T> {
        if (this._iterate >= 0 && this._iterate < this._arr.length) {
            let it = this._iterate;
            this._iterate += 1;
            return Maybe.Just(this._arr[it]);
        } else {
            return Maybe.Nothing();
        }
    }

    hasNext(): Boolean {
        return this._iterate < this._arr.length;
    }

    update(func: Fn<T, T>) {
        if (this._iterate >= 0 && this._iterate < this._arr.length) {
            let v = this._arr[this._iterate];
            this._arr[this._iterate] = func(v);
        } 
    }
}