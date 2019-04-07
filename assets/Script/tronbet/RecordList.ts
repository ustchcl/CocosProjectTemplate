import RecordItem from "./RecordItem";
import { BetRecord } from "./GameRule";
import { Model } from "./BetData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RecordList extends cc.Component {
    @property([RecordItem])
    items: Array<RecordItem> = [];


    start () {
        Model.records.link(this.render, this);
    }

    render (data: Array<BetRecord>) {
        this.items.forEach((item, index) => {
            let show = data.length > index;
            item.node.active = show;
            show && item.render(data[index]);            
        });
    }
}