import { Fn } from "./Types";
import { BehaviorSubject, Observable } from "rxjs"

export function modify<T>(subject: BehaviorSubject<T>, func: Fn<T, T>) {
    subject.next(func(subject.getValue()))
}

export function eventToBehavior<T>(
    node: cc.Node, 
    eventType: string, 
    resultSelector: Fn<cc.Event.EventCustom, T>,
    initial: T
): BehaviorSubject<T> {
    let behavior = new BehaviorSubject(initial);
    let handler = (e: cc.Event.EventCustom) => {
        behavior.next(resultSelector(e));
    }
    node.on(eventType, handler);
    return behavior;
}

export function eventToObservable<T>(
    node: cc.Node, 
    eventType: string, 
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
        node.on(eventType, handler);
        subscriber.add(() => node.off(eventType, handler));
    });
}