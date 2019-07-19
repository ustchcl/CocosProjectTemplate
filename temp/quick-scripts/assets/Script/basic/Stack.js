(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/basic/Stack.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c3e82Yk29BLdq4XWT6YbyBK', 'Stack', __filename);
// script/basic/Stack.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Maybe_1 = require("./Maybe");
var ramda_1 = require("ramda");
var Array_1 = require("./Array");
var Stack = /** @class */ (function () {
    function Stack() {
        this._stack = [];
    }
    Stack.prototype.top = function () {
        return new Maybe_1.Maybe(this._stack[this._stack.length - 1]);
    };
    Stack.prototype.pop = function () {
        return new Maybe_1.Maybe(this._stack.pop());
    };
    Stack.prototype.size = function () {
        return this._stack.length;
    };
    Stack.prototype.push = function (value) {
        this._stack.push(value);
    };
    Stack.prototype.remove = function (value, eq) {
        var index = ramda_1.findIndex(function (x) { return eq(x, value); }, this._stack);
        if (index != -1) {
            this._stack = Array_1.erase(this._stack, index, 1);
        }
    };
    Stack.prototype.clear = function () {
        this._stack = [];
    };
    Stack.prototype.asArray = function () {
        return ramda_1.reverse(this._stack);
    };
    return Stack;
}());
exports.default = Stack;

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
        //# sourceMappingURL=Stack.js.map
        