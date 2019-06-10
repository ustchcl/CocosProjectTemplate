import { Component } from "./Component";
import { Fn, Type, Effect } from "./Types";
import { TOUCH_END } from "./Constants";
import { GlobalEnv } from "./GlobalEnv";
import { GlobalAction } from "../core/GlobalAction";
import { Maybe } from "./Maybe";


export class BaseComponent<State, Action extends Type<any, any>> extends cc.Component implements Component<State, Action> {
    state: State;

    eval (action: Action) {}

    query<T>(extractor: Fn<State, T>) {
        return extractor(this.state);
    }

    onTouchEnd(node: cc.Node, action: Action) {
        node.on(TOUCH_END, () => this.fork(action));
    }

    /**
     * 将一个action 作为下一个要处理的Action
     */
    fork (action: Action) {
        this.eval(action);
    }

    onTouchEndEffect(node: cc.Node, func: Effect<Action>) {
        node.on(TOUCH_END, () => {
            let action = func();
            if (action) {
                this.fork(action)
            }
        });
    }

    onTouchEndEffectMaybe(node: cc.Node, func: Effect<Maybe<Action>>) {
        node.on(TOUCH_END, () => {
            let action = func();
            if (action.valid) {
                this.fork(action.val)
            }
        });
    }

    onTouchEndGlobal(node: cc.Node, action: GlobalAction) {
        node.on(TOUCH_END, () => GlobalEnv.getInstance().dispatchAction(action));
    }

    onTouchEndGlobalEffect(node: cc.Node, func: Effect<Action>) {
        node.on(TOUCH_END, () => {
            let action = func();
            if (action) {
                GlobalEnv.getInstance().dispatchAction(action)
            }
        });
    }

    /**
     * 向全局发射事件，关心此事件的地方
     * 可以filter指定事件名字，然后监听
     */
    dispatch(action: GlobalAction) {
        GlobalEnv.getInstance().dispatchAction(action);
    }
}
