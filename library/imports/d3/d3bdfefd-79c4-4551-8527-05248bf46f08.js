"use strict";
cc._RF.push(module, 'd3bdf79ecRFUYUnBSSL9G8I', 'BaseComponent');
// Script/basic/BaseComponent.ts

Object.defineProperty(exports, "__esModule", { value: true });
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
    BaseComponent = __decorate([
        ccclass
    ], BaseComponent);
    return BaseComponent;
}(cc.Component));
exports.BaseComponent = BaseComponent;

cc._RF.pop();