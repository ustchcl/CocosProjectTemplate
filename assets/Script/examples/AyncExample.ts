import { Type, TypeUnit, ActionUnit, Action, unit, Cons, ConsUnit } from "../basic/Types";
import { BehaviorSubject } from "rxjs";
import { always } from "ramda"
import { modify, wait } from "../basic/BaseFunction";
import { BaseComponent } from "../basic/BaseComponent";
import { TOUCH_END } from "../basic/Constants";
import { RemoteData } from "../basic/RemoteData";

const {ccclass, property} = cc._decorator

interface State {
    content: BehaviorSubject<RemoteData<string, string>>;
}

type Action 
    = TypeUnit<"Fetch">
    | TypeUnit<"Cancel"> 
    | TypeUnit<"Clear">

@ccclass
export class AsyncExample extends BaseComponent<State, Action> {
    @property(cc.Label)
    contentLabel: cc.Label = null;
    @property(cc.Button)
    fetchBtn: cc.Button = null;
    @property(cc.Button)
    clearBtn: cc.Button = null;


    start () {
        // this.onTouchEnd(this.fetchBtn.node, ActionUnit("Fetch"));
        // 如果需要在响应之后触发回调
        this.fetchBtn.node.on(TOUCH_END, async () => {
            await this.eval(ActionUnit("Fetch"));
            console.log("callback");
            // callback
        }, this);

        this.onTouchEnd(this.clearBtn.node, ActionUnit("Clear"));
        this.state = {
            content: new BehaviorSubject(ConsUnit("NotAsked"))
        };
        this.subs = [
            this.state.content.subscribe({ next: content => this.render(content)})
        ]
    }

    render(content: RemoteData<string, string>) {
        switch (content.typeName) {
            case "NotAsked": {
                this.contentLabel.string = "click fetch button";
                break;
            }
            case "Loading": {
                this.contentLabel.string = "loading...";
                break;
            }
            case "Success": {
                this.contentLabel.string = `:simle: ${content.value}`;
                break; 
            }
            case "Failure": {
                this.contentLabel.string = `:error: ${content.value}`;
                break;
            }
        }
    }

    async eval (action: Action) {
        switch (action.typeName) {
            case "Fetch": {
                modify(this.state.content, always(ConsUnit("Loading")));
                await wait(3);
                // 网络请求或者其他
                if (Math.random() > 0.2) {
                    modify(this.state.content, always(Cons("Success", "All packages installed (1 packages installed from git, used 4s(network 4s)")));
                } else {
                    modify(this.state.content, always(Cons("Failure", "errCode: 500")));
                }
                
                break;
            }
            case "Clear": {
                modify(this.state.content, always(ConsUnit("NotAsked")));
                break;
            }
        }
    }
}
