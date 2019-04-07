import { Behavior } from "../rx-cocos/Behavior";
import { BetRecord } from "./GameRule";
import { Observable, of, Subject } from "rxjs";
import { PanelAction } from "../rx-cocos/PanelAction";

export module Model {
    export const balance = new Behavior<number>(10000);
    export let betNumber: Behavior<number> = null;
    export const randomNumber = new Behavior<number>(0);
    export const records = new Behavior<Array<BetRecord>>([]);
    export const wager = 100;

    export const panelActions: Subject<PanelAction> = new Subject<PanelAction>();
}