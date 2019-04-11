import { Maybe } from "./Maybe";
import * as R from "ramda"
import { random } from "./Utils";

/**
 * 在指定位置数组尾部放入一个的新的元素，并返回修改后的数组
 * 内部是用`splice`实现
 * @param arr 原数组
 * @param v 新插入的元素
 * @param index 插入的位置
 */
export function insert<T>(arr: Array<T>, v: T, index: number): Array<T> {
    arr.splice(index, 0, v);
    return arr;
}

/**
 * 在数组末尾插入一个元素，并返回该数组
 * @param arr 原数组
 * @param v 查入的元素
 */
export function append<T>(arr: Array<T>, v: T): Array<T> {
    arr.push(v);
    return arr;
}

/**
 * 从数组末尾尝试弹出一个元素，如果为空数组，则value为Nothing
 * @param arr 原数组
 */
export function pop<T>(arr: Array<T>): {value: Maybe<T>, result: Array<T>} {
    let v = arr.pop();
    return {
        value: new Maybe(v),
        result: arr
    }
}

/**
 * 从数组开头尝试弹出一个元素，如果为空数组，则value为Nothing
 * @param arr 原数组
 */
export function shift<T>(arr: Array<T>): {value: Maybe<T>, result: Array<T>} {
    let v = arr.shift();
    return {
        value: new Maybe(v),
        result: arr
    }
}


/**
 * 从指定位置`from`删除长度为`amount`的元素，并返回该数组
 * @param arr 原数组
 * @param from 开始的Index
 * @param amount 要删除的长度
 */
export function erase<T>(arr: Array<T>, from: number, amount: number): Array<T> {
    if (!amount || amount < 0) {
        return arr;
    }
    arr.splice(from, amount);
    return arr;
}

/**
 * 交换指定位置的数组元素
 * @param arr 原数组
 * @param index1 位置1
 * @param index2 位置2
 */
export function swap<T>(arr: Array<T>, index1: number, index2: number): Array<T> {
    function isValid(index: number) {
        return index >= 0 && index < arr.length;
    }
    if (isValid(index1) && isValid(index2) && index1 != index2) {
        let temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp; 
    } else {
        return arr;
    }
}

// function 

/**
 * 将数组的元素随机重新排列
 */
export function shuffle<T>(array: Array<T>): Array<T> {
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
    return R.take(n, shuffle(R.clone(arr)));
}