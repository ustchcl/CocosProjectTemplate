import * as R from "ramda"
import * as Rx from "rxjs"
import { BaseComponent } from "../basic/BaseComponent";
import { Type, TypeUnit, ActionUnit, Action } from "../basic/Types";
import { ConfigUtils } from "./config/ConfigUtils";
import { Examination } from "./ExaminationData";
import { modify } from "../basic/BaseFunction";
import { textToRichText } from "../basic/Utils";
import { GlobalEnv } from "../basic/GlobalEnv";
import { ResUtils } from "./res/ResUtils";
/**
 * Copyright  : (C) Chenglin Huang 2019
 * Maintainer : Chenglin Huang <ustchcl@gmail.com>
 */
type Action
     = TypeUnit<"Initialize">
     | Type<"Select", number>
     | TypeUnit<"Reset">
     | TypeUnit<"Next">
     | TypeUnit<"Finish">

type Question = ConfigUtils.FillBlankQuestion;
type State = {
    question: Rx.BehaviorSubject<Question>;
    selectedWords: Rx.BehaviorSubject<Array<{word: string, index: number}>>;
}

const { ccclass, property } = cc._decorator;


@ccclass
export default class FillTheBlank extends BaseComponent<State, Action> {
    @property([cc.Button])
    wordButtons: Array<cc.Button> = [];
    @property(cc.Button)
    nextButton: cc.Button = null;
    @property(cc.Button)
    resetButton: cc.Button = null;
    @property(cc.RichText)
    titleRichText: cc.RichText = null;
    @property([cc.Label])
    selectedLabels: Array<cc.Label> = [];
    @property([cc.Node])
    selectedNodes: Array<cc.Node> = [];
    @property(cc.Sprite)
    bgSprite: cc.Sprite = null;

    start () {
        this.actions = new Rx.Subject<Action>();
        this.actions.subscribe({ next: action => this.eval(action) });
        this.wordButtons.forEach((btn, index) => {
            this.onTouchEnd(btn.node, Action("Select", index));
        });
        this.onTouchEnd(this.nextButton.node, ActionUnit("Next"));
        this.onTouchEnd(this.resetButton.node, ActionUnit("Reset"));
        this.fork(ActionUnit("Initialize"));
    }

    eval(action: Action) {
        switch(action.typeName) {
            case "Initialize": {
                Examination.getInstance().init();
                let firstQuestion = Examination.getInstance().fillTheBlankQuestions.next();
                if (firstQuestion.valid) {
                    this.state  = {
                        question: new Rx.BehaviorSubject<Question>(firstQuestion.val),
                        selectedWords: new Rx.BehaviorSubject([])
                    }
                    this.state.question.subscribe({ next: question => this.renderQuestion(question) });
                    this.state.selectedWords.subscribe({ next: words => this.renderSelected(words) });
                } else {
                    console.error(Examination.getInstance().fillTheBlankQuestions)
                }
                break;
            }
            case "Select": {
                let value = action.value;
                let selectedWords = this.state.selectedWords.getValue();
                let wordAmount = this.state.question.getValue().wordAmount;
                if (selectedWords.map(R.prop("index")).indexOf(value) != -1) {
                    modify(this.state.selectedWords, R.identity);
                    GlobalEnv.getInstance().dispatchAction(Action("ShowMsg", "已选择该选项"));
                } else if (selectedWords.length >= wordAmount) {
                    GlobalEnv.getInstance().dispatchAction(Action("ShowMsg", "无可用之空"));
                } else {
                    modify(this.state.selectedWords, R.append({word: this.state.question.getValue().words[value], index: value}))
                }
                break;
            }
            case "Reset": {
                modify(this.state.selectedWords, R.always([]))
                break;
            }
            case "Next": {
                let yourAnwser = this.state.selectedWords.getValue().map(R.prop("word"));
                if (yourAnwser.length < this.state.question.getValue().wordAmount) {
                    GlobalEnv.getInstance().dispatchAction(Action("ShowMsg", "还没有填完"));
                    break;
                }
                let result = "";
                let rightAnwser = this.state.question.getValue().anwsers;
                if (R.equals(rightAnwser, yourAnwser)) {
                    result = "恭喜你，答对了";
                } else {
                    result = "答错了 o(╥﹏╥)o" + "\n你的答案: " + JSON.stringify(yourAnwser) + "\n正确答案:" + JSON.stringify(rightAnwser);
                }
                GlobalEnv.getInstance().dispatchAction(Action("ShowResult", result));
                let nextQuestion = Examination.getInstance().fillTheBlankQuestions.next();
                if (nextQuestion.valid) {
                    modify(this.state.selectedWords, R.always([]));
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

    async renderQuestion (question: Question) {
        let words = question.words;
        this.wordButtons.forEach((btn, index) => {
            let active = index < words.length;
            btn.node.active = active;
            if (active) {
                btn.node.getComponentInChildren(cc.Label).string = words[index];
            }
        });
        this.selectedNodes.forEach((node, index) => node.active = index < question.wordAmount);
        if (!question.description) {
            console.error(question);
        }
        this.titleRichText.string = textToRichText(question.description.replace('\n', '<br/><br/>'));
        ResUtils.setSprite(this.bgSprite, question.spriteId);
    }

    renderSelected(selectedWords: Array<{word: string, index: number}>) {
        this.wordButtons.forEach(btn => btn.node.color = new cc.Color().fromHEX('#ffffff'));
        this.selectedLabels.forEach(label => label.string = "");
        selectedWords.forEach((info, index) => {
            this.wordButtons[info.index].node.color = new cc.Color().fromHEX('#7E7A7A');
            this.selectedLabels[index].string = info.word;
        });
    }

}