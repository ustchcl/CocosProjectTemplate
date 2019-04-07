import { Model } from "../tronbet/BetData";

export enum PanelActionType {Open, Close, CloseAll, CloseAllAndOpen}

export interface PanelAction {
    type: PanelActionType;
    node: cc.Node;
}

export module Panel {

    export function open(node: cc.Node) {
        return () => Model.panelActions.next({
            type: PanelActionType.Open,
            node: node
        });
    }

    export function close(node: cc.Node) {
        return () => Model.panelActions.next({
            type: PanelActionType.Close,
            node: node
        });
    }

    export function closeAll() {
        return () => Model.panelActions.next({
            type: PanelActionType.CloseAll,
            node: null
        });
    }

    export function closeAllAndOpen(node: cc.Node) {
        return () => Model.panelActions.next({
            type: PanelActionType.CloseAllAndOpen,
            node: node
        });
    }
}