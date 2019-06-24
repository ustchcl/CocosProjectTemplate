import { SecondConfirm } from "./SecondConfirm";
import { TOUCH_END } from "../../basic/Constants";
import { GlobalEnv } from "../../basic/GlobalEnv";
import { Action, Type, Pair, TypeUnit } from "../../basic/Types";
import { safeRemove } from "../../basic/BaseFunction";

export type SecondConfirmType
    = TypeUnit<"ExitSecondConfirm">
    | Type<"SaveConfigConfirm", Pair<number, number>>

export async function showSC(type: SecondConfirmType): Promise<boolean> {
    let sc: SecondConfirm = null;
    switch (type.typeName) {
        // cases
    }

    return new Promise<boolean>(function(resolve) {
        sc.cancelBtn.node.on(TOUCH_END, () => {
            safeRemove(sc.node);
            resolve(false);
        });
        sc.yesBtn.node.on(TOUCH_END, () => {
            safeRemove(sc.node);
            resolve(true);
        });
    });
}
