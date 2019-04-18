import * as R from "ramda"
import * as Rx from "rxjs"
import { BaseComponent } from "../basic/BaseComponent";
import { Type, TypeUnit, ActionUnit, Action, Pair, mkPair } from "../basic/Types";
import { ConfigUtils } from "./config/ConfigUtils";
import { Examination } from "./ExaminationData";
import { modify } from "../basic/BaseFunction";
import { textToRichText, distance, addVec2, mutilVec2, toPolar } from "../basic/Utils";
import { Maybe } from "../basic/Maybe";
import { ResUtils } from "./res/ResUtils";
import { GlobalEnv } from "../basic/GlobalEnv";
/**
 * Copyright  : (C) Chenglin Huang 2019
 * Maintainer : Chenglin Huang <ustchcl@gmail.com>
 */
type Action
     = TypeUnit<"Initialize">
     | Type<"SelectLeft", number>
     | Type<"SelectRight", number>
     | Type<"Connect", Pair<number, number>>
     | TypeUnit<"Reset">
     | TypeUnit<"Next">
     | TypeUnit<"Finish">

type Question = ConfigUtils.ConnectionQuestion;
type SelectType = Pair<"Left", number> | Pair<"Right", number>

type State = {
    question: Rx.BehaviorSubject<Question>;
    result: Rx.BehaviorSubject<{[key: number]: number}>;
    currentSelect: Rx.BehaviorSubject<Maybe<SelectType>>;
}

const ItemAmount = 3;
const Color = {
    selected: "#4444ee",
    normal: "#ffffff",
    currentSelect: "#fe0324"
}

const { ccclass, property } = cc._decorator;


@ccclass
export default class ConnectionQuestion extends BaseComponent<State, Action> {
    @property([cc.Label])
    leftLabels: Array<cc.Label> = [];
    @property([cc.Sprite])
    rightSps: Array<cc.Sprite> = [];
    @property([cc.Label])
    rightLabels: Array<cc.Label> = [];
    @property(cc.Button)
    nextButton: cc.Button = null;
    @property(cc.Button)
    resetButton: cc.Button = null;
    
    @property([cc.Sprite])
    lines: Array<cc.Sprite> = [];

    start () {
        this.actions = new Rx.Subject<Action>();
        this.actions.subscribe({ next: action => this.eval(action) });
        this.leftLabels.forEach((label, index) => {
            this.onTouchEnd(label.node, Action("SelectLeft", index));
        });
        this.rightLabels.forEach((label, index) => {
            this.onTouchEnd(label.node, Action("SelectRight", index));
        });
        this.rightSps.forEach((label, index) => {
            this.onTouchEnd(label.node, Action("SelectRight", index));
        });
        this.onTouchEnd(this.nextButton.node, ActionUnit("Next"));
        this.onTouchEnd(this.resetButton.node, ActionUnit("Reset"));
        this.fork(ActionUnit("Initialize"));
    }

    eval(action: Action) {
        switch(action.typeName) {
            case "Initialize": {
                Examination.getInstance().init();
                let firstQuestion = Examination.getInstance().connnectionQuestions.next();
                if (firstQuestion.valid) {
                    this.state  = {
                        question: new Rx.BehaviorSubject<Question>(firstQuestion.val),
                        result: new Rx.BehaviorSubject({}),
                        currentSelect: new Rx.BehaviorSubject(Maybe.Nothing())
                    }
                    this.state.question.subscribe({ next: question => this.renderQuestion(question) });
                    this.state.result.subscribe({ next: words => this.renderSelected(words) });
                    this.state.currentSelect.subscribe({ next: select => this.renderCurrentSelect(select)});
                } else {
                    console.error(Examination.getInstance().fillTheBlankQuestions)
                }
                break;
            }
            case "SelectLeft": {
                let value = action.value;
                let currentSelect = this.state.currentSelect.getValue();
                if (currentSelect.valid) {
                    switch (currentSelect.val.fst) {
                        case "Left": {
                            modify(this.state.currentSelect, R.always(Maybe.Just({fst: "Left", snd: value})))
                            break;
                        } 
                        case "Right": {
                            modify(this.state.currentSelect, R.always(Maybe.Nothing()))
                            this.fork(Action("Connect", mkPair(value, currentSelect.val.snd)));
                            break;
                        }
                    }
                } else {
                    modify(this.state.currentSelect, R.always(Maybe.Just(mkPair("Left", value))));
                }
                break;
            }
            case "SelectRight": {
                let value = action.value;
                let currentSelect = this.state.currentSelect.getValue();
                if (currentSelect.valid) {
                    switch (currentSelect.val.fst) {
                        case "Right": {
                            modify(this.state.currentSelect, R.always(Maybe.Just({fst: "Right", snd: value})))
                            break;
                        } 
                        case "Left": {
                            modify(this.state.currentSelect, R.always(Maybe.Nothing()))
                            this.fork(Action("Connect", mkPair(currentSelect.val.snd, value)));
                            break;
                        }
                    }
                } else {
                    modify(this.state.currentSelect, R.always(Maybe.Just(mkPair("Right", value))));
                }
                break;
            }
            case "Connect": {
                let value = action.value;
                modify(this.state.result, R.assoc(value.fst, value.snd));
                break;
            }
            case "Reset": {
                modify(this.state.result, R.always({})),
                modify(this.state.currentSelect, R.always(Maybe.Nothing()));
                break;
            }
            case "Next": {
                let yourAnwser = this.state.result.getValue();
                if (R.values(yourAnwser).length < ItemAmount) {
                    GlobalEnv.getInstance().dispatchAction(Action("ShowMsg", "还没有填完"))
                    break;
                } 
                let question = this.state.question.getValue();
                let yourAnwserString = {};
                for (let key in yourAnwser) {
                    yourAnwserString[question.leftItems[key]] = question.rightItems[yourAnwser[key]];
                }
                let result = ""
                let rightAnwser = this.state.question.getValue().anwsers;
                if (R.equals(rightAnwser, yourAnwserString)) {
                    result = "恭喜你，答对了";
                } else {
                    result = "答错了 o(╥﹏╥)o\n" + "你的答案" + JSON.stringify(yourAnwserString) + "\n正确答案" + JSON.stringify(rightAnwser)
                }
                GlobalEnv.getInstance().dispatchAction(Action("ShowResult", result))
                let nextQuestion = Examination.getInstance().connnectionQuestions.next();
                if (nextQuestion.valid) {
                    modify(this.state.result, R.always({}));
                    modify(this.state.currentSelect, R.always(Maybe.Nothing()));
                    modify(this.state.question, R.always(nextQuestion.val))
                } else {
                    this.fork(ActionUnit("Finish"));
                }
                break;
            }
            case "Finish": {
                console.log("OVER");
                this.dispatch(ActionUnit("FillTheBlankQuestion_Over"));
                break;
            }
        }
    }

    renderQuestion (question: Question) {
        this.leftLabels.forEach((label, index) => label.string = question.leftItems[index] + "");
        switch (question.type) {
            case "Chinese_to_English": {
                this.rightLabels.forEach(l => l.node.active = true);
                this.rightSps.forEach(s => s.node.active = false);
                this.rightLabels.forEach((label, index) => label.string = question.rightItems[index] + "");
                break;
            }
            case "Sprite_to_English": {
                this.rightLabels.forEach(l => l.node.active = false);
                this.rightSps.forEach(s => s.node.active = true);
                this.rightSps.forEach(async (s, index) => s.spriteFrame = await ResUtils.sprite(question.rightItems[index]))
                break;
            }
        }
        
    }

    renderSelected(result: {[key: number]: number}) {
        this.leftLabels.forEach(l => l.node.color = new cc.Color().fromHEX(Color.normal));
        this.rightLabels.forEach(l => l.node.color = new cc.Color().fromHEX(Color.normal));
        this.lines.forEach(l => l.node.active = false);
        let count = 0;
        for (let key in result) {
            let value = result[key];
            let label1 = this.leftLabels[key];
            let label2 = this.rightLabels[value];
            label1.node.color = new cc.Color().fromHEX(Color.selected);
            label2.node.color = new cc.Color().fromHEX(Color.selected);
            let p1 = label1.node.getPosition();
            let pp1 = label1.node.parent.getPosition();
            let p2 = label2.node.getPosition();
            let pp2 = label2.node.parent.getPosition();
            let p1_ = addVec2(pp1)(p1);
            let p2_ = addVec2(pp2)(p2);
            this.lines[count].node.active = true;
            this.lines[count].node.width = distance(p1_)(p2_);
            this.lines[count].node.rotation = 180 - toPolar(addVec2(p1_)(mutilVec2(-1)(p2_))).theta * 180 / Math.PI;
            this.lines[count].node.setPosition(mutilVec2(0.5)(addVec2(p1_)(p2_)));
            count ++;
        }
    }

    renderCurrentSelect(currentSelect: Maybe<SelectType>) {
        if (currentSelect.valid) {
            switch (currentSelect.val.fst) {
                case "Left": {
                    this.leftLabels[currentSelect.val.snd].node.color = new cc.Color().fromHEX(Color.currentSelect);
                    break;
                }
                case "Right": {
                    this.rightLabels[currentSelect.val.snd].node.color = new cc.Color().fromHEX(Color.currentSelect);
                    break;
                }
            }
        }
    }

}