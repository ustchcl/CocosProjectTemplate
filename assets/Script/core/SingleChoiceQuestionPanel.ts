import { BaseComponent } from "../basic/BaseComponent";
import { Type, Unit, unit, ActionUnit, Action } from "../basic/Types";
import { BehaviorSubject, Subject } from "rxjs"
import { ConfigUtils } from "./config/ConfigUtils";
import { TOUCH_END } from "../basic/Constants";
import { modify } from "../basic/BaseFunction";
import { Examination } from "./ExaminationData";
import * as R from "ramda"
import { Maybe } from "../basic/Maybe";
import { GlobalEnv } from "../basic/GlobalEnv";
import { ResUtils } from "./res/ResUtils";

/**
 * Copyright  : (C) Chenglin Huang 2019
 * Maintainer : Chenglin Huang <ustchcl@gmail.com>
 */

const { ccclass, property } = cc._decorator;


type Action 
    = Type<"Initialize", Unit>
    | Type<"Select", number>
    | Type<"Next", Unit>
    | Type<"Finish", Unit>


type Question = ConfigUtils.SingleChoiceQuestion;

interface State {
    question: BehaviorSubject<Question>,
    selectedIndex: BehaviorSubject<Maybe<number>>
}

@ccclass
export default class SingleChoiceQuestionPanel extends BaseComponent<State, Action> {
    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property([cc.Button])
    selections: Array<cc.Button> = [];
    @property(cc.Button)
    nextButton: cc.Button = null;
    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;

    start () {
        this.actions = new Subject<Action>();
        this.actions.subscribe({next: action => this.eval(action)});
        this.selections.forEach((btn, index) => {
            this.onTouchEnd(btn.node, Action("Select", index));
        });
        this.onTouchEnd(this.nextButton.node, ActionUnit("Next"));
        this.fork(ActionUnit("Initialize"));
    }

    renderQuestion(question: Question) {
        this.titleLabel.string = question.description;
        question.selections.forEach((content, index) => {
            this.selections[index].getComponentInChildren(cc.Label).string = content.replace('\n', '\n\n');
        });
        ResUtils.setSprite(this.bgSprite, question.spriteId);
    }

    renderSelected(selectIndex: Maybe<number>) {
        this.selections.forEach(btn => btn.node.color = new cc.Color().fromHEX('#ffffff'));
        if (selectIndex.valid) {
            this.selections.forEach((btn, index) => {
                if (index == selectIndex.val) {
                    btn.node.color = new cc.Color().fromHEX('#7E7A7A')
                }
            });
        }
    }

    eval(action: Action) {
        console.log(action);
        switch(action.typeName) {
            case "Initialize": {
                Examination.getInstance().init();
                let firstQuestion = Examination.getInstance().singleChoiceQuestions.next();
                if (firstQuestion.valid) {
                    this.state  = {
                        question: new BehaviorSubject<Question>(firstQuestion.val),
                        selectedIndex: new BehaviorSubject(Maybe.Nothing())
                    }
                    this.state.question.subscribe({ next: question => this.renderQuestion(question) });
                    this.state.selectedIndex.subscribe({ next: select => this.renderSelected(select)});
                } else {
                    console.error(Examination.getInstance().singleChoiceQuestions)
                }
                break;
            }
            case "Select": {
                let value = action.value;
                modify(this.state.selectedIndex, R.always(Maybe.Just(value)));
                break;
            }
            case "Next": {
                let result = "";
                if (this.state.selectedIndex.value.map(x => x == this.state.question.value.answerIndex).getOrElse(false)) {
                    result = "恭喜你，答对了";
                } else {
                    let answer = this.state.question.value.selections[this.state.question.value.answerIndex];
                    result = "答错了 o(╥﹏╥)o, 正确答案为 " + answer;
                }
                GlobalEnv.getInstance().dispatchAction(Action("ShowResult", result))
                let nextQuestion = Examination.getInstance().singleChoiceQuestions.next();
                if (nextQuestion.valid) {
                    modify(this.state.selectedIndex, R.always(Maybe.Nothing()))
                    modify(this.state.question, R.always(nextQuestion.val))
                } else {
                    this.fork(ActionUnit("Finish"));
                }
                break;
            }
            case "Finish": {
                console.log("OVER");
                this.dispatch(ActionUnit("SingleChoiceQuestion_Over"));
                break;
            }
        }
    }
}