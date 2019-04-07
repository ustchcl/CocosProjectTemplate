(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/basic/Maybe.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '87152sP62JPBLq9qVeN+QK6', 'Maybe', __filename);
// Script/basic/Maybe.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Maybe = /** @class */ (function () {
    function Maybe(v) {
        if (v === void 0) { v = null; }
        this._isValid = null;
        this._value = null;
        if (v != null) {
            this._isValid = true;
            this._value = v;
        }
        else {
            this._isValid = false;
        }
    }
    Maybe.Just = function (v) {
        return new Maybe(v);
    };
    Maybe.Nothing = function () {
        return new Maybe();
    };
    Object.defineProperty(Maybe.prototype, "val", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Maybe.prototype, "valid", {
        get: function () {
            return this._isValid;
        },
        enumerable: true,
        configurable: true
    });
    // Functor f => (a -> b) -> f a -> f b
    Maybe.prototype.map = function (func) {
        if (this.valid) {
            return new Maybe(func(this.val));
        }
        else {
            return new Maybe();
        }
    };
    Maybe.prototype.asyncFmap = function (func) {
        return __awaiter(this, void 0, void 0, function () {
            var u;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.valid) return [3 /*break*/, 2];
                        return [4 /*yield*/, func(this.val)];
                    case 1:
                        u = _a.sent();
                        return [2 /*return*/, new Maybe(u)];
                    case 2: return [2 /*return*/, new Maybe()];
                }
            });
        });
    };
    Maybe.prototype.pure = function (x) {
        return new Maybe(x);
    };
    // Monad m => (a -> m b) -> m a -> m b
    Maybe.prototype.bind = function (func) {
        if (this.valid) {
            return func(this.val);
        }
        else {
            return new Maybe();
        }
    };
    Maybe.prototype.getOrElse = function (x) {
        return this.valid ? this.val : x;
    };
    Maybe.prototype.lift2 = function (func, ou) {
        if (this.valid && ou.valid) {
            return new Maybe(func(this.val, ou.val));
        }
        else {
            return new Maybe();
        }
    };
    return Maybe;
}());
exports.Maybe = Maybe;

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
        //# sourceMappingURL=Maybe.js.map
        