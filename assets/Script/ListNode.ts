const { ccclass, property } = cc._decorator;

@ccclass
export default class ListNode extends cc.Component {
    @property(cc.Label)
    contentnLabel: cc.Label = null

    start () {

    }

    init (content: string) {
        this.contentnLabel.string = content;
    }
}