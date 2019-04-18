import { ConfigUtils } from "./config/ConfigUtils";
import { sample } from "../basic/Array";
import { config } from "./config/Config";
import * as R from "ramda"
import { QuestionLib } from "./QuestionLib";
import { fillTheBlankConfig } from "./config/FillTheBlankConfig";
import { collectionQuestionConfig } from "./config/ConnectionQuestionConfig";

export class Examination {
    private static _instance: Examination = null;

    singleChoiceQuestions: QuestionLib<ConfigUtils.SingleChoiceQuestion> = null;
    fillTheBlankQuestions: QuestionLib<ConfigUtils.FillBlankQuestion> = null;
    connnectionQuestions: QuestionLib<ConfigUtils.ConnectionQuestion> = null;

    private constructor() {
        this.singleChoiceQuestions = new QuestionLib<ConfigUtils.SingleChoiceQuestion>([]);
    }

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new Examination();
        }
        return this._instance;
    }

    /**
     * 初始化考试
     */
    public init () {
        this.singleChoiceQuestions = new QuestionLib(sample(10, R.values(config)).map(ConfigUtils.convertSingleChoiceQuestion));
        this.fillTheBlankQuestions = new QuestionLib(sample(10, R.values(fillTheBlankConfig)).map(ConfigUtils.convertFillTheBlank));
        this.connnectionQuestions = new QuestionLib(sample(10, R.values(collectionQuestionConfig)).map(ConfigUtils.convertConnectionQuestion))
    }

    /**
     * 批阅试卷，根据数据生成记录
     */
    public review () {

    }

    


    
    
}