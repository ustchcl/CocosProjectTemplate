import { Type, Unit, unit } from "./Types";
import { Maybe } from "./Maybe";

// 远端数据类型
export type RemoteData<Ok, Err> 
    = Type<"NotAsked", Unit> 
    | Type<"Loading", Unit> 
    | Type <"Success", Ok> 
    | Type <"Failure", Err>

export function fromMaybe<Ok, Err>(mb: Maybe<Ok>): RemoteData<Ok, Err> {
    if (mb.valid) {
        return {typeName: "Success", value: mb.val}
    } else {
        return {typeName: "NotAsked", value: unit}
    }
}