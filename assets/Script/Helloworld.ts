import { BehaviorSubject } from 'rxjs'
import { Behavior, BehaviorAction } from './rx-cocos/Behavior';
import { TOUCH_END } from './rx-cocos/EventName';
import { filter } from 'rxjs/operators';

const { ccclass, property } = cc._decorator;

export interface Action<T> {
    from: string,
    target: string,
    value: T,
}

@ccclass
export default class Helloworld extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Label)
    label2: cc.Label = null
    @property
    text: string = 'hello';
    @property(cc.Button)
    plusBtn: cc.Button = null
    @property(cc.Button)
    minusBtn: cc.Button = null

    start() {
        // init logic
        this.label.string = this.text;
        const subject = new BehaviorAction({"from": null, "target": null, "value": 0});
        console.log(this.label, this.label2)

        let _this = this;
        subject.pipe(
            filter(x => x.target == _this.label.uuid)
        ).subscribe({
            next: (v) => _this.label.string = `observerB: ${v.value}`
        });
        subject.pipe(
            filter(x => x.target == _this.label2.uuid)
        ).subscribe({
            next: (v) => _this.label2.string = `observerB: ${v.value}`
        });

        this.plusBtn.node.on(TOUCH_END, () => subject.update2(
            this.plusBtn.uuid,
            this.label.uuid,
            x => x + 1));
        this.minusBtn.node.on(TOUCH_END, () => subject.update2(
                this.minusBtn.uuid,
                this.label2.uuid,
                x => x - 1));
        console.log(this.plusBtn)
    }
}
