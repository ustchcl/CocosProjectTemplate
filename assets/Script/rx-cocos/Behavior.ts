import { BehaviorSubject, Observable, Subscriber } from 'rxjs'
import { Fn } from './Function';
import { Action } from '../Helloworld';
import { always } from './BaseFunction';

// action :: T -> T

export function fromCCEvent<T>(
    node: cc.Node, 
    eventType: string, 
    resultSelector: Fn<cc.Event.EventCustom, T>,
    initial: T
): Behavior<T> {
    let behavior = new Behavior(initial);
    let handler = (e: cc.Event.EventCustom) => {
        behavior.update(always(resultSelector(e)));
    }
    node.on(eventType, handler);
    return behavior;
}

export function fromCCEventO<T>(
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

export class Behavior<T> extends BehaviorSubject<T> {
    constructor (_value: T) {
        super(_value);
    }

    update(action: Fn<T, T>) {
        this.next(action(this.getValue()))
    }

    link(render: Fn<T, void>, thisObj?: any) {
        this.subscribe({
            next: (v) => {
                if (thisObj) { 
                    render.bind(thisObj)(v);
                } else {
                    render(v);
                }
            }
        })
    }
}

export function fromObservable<U>(initial: U, ob: Observable<U>): Behavior<U> {
    let behavior = new Behavior(initial);
    ob.subscribe({
        next: behavior.next
    })
    return behavior;
}

export class BehaviorAction extends Behavior<Action<number>> {
    constructor (_value: Action<number>) {
        super(_value);
    }

    update2(from: string, target: string, action: Fn<number, number>) {
        let obj = this.getValue();
        this.next({
            from: from,
            target: target,
            value: action(obj.value)
        })
    }
}