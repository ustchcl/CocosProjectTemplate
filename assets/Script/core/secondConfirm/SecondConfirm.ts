/**
 * CopyRight  : (C) Chenglin Huang 2019
 * MainTainer : Chenglin Huang <ustchcl@gmail.com>
 */


const {ccclass, property} = cc._decorator;

@ccclass
export class SecondConfirm extends cc.Component {
    @property(cc.Button)
    yesBtn: cc.Button = null;
    @property(cc.Button)
    cancelBtn: cc.Button = null;
}
