import { SecondConfirm } from "./SecondConfirm";
import { ResUtils } from "../res/ResUtils";
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
        case "ExitSecondConfirm": {
            let prefab = await ResUtils.prefab("exitSecondConfirm");
            let node = cc.instantiate(prefab);
            sc = node.getComponent(ExitSecondConfirm); // 具体的二次确认
            GlobalEnv.getInstance().dispatchAction(Action("OpenPanelWithNode", node));
            break;
        }
        case "SaveConfig": {
            let prefab = await ResUtils.prefab("saveConfig");
            let node = cc.instantiate(prefab);
            let saveConfig = node.getComponent(SaveConfig);
            saveConfig.init(type.value.fst, type.value.snd);
            sc = saveConfig;
            GlobalEnv.getInstance().dispatchAction(Action("OpenPanelWithNode", node));
            break;
        }
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
