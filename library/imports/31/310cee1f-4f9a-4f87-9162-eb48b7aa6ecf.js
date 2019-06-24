"use strict";
cc._RF.push(module, '310ce4fT5pPh5Fi60i3qm7P', 'Array');
// Script/basic/Array.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("./Maybe");
var R = require("ramda");
/**
 * 在指定位置数组尾部放入一个的新的元素，并返回修改后的数组
 * 内部是用`splice`实现
 * @param arr 原数组
 * @param v 新插入的元素
 * @param index 插入的位置
 */
function insert(arr, v, index) {
    arr.splice(index, 0, v);
    return arr;
}
exports.insert = insert;
/**
 * 在数组末尾插入一个元素，并返回该数组
 * @param arr 原数组
 * @param v 查入的元素
 */
function append(arr, v) {
    arr.push(v);
    return arr;
}
exports.append = append;
/**
 * 从数组末尾尝试弹出一个元素，如果为空数组，则value为Nothing
 * @param arr 原数组
 */
function pop(arr) {
    var v = arr.pop();
    return {
        value: new Maybe_1.Maybe(v),
        result: arr
    };
}
exports.pop = pop;
/**
 * 从数组开头尝试弹出一个元素，如果为空数组，则value为Nothing
 * @param arr 原数组
 */
function shift(arr) {
    var v = arr.shift();
    return {
        value: new Maybe_1.Maybe(v),
        result: arr
    };
}
exports.shift = shift;
/**
 * 从指定位置`from`删除长度为`amount`的元素，并返回该数组
 * @param arr 原数组
 * @param from 开始的Index
 * @param amount 要删除的长度
 */
function erase(arr, from, amount) {
    if (!amount || amount < 0) {
        return arr;
    }
    arr.splice(from, amount);
    return arr;
}
exports.erase = erase;
/**
 * 交换指定位置的数组元素
 * @param arr 原数组
 * @param index1 位置1
 * @param index2 位置2
 */
function swap(arr, index1, index2) {
    function isValid(index) {
        return index >= 0 && index < arr.length;
    }
    if (isValid(index1) && isValid(index2) && index1 != index2) {
        var temp = arr[index1];
        arr[index1] = arr[index2];
        arr[index2] = temp;
    }
    else {
        return arr;
    }
}
exports.swap = swap;
// function 
/**
 * 将数组的元素随机重新排列
 */
function shuffle(array) {
    var _a;
    var length = array.length;
    for (var i = length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
exports.shuffle = shuffle;
/**
 * sample 从数组中抽取出指定数量的元素
 */
function sample(n, arr) {
    n = Math.max(Math.min(n, arr.length), 0);
    return R.take(n, shuffle(R.clone(arr)));
}
exports.sample = sample;

cc._RF.pop();