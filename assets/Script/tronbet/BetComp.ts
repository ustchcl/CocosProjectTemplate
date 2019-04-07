import { Model } from "./BetData";
import { always, rectBound } from "../rx-cocos/BaseFunction";
import { link } from "../rx-cocos/EventName";
import { filter, single } from "rxjs/operators";
import { fromCCEvent, Behavior } from "../rx-cocos/Behavior";

const { ccclass, property } = cc._decorator;
/**
 * 所有随机数字为[0,99]之间，
 * 返还比 r = 0.985
 * 获胜概率为p = (99 - bet) / 100
 * 收益为 x, (x - 1) * p = r => x = 1 + 
 */
@ccclass
export class BetComp extends cc.Component {
    @property(cc.Label)
    myBetLabel: cc.Label = null;
    @property(cc.Label)
    randomLabel: cc.Label = null;
    @property(cc.Slider)
    betSlider: cc.Slider = null;
    @property(cc.Label)
    rateLabel: cc.Label = null;
    @property(cc.Label)
    winLabel: cc.Label = null

    readonly R = 0.985;

    // +10

    start () {
        Model.betNumber = fromCCEvent<number>(this.betSlider.node, 'slide', this.selector, 50);
        Model.betNumber.link(this.render, this);
        Model.randomNumber.link(this.renderRandom, this);
    }

    selector(e: cc.Event.EventCustom) {
        let slider = Math.floor(e.detail.progress * 100);
        slider = rectBound(4, 98)(slider);
        return slider;
    }

    render(bet: number) {
        this.myBetLabel.string = `${bet}`;
        let p = ((99 - bet) / 100);
        this.rateLabel.string = `rate: ${p}`;
        this.winLabel.string = `win: ${(this.R / p).toFixed(4)}X`
    }

    renderRandom(random: number) {
        let bet = Model.betNumber.getValue();
        if (bet < random) {
            this.randomLabel.node.color = cc.hexToColor('#00ff00');
        } else {
            this.randomLabel.node.color = cc.hexToColor('#ff0000');
        }
        this.randomLabel.string = `${random}`;
    }

}