import { BetComp } from "./BetComp";
import RecordList from "./RecordList";
import { fromCCEvent, Behavior } from "../rx-cocos/Behavior";
import { TOUCH_END } from "../rx-cocos/EventName";
import { Model } from "./BetData";
import { GameRule } from "./GameRule";
import { formatFloat, safeRemove } from "../rx-cocos/BaseFunction";
import Stack from "../rx-cocos/Stack";
import { Panel, PanelActionType } from "../rx-cocos/PanelAction";

const { ccclass, property } = cc._decorator;

@ccclass
export class Tron extends cc.Component {
    @property(BetComp)
    betComp: BetComp = null;
    @property(cc.Button)
    betBtn: cc.Button = null;
    @property(RecordList)
    list: RecordList = null;
    @property(cc.Label)
    balanceLabel: cc.Label = null

    panels = new Stack<cc.Node>();
    
    start () {
        this.betBtn.node.on(TOUCH_END, async () => {
            if (await GameRule.bet(Model.betNumber.getValue(), Model.wager)) {
                console.log('success');
            }
        });
        Model.balance.link((b) => this.balanceLabel.string = `balance: ${formatFloat(b, 4)}`, this);

        Model.panelActions.subscribe({
            next: (action) => {
                switch(action.type) {
                    case PanelActionType.Close: {
                        // 移除当前node
                        this.panels.pop().map(safeRemove);
                        this.panels.remove(action.node, (n1, n2) => n1.uuid == n2.uuid);
                        // 尝试显示顶层node
                        this.panels.top().map(x => x.active = true);
                        break;
                    }
                    case PanelActionType.Open: {
                        // 尝试隐藏顶层node
                        this.panels.top().map(x => x.active = false);
                        action.node.parent = this.node;
                        this.panels.push(action.node);
                        break;
                    }
                    case PanelActionType.CloseAll: {
                        this.panels.asArray().forEach(safeRemove);
                        this.panels.clear();
                        break;
                    }
                    case PanelActionType.CloseAllAndOpen: {
                        this.panels.asArray().forEach(safeRemove);
                        this.panels.clear();
                        action.node.parent = this.node;
                        this.panels.push(action.node);
                        break;
                    }
                }
            }
        })
    }
}