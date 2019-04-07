import { Behavior } from "./rx-cocos/Behavior";
import ListNode from "./ListNode";
import { TOUCH_END, link } from "./rx-cocos/EventName";
import { shift, append, pop } from "./rx-cocos/Array";
import { timer } from "rxjs";
import { randi } from "./Random";
import { Fn } from "./rx-cocos/Function";
import {__, curryN, curry} from 'ramda'

const { ccclass, property } = cc._decorator;


@ccclass
export default class ListScene extends cc.Component {
    @property(cc.Layout)
    layout: cc.Layout = null;
    @property(cc.Prefab)
    prefab: cc.Prefab = null;
    @property(cc.Button)
    shiftBtn: cc.Button = null
    @property(cc.Button)
    pushBtn: cc.Button = null

    start () {
        const subject = new Behavior<Array<string>>([]);
        let _this = this;
        subject.subscribe({
            next: (v) => {
                _this.layout.node.removeAllChildren();
                v.map(x => {
                    let listNode = cc.instantiate(this.prefab).getComponent(ListNode);
                    listNode.init(x);
                    return listNode;
                }).forEach(n => n.node.parent = _this.layout.node);
            }
        });
        link(this.pushBtn.node, subject, append(__, "something"));
        link(this.shiftBtn.node, subject, x => pop(x).result);

        timer(0, 10000).subscribe({
            next: _ => {
                subject.next(_this.generator());
            }
        })
    }



    generator(): Array<string> {
        let rc = () => {
            let from = randi(25);
            return 'qwertyuiopasdfghjklzxcbvbnm'.slice(from, from + 1);
        }
        let rs = (len: number) => len <= 0 ? "" : rc() + rs(len - 1);
        let rsa = (len: number, result: Array<string>) => len <= 0 ? result : rsa(len - 1, append(result, rs(randi(16)))); 
        return rsa(randi(6), [])
    }

}