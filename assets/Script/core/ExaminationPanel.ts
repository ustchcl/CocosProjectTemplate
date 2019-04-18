import { BaseComponent } from "../basic/BaseComponent";
import { Type, Unit, unit, ActionUnit, TypeUnit } from "../basic/Types";
import * as Rx from "rxjs"
import * as R from "ramda"
import { map, filter } from 'rxjs/operators'
import SingleChoiceQuestionPanel from "./SingleChoiceQuestionPanel";
import { GlobalEnv } from "../basic/GlobalEnv";
import { GlobalAction } from "./GlobalAction";
import FillTheBlank from "./FillTheBlank";
import { modify } from "../basic/BaseFunction";
import ConnectionQuestion from "./ConnectionQuestion";

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

type QuestionType = "Choice" | "Blank" | "Connection"
type State = {
    time: Rx.BehaviorSubject<number>,
    questionType: Rx.BehaviorSubject<QuestionType>,
    result: Rx.BehaviorSubject<string>;
}

@ccclass
export default class ExaminationPanel extends BaseComponent<State, Action> {
    @property(SingleChoiceQuestionPanel)
    scq: SingleChoiceQuestionPanel = null;
    @property(FillTheBlank)
    fillTheBlank: FillTheBlank = null;
    @property(ConnectionQuestion)
    connectQuestion: ConnectionQuestion = null;
    @property(cc.Button)
    resetButton: cc.Button = null;
    @property(cc.Label)
    swicthLabel: cc.Label = null;
    @property(cc.Button)
    switchButton: cc.Button = null;
    @property(cc.Label)
    resultLabel: cc.Label = null;


    start () {
        this.actions = new Rx.Subject<Action>();
        this.actions.subscribe({ next: action => this.eval(action) });

        this.state = {
            time: new Rx.BehaviorSubject<number>(1000),
            questionType: new Rx.BehaviorSubject("Choice"),
            result: new Rx.BehaviorSubject("")
        };
        this.state.time.subscribe({ next: state => this.render(state) });
        this.state.questionType.subscribe({next: type => this.renderQuestionType(type)})
        this.state.result.subscribe({ next: result => this.renderResult(result) })
        GlobalEnv.getInstance().globalActions.pipe(
            filter(x => 
                x.typeName == "ShowMsg" ||
                x.typeName == "ShowResult"
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
                    case "Connection": {
                        this.connectQuestion.fork(ActionUnit("Initialize"));
                    }
                }
                modify(this.state.result, R.always(""))
                break;
            }
            case "ShowScore": {
                break;
            }
            case "Switch": {
                modify(this.state.questionType, t => {
                    switch (t) {
                        case "Choice": return "Blank";
                        case "Blank": return "Connection";
                        case "Connection": return "Choice";
                    }
                });
                this.fork(ActionUnit("Reset"));
                break;
            }
            // case "SingleChoiceQuestion_Over": {
            //     console.log("I see");
            //     modify(this.state.result, R.always("单选题结束"));
            //     break;
            // }
            // case "FillTheBlankQuestion_Over": {
            //     modify(this.state.result, R.always("填空题结束"));
            //     break;
            // }
            // case "ConnectionQuestion_Over": {
            //     modify(this.state.result, R.always("连线题结束"));
            //     break;
            // }
            case "ShowResult": {
                let value = action.value;
                modify(this.state.result, R.always(`${value}`));
                break;
            }
            case "ShowMsg": {
                let value = action.value;
                modify(this.state.result, R.always(value));
                break;
            }
        }
    }

    renderQuestionType(questionType: QuestionType) {
        switch(questionType) {
            case "Choice": {
                this.scq.node.active = true;
                this.fillTheBlank.node.active = false;
                this.connectQuestion.node.active = false;
                this.swicthLabel.string = "切换到填空题";
                break;
            }
            case "Blank": {
                this.scq.node.active = false;
                this.fillTheBlank.node.active = true;
                this.swicthLabel.string = "切换到连线题";
                this.connectQuestion.node.active = false;
                break;
            }
            case "Connection": {
                this.scq.node.active = false;
                this.fillTheBlank.node.active = false;
                this.swicthLabel.string = "切换到选择题";
                this.connectQuestion.node.active = true;
                break;
            }
        }
    }

    renderResult(result: string) {
        this.resultLabel.string = result;
    }
}