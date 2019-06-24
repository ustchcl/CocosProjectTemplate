import { Type, TypeUnit } from "../basic/Types";

export type GlobalAction 
    = TypeUnit<"GloablAction1">
    | Type<"LevelUp", number>