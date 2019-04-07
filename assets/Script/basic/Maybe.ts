import { Fn, Fn2 } from "./Types";

export class Maybe<T> {
    private _isValid: boolean = null;
    private _value: T = null;

    static Just<T>(v: T) {
        return new Maybe<T>(v);
    }

    static Nothing<T>() {
        return new Maybe<T>();
    }
    
    constructor (v: T = null) {
        if (v != null) {
            this._isValid = true;
            this._value = v;
        } else {
            this._isValid = false;
        }
    }

    get val() {
        return this._value;
    }

    get valid() {
        return this._isValid;
    }

    // Functor f => (a -> b) -> f a -> f b
    map<U>(func: Fn<T, U>) : Maybe<U> {
        if (this.valid) {
            return new Maybe<U>(func(this.val));
        } else {
            return new Maybe<U>();
        }
    }

    async asyncFmap<U>(func: Fn<T, Promise<U>>) {
        if (this.valid) {
            let u = await func(this.val)
            return new Maybe<U>(u);
        } else {
            return new Maybe<U>();
        }
    }

    pure(x: T): Maybe<T> {
        return new Maybe(x);
    }
    
    // Monad m => (a -> m b) -> m a -> m b
    bind<U>(func: Fn<T, Maybe<U>>) : Maybe<U> {
        if (this.valid) {
            return func(this.val);
        } else {
            return new Maybe<U>();
        }
    }
    
    getOrElse (x: T): T {
        return this.valid ? this.val : x;
    }

    lift2<U,V>(func: Fn2<T, U, V>, ou: Maybe<U>) : Maybe<V> {
        if (this.valid && ou.valid) {
            return new Maybe<V>(func(this.val, ou.val));
        } else {
            return new Maybe<V>();
        }
    }
}