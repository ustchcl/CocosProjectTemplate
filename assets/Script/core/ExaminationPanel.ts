import { BaseComponent } from "../basic/BaseComponent";
import { Type, Unit, unit, ActionUnit, TypeUnit } from "../basic/Types";
import * as Rx from "rxjs"
import { map, filter } from 'rxjs/operators'
import SingleChoiceQuestionPanel from "./SingleChoiceQuestionPanel";
import { GlobalEnv } from "../basic/GlobalEnv";
import { GlobalAction } from "./GlobalAction";
import FillTheBlank from "./FillTheBlank";
import { modify } from "../basic/BaseFunction";

/**
 * Copyright  : (C) Chenglin Huang 2019
 * Maintainer : Chenglin Huang <ustchcl@gmail.com>
 */

const { ccclass, property } = cc._decorator;


type Action 
    = TypeUnit<"Reset">
    | TypeUnit<"ShowScore">
    | TypeUnit<"Switch">
    | GlobalAction

type QuestionType = "Choice" | "Blank"
type State = {
    time: Rx.BehaviorSubject<number>,
    questionType: Rx.BehaviorSubject<QuestionType>
}

@ccclass
export default class ExaminationPanel extends BaseComponent<State, Action> {
    @property(SingleChoiceQuestionPanel)
    scq: SingleChoiceQuestionPanel = null;
    @property(FillTheBlank)
    fillTheBlank: FillTheBlank = null;
    @property(cc.Button)
    resetButton: cc.Button = null;
    @property(cc.Label)
    swicthLabel: cc.Label = null;
    @property(cc.Button)
    switchButton: cc.Button = null;


    start () {
        this.actions = new Rx.Subject<Action>();
        this.actions.subscribe({ next: action => this.eval(action) });

        this.state = {
            time: new Rx.BehaviorSubject<number>(1000),
            questionType: new Rx.BehaviorSubject("Choice")
        };
        this.state.time.subscribe({ next: state => this.render(state) });
        this.state.questionType.subscribe({next: type => this.renderQuestionType(type)})
        GlobalEnv.getInstance().globalActions.pipe(
            filter(x => 
                x.typeName == "SingleChoiceQuestion_Over" || 
                x.typeName == "FillTheBlankQuestion_Over"
            )
        ).subscribe({ next: action => this.eval(action) });

        this.onTouchEnd(this.resetButton.node, ActionUnit("Reset"));
        this.onTouchEnd(this.switchButton.node, ActionUnit("Switch"));
    }

    eval (action: Action) {
        switch (action.typeName) {
            case "Reset": {
                let type = this.state.questionType.getValue();
                switch (type) {
                    case "Choice": {
                        this.scq.fork(ActionUnit("Initialize"));
                        break;
                    }
                    case "Blank": {
                        this.fillTheBlank.fork(ActionUnit("Initialize"));
                        break;
                    }
                }
                
                break;
            }
            case "ShowScore": {
                break;
            }
            case "Switch": {
                modify(this.state.questionType, t => t == "Choice" ? "Blank" : "Choice");
                this.fork(ActionUnit("Reset"));
                break;
            }
            case "SingleChoiceQuestion_Over": {
                console.log("I see");
                break;
            }
            case "FillTheBlankQuestion_Over": {
                console.log("填空题结束了");
                break;
            }
        }
    }

    renderQuestionType(questionType: QuestionType) {
        switch(questionType) {
            case "Choice": {
                this.scq.node.active = true;
                this.fillTheBlank.node.active = false;
                this.swicthLabel.string = "切换到填空题";
                break;
            }
            case "Blank": {
                this.scq.node.active = false;
                this.fillTheBlank.node.active = true;
                this.swicthLabel.string = "切换到选择题";
                break;
            }
        }
    }
}