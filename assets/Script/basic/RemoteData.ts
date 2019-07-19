import { Maybe } from "./Maybe";

// 远端数据类型
export type RemoteData<Ok, Err> 
    = ["NotAsked"]
    | ["Loading"]
    | ["Success", Ok]
    | ["Failure", Err]

export function fromMaybe<Ok, Err>(mb: Maybe<Ok>): RemoteData<Ok, Err> {
    if (mb.valid) {
        return ["Success",  mb.val]
    } else {
        return["NotAsked"]
    }
}