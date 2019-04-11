import { Type, Unit, unit } from "../basic/Types";
import { BehaviorSubject, Subject } from "rxjs";
import { TOUCH_END } from "../basic/Constants";
import { __, add, always } from "ramda"
import { modify } from "../basic/BaseFunction";
import { BaseComponent } from "../basic/BaseComponent";

const {ccclass, property} = cc._decorator

interface State {
    count: BehaviorSubject<number>;
}

type Action = Type<"Inc", Unit> | Type<"Dec", Unit> | Type<"Set", number>

@ccclass
export class Example1 extends BaseComponent<State, Action> {
    @property(cc.Button)
    minusButton: cc.Button = null;
    @property(cc.Button)
    plusButton: cc.Button = null;
    @property(cc.Label)
    contentLabel: cc.Label = null;
    @property(cc.Button)
    maxButton: cc.Button = null;

    readonly MAX_SIZE = 999;

    start () {
        this.actions = new Subject<Action>();
        this.minusButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Dec", value: unit}));
        this.plusButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Inc", value: unit}));
        this.maxButton.node.on(TOUCH_END, () => this.actions.next({typeName: "Set", value: this.MAX_SIZE}));
        this.state = {
            count: new BehaviorSubject<number>(200)
        };
        this.actions.subscribe(this.eval.bind(this));
        this.state.count.subscribe(this.render.bind(this))
    }

    render(count: number) {
        this.contentLabel.string = String(count);
    }

    eval (action: Action) {
        switch (action.typeName) {
            case "Dec": {
                let count = this.state.count.getValue();
                if (count > 0) {
                    modify(this.state.count, add(__, -1))
                }
                break;
            }
            case "Inc": {
                let count = this.state.count.getValue();
                if (count < this.MAX_SIZE) {
                    modify(this.state.count, add(__, 1))
                }
                break;
            }
            case "Set": {
                modify(this.state.count, always(action.value));
                break;
            }
        }
    }
}