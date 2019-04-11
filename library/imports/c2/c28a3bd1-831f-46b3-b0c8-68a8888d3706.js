"use strict";
cc._RF.push(module, 'c28a3vRgx9Gs7DIaKiIjTcG', 'Types');
// Script/basic/Types.ts

Object.defineProperty(exports, "__esModule", { value: true });
exports.unit = "Symbol_Unit";
function Action(typeName, value) {
    return { typeName: typeName, value: value };
}
exports.Action = Action;
function ActionUnit(typeName) {
    return { typeName: typeName, value: exports.unit };
}
exports.ActionUnit = ActionUnit;

cc._RF.pop();