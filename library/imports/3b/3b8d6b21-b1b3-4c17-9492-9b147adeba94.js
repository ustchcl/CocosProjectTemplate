"use strict";
cc._RF.push(module, '3b8d6shsbNMF5SSmxR63rqU', 'Example1');
// Script/examples/Example1.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Types_1 = require("../basic/Types");
var rxjs_1 = require("rxjs");
var ramda_1 = require("ramda");
var BaseFunction_1 = require("../basic/BaseFunction");
var BaseComponent_1 = require("../basic/BaseComponent");
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Example1 = /** @class */ (function (_super) {
    __extends(Example1, _super);
    function Example1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.minusButton = null;
        _this.plusButton = null;
        _this.contentLabel = null;
        _this.maxButton = null;
        _this.MAX_SIZE = 999;
        return _this;
    }
    Example1.prototype.start = function () {
        var _this = this;
        this.actions = new rxjs_1.Subject();
        // this.minusButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Dec", value: unit}));
        // this.plusButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Inc", value: unit}));
        // this.maxButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Set", value: this.MAX_SIZE}));
        this.onTouchEnd(this.minusButton.node, Types_1.ActionUnit("Dec"));
        this.onTouchEnd(this.plusButton.node, Types_1.ActionUnit("Inc"));
        this.onTouchEnd(this.maxButton.node, Types_1.Action("Set", this.MAX_SIZE));
        this.state = {
            count: new rxjs_1.BehaviorSubject(200)
        };
        this.actions.subscribe({ next: function (action) { return _this.eval(action); } });
        this.state.count.subscribe({ next: function (count) { return _this.render(count); } });
    };
    Example1.prototype.render = function (count) {
        this.contentLabel.string = String(count);
    };
    Example1.prototype.eval = function (action) {
        switch (action.typeName) {
            case "Dec": {
                var count = this.state.count.getValue();
                if (count > 0) {
                    BaseFunction_1.modify(this.state.count, ramda_1.add(ramda_1.__, -1));
                }
                break;
            }
            case "Inc": {
                var count = this.state.count.getValue();
                if (count < this.MAX_SIZE) {
                    BaseFunction_1.modify(this.state.count, ramda_1.add(ramda_1.__, 1));
                }
                break;
            }
            case "Set": {
                BaseFunction_1.modify(this.state.count, ramda_1.always(action.value));
                break;
            }
        }
    };
    __decorate([
        property(cc.Button)
    ], Example1.prototype, "minusButton", void 0);
    __decorate([
        property(cc.Button)
    ], Example1.prototype, "plusButton", void 0);
    __decorate([
        property(cc.Label)
    ], Example1.prototype, "contentLabel", void 0);
    __decorate([
        property(cc.Button)
    ], Example1.prototype, "maxButton", void 0);
    Example1 = __decorate([
        ccclass
    ], Example1);
    return Example1;
}(BaseComponent_1.BaseComponent));
exports.Example1 = Example1;

cc._RF.pop();