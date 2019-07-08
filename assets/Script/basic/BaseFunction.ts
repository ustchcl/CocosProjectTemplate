import { Fn } from "./Types";
import { BehaviorSubject, Observable } from "rxjs"
import * as R from "ramda";
import { Maybe } from "./Maybe";
import ShaderComponent from "../extension/shader/ShaderComponent";
import { ShaderType } from "../extension/shader/ShaderManager";

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

/**
 * Create flexibly-numbered lists of integers.
 * `range(5); // -> [0, 1, 2, 3, 4]`
 * `range(0, 5, 2); // -> [0, 2, 4]`
 */
export function range(start: number, end?: number, step?: number): number[] {
    if (end == null) {
        end = start || 0;
        start = 0;
    }

    if (!step) step = end < start ? -1 : 1;

    let len = Math.max(Math.ceil((end - start) / step), 0);
    let ret = Array(len);

    for (let i = 0; i < len; i++, start += step) ret[i] = start;
    return ret;
}

/**
 * Produces a random number between min and max(inclusive).
 * `random(1, 5); // -> an integer between 0 and 5`
 * `random(5); // -> an integer between 0 and 5`
 * `random(1.2, 5.2, true); /// -> a floating-point number between 1.2 and 5.2`
 */
export function random(min: number, max?: number, floating?: boolean): number {
    if (max == null) {
        max = min;
        min = 0;
    }
    let rand = Math.random();
    if (floating || min % 1 || max % 1) {
        return Math.min(
            min +
                rand *
                (max - min + parseFloat('1e-' + ((rand + '').length - 1))),
            max
        )
    } else {
        return min + Math.floor(rand * (max - min + 1));
    }
}

/**
 * 将数组长度设置为n
 * `fixLength([1, 2, 3], 2); // [Just 1, Just 2]`
 * `fixLength([1], 2); // [Just 1, Nothing]`
 */
export function fixLength<T>(arr: Array<T>, n: number): Array<Maybe<T>> {
    let result = R.take(n, arr).map(Maybe.Just);
    return R.concat(result, R.repeat(Maybe.Nothing<T>(), n - result.length));
}


export function ifNullThen<T>(val: T, defaultVal: T): T {
    if (val == undefined) {
        return defaultVal;
    } else {
        return val;
    }
}


export function count<T>(val: T, arr: T[]): number {
    return R.filter(R.equals(val), arr).length;
}


// time info 
export type TimeInfo = {
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    seconds: number,
}
export function timeInfo(timestamp: number): TimeInfo {
    let date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        seconds: date.getSeconds()
    }
}

/**
 * example: 
 * formatNum(1, 2); // '02'
 * formatNum(12, 4); // '0012'
 * @param num 要格式化的数字
 * @param length 格式化后的长度
 */
export function formatNum(num: number, length: number): string {
    let str = String(num);
    return R.repeat("0", length - str.length) + str;
}

/**
 * 移除节点
 * @param node '要移除的节点
 */
export function safeRemove(node: cc.Node):void {
    if (node && node.parent) {
        node.parent.removeChild(node);
        node.destroy();
    }
}

/**
 * wait for `n` seconds
 */
 export function wait(seconds: number) {
     return new Promise<void>(function(resolve) {
         setTimeout(resolve, seconds * 1000);
     })
 }

/**
* 灰度化一张图片 By ShaderComponent
* @param sprite 图片
*/
export function grey(node: cc.Node) {
    if (!node) {
        return;
    }
    let shader = node.getComponent(ShaderComponent);
    if (shader) {
        shader.shader = ShaderType.Gray;
    }
}

/**
 * 取消灰度化
 * @param sprite 图片
 */
export function ungrey(node: cc.Node) {
    if (!node) {
        return;
    }
    let shader = node.getComponent(ShaderComponent);
    if (shader) {
        shader.shader = ShaderType.Default;
    }
}



/**
 * 从数组中随机抽选一个元素
 */
export function randomOne<T>(arr: Array<T>): Maybe<T> {
    if (arr == undefined || arr.length == 0) {
        return Maybe.Nothing();
    }
    let randIndex = Math.floor(Math.random() * arr.length);
    return Maybe.Just(arr[randIndex]);
}


/**
 * 将数组的元素随机重新排列
 */
export function shuffle<T>(arr: Array<T>): Array<T> {
    let array = R.clone(arr);
    let length = array.length;
    for (let i = length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * sample 从数组中抽取出指定数量的元素
 */
export function sample<T>(n: number, arr: Array<T>): Array<T> {
    n = Math.max(Math.min(n, arr.length), 0);
    return R.take(n, shuffle(arr));
}
