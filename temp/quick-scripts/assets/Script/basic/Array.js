(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/basic/Array.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '310ce4fT5pPh5Fi60i3qm7P', 'Array', __filename);
// Script/basic/Array.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("./Maybe");
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

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Array.js.map
        