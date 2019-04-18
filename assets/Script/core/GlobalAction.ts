import { Type, Unit, TypeUnit } from "../basic/Types";

export type GlobalAction 
    = Type <"SingleChoiceQuestion_Over", Unit> // 单选题结束
    | Type <"FillTheBlankQuestion_Over", Unit> // 填空题结束
    | TypeUnit<"ConnectionQuestion_Over">
    | Type <"ShowResult", string>
    | Type<"ShowMsg", string>