"use strict";
cc._RF.push(module, '419bfW4lPdMOZ3VzBk3BRxW', 'BaseFunction');
// Script/basic/BaseFunction.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var R = require("ramda");
var Maybe_1 = require("./Maybe");
var ShaderComponent_1 = require("../extension/shader/ShaderComponent");
var ShaderManager_1 = require("../extension/shader/ShaderManager");
function modify(subject, func) {
    subject.next(func(subject.getValue()));
}
exports.modify = modify;
function eventToBehavior(node, eventType, resultSelector, initial) {
    var behavior = new rxjs_1.BehaviorSubject(initial);
    var handler = function (e) {
        behavior.next(resultSelector(e));
    };
    node.on(eventType, handler);
    return behavior;
}
exports.eventToBehavior = eventToBehavior;
function eventToObservable(node, eventType, resultSelector) {
    return new rxjs_1.Observable(function (subscriber) {
        var handler = function (e) {
            if (resultSelector == undefined) {
                subscriber.next(null);
            }
            else {
                subscriber.next(resultSelector(e));
            }
        };
        node.on(eventType, handler);
        subscriber.add(function () { return node.off(eventType, handler); });
    });
}
exports.eventToObservable = eventToObservable;
/**
 * Create flexibly-numbered lists of integers.
 * `range(5); // -> [0, 1, 2, 3, 4]`
 * `range(0, 5, 2); // -> [0, 2, 4]`
 */
function range(start, end, step) {
    if (end == null) {
        end = start || 0;
        start = 0;
    }
    if (!step)
        step = end < start ? -1 : 1;
    var len = Math.max(Math.ceil((end - start) / step), 0);
    var ret = Array(len);
    for (var i = 0; i < len; i++, start += step)
        ret[i] = start;
    return ret;
}
exports.range = range;
/**
 * Produces a random number between min and max(inclusive).
 * `random(1, 5); // -> an integer between 0 and 5`
 * `random(5); // -> an integer between 0 and 5`
 * `random(1.2, 5.2, true); /// -> a floating-point number between 1.2 and 5.2`
 */
function random(min, max, floating) {
    if (max == null) {
        max = min;
        min = 0;
    }
    var rand = Math.random();
    if (floating || min % 1 || max % 1) {
        return Math.min(min +
            rand *
                (max - min + parseFloat('1e-' + ((rand + '').length - 1))), max);
    }
    else {
        return min + Math.floor(rand * (max - min + 1));
    }
}
exports.random = random;
/**
 * 将数组长度设置为n
 * `fixLength([1, 2, 3], 2); // [Just 1, Just 2]`
 * `fixLength([1], 2); // [Just 1, Nothing]`
 */
function fixLength(arr, n) {
    var result = R.take(n, arr).map(Maybe_1.Maybe.Just);
    return R.concat(result, R.repeat(Maybe_1.Maybe.Nothing(), n - result.length));
}
exports.fixLength = fixLength;
function ifNullThen(val, defaultVal) {
    if (val == undefined) {
        return defaultVal;
    }
    else {
        return val;
    }
}
exports.ifNullThen = ifNullThen;
function count(val, arr) {
    return R.filter(R.equals(val), arr).length;
}
exports.count = count;
function timeInfo(timestamp) {
    var date = new Date(timestamp);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        seconds: date.getSeconds()
    };
}
exports.timeInfo = timeInfo;
/**
 * example:
 * formatNum(1, 2); // '02'
 * formatNum(12, 4); // '0012'
 * @param num 要格式化的数字
 * @param length 格式化后的长度
 */
function formatNum(num, length) {
    var str = String(num);
    return R.repeat("0", length - str.length) + str;
}
exports.formatNum = formatNum;
/**
 * 移除节点
 * @param node '要移除的节点
 */
function safeRemove(node) {
    if (node && node.parent) {
        node.parent.removeChild(node);
    }
}
exports.safeRemove = safeRemove;
/**
 * wait for `n` seconds
 */
function wait(seconds) {
    return new Promise(function (resolve) {
        setTimeout(resolve, seconds * 1000);
    });
}
exports.wait = wait;
/**
* 灰度化一张图片 By ShaderComponent
* @param sprite 图片
*/
function grey(node) {
    if (!node) {
        return;
    }
    var shader = node.getComponent(ShaderComponent_1.default);
    if (shader) {
        shader.shader = ShaderManager_1.ShaderType.Gray;
    }
}
exports.grey = grey;
/**
 * 取消灰度化
 * @param sprite 图片
 */
function ungrey(node) {
    if (!node) {
        return;
    }
    var shader = node.getComponent(ShaderComponent_1.default);
    if (shader) {
        shader.shader = ShaderManager_1.ShaderType.Default;
    }
}
exports.ungrey = ungrey;
/**
 * 从数组中随机抽选一个元素
 */
function randomOne(arr) {
    if (arr == undefined || arr.length == 0) {
        return Maybe_1.Maybe.Nothing();
    }
    var randIndex = Math.floor(Math.random() * arr.length);
    return Maybe_1.Maybe.Just(arr[randIndex]);
}
exports.randomOne = randomOne;
/**
 * 将数组的元素随机重新排列
 */
function shuffle(arr) {
    var _a;
    var array = R.clone(arr);
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
    return R.take(n, shuffle(arr));
}
exports.sample = sample;

cc._RF.pop();