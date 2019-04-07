import { TOUCH_END } from "./EventName";
import { Fn } from "./Function";
import { Observable } from "rxjs";

export interface ClickEvent {
    off: () => void;
    send: (e: cc.Event.EventCustom) => void;
}

export function fromClick<T>(
    node: cc.Node, 
    resultSelector?: Fn<cc.Event.EventCustom, T>,
): Observable<T> {
    return new Observable<T>(subscriber => {
        let handler = (e: cc.Event.EventCustom) => {
            if (resultSelector == undefined) {
                subscriber.next(null);
            } else {
                subscriber.next(resultSelector(e));
            }
        }
        node.on(TOUCH_END, handler);
        subscriber.add(() => node.off(TOUCH_END, handler));
    });
}

export function addListener(node: cc.Node) {
    return (callback) => {
        node.on(TOUCH_END, callback);
    }
}