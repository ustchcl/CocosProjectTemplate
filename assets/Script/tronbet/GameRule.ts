import { wait, always } from "../rx-cocos/BaseFunction";
import { Model } from "./BetData";
import { add, __, append, prepend } from 'ramda'
import { randi } from "../Random";

export module GameRule {
    export const username = "HongShen"
    export const BACK_RATE = 0.985;

    export async function bet(betNumber: number, wager: number): Promise<boolean> {
        await wait(0.1);
        // 1. 触发规则产生随机数
        let random = randi(99);
        Model.randomNumber.update(always(random));
        // 2. 更新拥有的货币数
        let win = betNumber < random;
        let scale = win ? getBetScale(betNumber) : 0;
        Model.balance.update(add(__,   (scale - 1) * wager));
        // 3. 触发规则产生记录
        let record = Record(betNumber, random, wager);
        Model.records.update(prepend(record));
        return true;
    }

    function Record(betNumber: number, random: number, wager: number): BetRecord {
        return {
            username: username,
            win: betNumber < random,
            bet: betNumber,
            wager: wager,
            random: random,
            timestamp: Date.now()
        }
    }

    export function getBetScale(betNumber: number) {
        let p = ((99 - betNumber) / 100);
        return BACK_RATE / p;
    }
}

export interface BetRecord {
    username: string,
    win: boolean,
    bet: number,
    wager: number,
    random: number,
    timestamp: number
}