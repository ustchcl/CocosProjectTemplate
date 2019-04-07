import { Component } from "./Component";
import { Fn } from "./Types";
import { Subject } from "rxjs";

const {ccclass, property} = cc._decorator

@ccclass
export class BaseComponent<State, Action> extends cc.Component implements Component<State, Action> {
    state: State;
    actions: Subject<Action>;

    render(count: number) {}

    eval (action: Action) {}

    query<T>(extractor: Fn<State, T>) {
        return extractor(this.state);
    }

    close () {
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
    }
}