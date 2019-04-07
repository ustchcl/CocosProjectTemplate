import { Behavior } from "./Behavior";
import { Fn } from "./Function";

export const TOUCH_END = cc.Node.EventType.TOUCH_END;

export function link<T>(node: cc.Node, subject: Behavior<T>, action: Fn<T, T>, type: string = TOUCH_END) {
    node.on(type, (e) => subject.update(action));
}