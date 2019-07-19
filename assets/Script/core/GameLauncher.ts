
import { BehaviorSubject } from "rxjs"

export const onShow = new BehaviorSubject<OnShowInfo>(null);
export type OnShowInfo = {
    scene: number;
    query: any;
    shareTicket: string;
    referrerInfo: {
        appId: string;
        extraData: any;
    }
}

function initGlobal() {
  // init config;
  // init onShow
    if (window['wx']) {
        window['wx'].onShow((info: OnShowInfo) => {
            onShow.next(info);
        })
  }
}

(function main() {
  initGlobal();
})();
