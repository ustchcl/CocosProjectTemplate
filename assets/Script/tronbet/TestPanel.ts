import { curryN } from "ramda";
import { Observable } from "rxjs";
import { Behavior, fromCCEvent, fromCCEventO } from "../rx-cocos/Behavior";
import { always, safeRemove } from "../rx-cocos/BaseFunction";
import { Action } from "rxjs/internal/scheduler/Action";
import { TOUCH_END } from "../rx-cocos/EventName";
import { Model } from "./BetData";
import { Panel } from "../rx-cocos/PanelAction";
import { fromClick, addListener } from "../rx-cocos/ClickEvent";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestPanel extends cc.Component {
    @property(cc.Button)
    closeBtn: cc.Button = null
    
    start () {
        addListener(this.closeBtn.node)(Panel.close(this.node));
    }
}

// 解决两个问题，
// 流的链接问题

