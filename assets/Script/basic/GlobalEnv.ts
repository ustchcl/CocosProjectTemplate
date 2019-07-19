import * as Rx from "rxjs"
import { GlobalAction } from "../core/GlobalAction";

export class GlobalEnv {
    private static _instance: GlobalEnv = null;

    public globalActions: Rx.Subject<GlobalAction> = new Rx.Subject();
    
    private constructor() {

    }

    public static getInstance (): GlobalEnv {
        if (this._instance == null) {
            this._instance = new GlobalEnv();
        }
        return this._instance;
    }

    dispatchAction(action: GlobalAction) {
        this.globalActions.next(action);
    }
}