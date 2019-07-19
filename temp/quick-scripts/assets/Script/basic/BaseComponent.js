(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/basic/BaseComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd3bdf79ecRFUYUnBSSL9G8I', 'BaseComponent', __filename);
// script/basic/BaseComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var GlobalEnv_1 = require("./GlobalEnv");
var BaseComponent = /** @class */ (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.subs = [];
        return _this;
    }
    BaseComponent.prototype.query = function (extractor) {
        return extractor(this.state);
    };
    BaseComponent.prototype.onTouchEnd = function (node, action) {
        var _this = this;
        node.on(Constants_1.TOUCH_END, function () { return _this.eval(action); });
    };
    BaseComponent.prototype.onTouchEndEffect = function (node, func) {
        var _this = this;
        node.on(Constants_1.TOUCH_END, function () {
            var action = func();
            if (action) {
                _this.eval(action);
            }
        });
    };
    BaseComponent.prototype.onTouchEndEffectMaybe = function (node, func) {
        var _this = this;
        node.on(Constants_1.TOUCH_END, function () {
            var action = func();
            if (action.valid) {
                _this.eval(action.val);
            }
        });
    };
    BaseComponent.prototype.onTouchEndGlobal = function (node, action) {
        node.on(Constants_1.TOUCH_END, function () { return GlobalEnv_1.GlobalEnv.getInstance().dispatchAction(action); });
    };
    BaseComponent.prototype.onTouchEndGlobalEffect = function (node, func) {
        node.on(Constants_1.TOUCH_END, function () {
            var action = func();
            if (action) {
                GlobalEnv_1.GlobalEnv.getInstance().dispatchAction(action);
            }
        });
    };
    /**
     * 向全局发射事件，关心此事件的地方
     * 可以filter指定事件名字，然后监听
     */
    BaseComponent.prototype.dispatch = function (action) {
        GlobalEnv_1.GlobalEnv.getInstance().dispatchAction(action);
    };
    BaseComponent.prototype.onDestroy = function () {
        this.subs.forEach(function (sub) { return sub.unsubscribe(); });
    };
    return BaseComponent;
}(cc.Component));
exports.BaseComponent = BaseComponent;

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
        //# sourceMappingURL=BaseComponent.js.map
        