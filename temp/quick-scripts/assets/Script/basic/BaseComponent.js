(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/basic/BaseComponent.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd3bdf79ecRFUYUnBSSL9G8I', 'BaseComponent', __filename);
// Script/basic/BaseComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var GlobalEnv_1 = require("./GlobalEnv");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var BaseComponent = /** @class */ (function (_super) {
    __extends(BaseComponent, _super);
    function BaseComponent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseComponent.prototype.render = function (count) { };
    BaseComponent.prototype.eval = function (action) { };
    BaseComponent.prototype.query = function (extractor) {
        return extractor(this.state);
    };
    BaseComponent.prototype.close = function () {
        if (this.node.parent) {
            this.node.parent.removeChild(this.node);
        }
    };
    BaseComponent.prototype.onTouchEnd = function (node, action) {
        var _this = this;
        node.on(Constants_1.TOUCH_END, function () { return _this.fork(action); });
    };
    /**
     * 将一个action 作为下一个要处理的Action
     */
    BaseComponent.prototype.fork = function (action) {
        if (!this.actions) {
            this.eval(action);
        }
        else {
            this.actions.next(action);
        }
    };
    /**
     * 向全局发射事件，关心此事件的地方
     * 可以filter指定事件名字，然后监听
     */
    BaseComponent.prototype.dispatch = function (action) {
        GlobalEnv_1.GlobalEnv.getInstance().dispatchAction(action);
    };
    BaseComponent = __decorate([
        ccclass
    ], BaseComponent);
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
        