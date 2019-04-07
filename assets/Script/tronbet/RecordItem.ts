import { BetRecord } from "./GameRule";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RecordItem extends cc.Component {
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    flagLabel: cc.Label = null
    @property(cc.Label)
    betLabel: cc.Label = null
    @property(cc.Label)
    wagerLabel: cc.Label = null
    @property(cc.Label)
    randomLabel: cc.Label = null
    @property(cc.Label)
    timeLabel: cc.Label = null

    render (record: BetRecord) {
        this.nameLabel.string = record.username;
        this.flagLabel.string = record.win ? 'WIN' : 'LOSE';
        this.betLabel.string = `${record.bet}`;
        this.wagerLabel.string = `${record.wager}`;
        this.randomLabel.string = `${record.random}`;
        this.timeLabel.string = `${record.timestamp}`;
    }
}