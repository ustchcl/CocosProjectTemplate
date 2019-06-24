import { Fn, ActionUnit, TypeUnit } from "./Types";
import * as Rx from "rxjs"


export abstract class ReduxStore<State, Action> {
    private _state: Rx.BehaviorSubject<State>;
    
    constructor (initialState: State) {
        this._state = new Rx.BehaviorSubject(initialState);
    }
    subscribe(callback: Fn<State, void>) {
        this._state.subscribe({ next: callback });
    }
    
    abstract eval(action: Action): void;
    
}


export type State = number;
type Action 
    = TypeUnit<"Inc">
    | TypeUnit<"Dec">

class Counter extends ReduxStore<number, Action> {
    constructor() {
        super(0);
    }

    eval(action: Action) {
        switch (action.typeName) {
            case "Dec": {
                break;
            }
            case "Inc": {
                break;
            }
        }
    }
}