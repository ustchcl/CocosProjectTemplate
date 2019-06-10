import { Type, TypeUnit } from "../basic/Types";

export type GlobalAction
    = TypeUnit<"StartGame">
    | Type<"OpenPanel", PrefabName>

export type PrefabName
    = "Prefab1"
    | "Prefab2"
