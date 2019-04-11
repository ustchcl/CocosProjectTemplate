import { Type, Unit } from "../basic/Types";

export type GlobalAction 
    = Type <"SingleChoiceQuestion_Over", Unit> // 单选题结束
    | Type <"FillTheBlankQuestion_Over", Unit> // 填空题结束