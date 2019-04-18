
/**
 * 生成随机数 [min, max)
 * @param min 左边界
 * @param max 右边界
 * @param floating 是否为浮点 `true`: 浮点型  `false`: 整数
 */
export function random(min: number, max: number, floating: boolean) {
    if (max == null) {
        max = min;
        min = 0;
    }

    var rand = Math.random();

    if (floating || min % 1 || max % 1) {
        return Math.min(
            min +
            rand *
            (max - min + parseFloat('1e-' + ((rand + '').length - 1))),
            max
        );
    }

    return min + Math.floor(rand * (max - min + 1));
}

/**
 * 将配置的文本信息转换成富文本
 * @param text 配置的文本信息
 */
export function textToRichText(text: string): string {
    if (text == undefined) text = "";
    text = text.toString();
    text = text.replace(/\[f{6}\]/g, "</color>").replace(/\n/g, '<br/>');
    let pattern = /\[([a-zA-Z0-9]{6})\]/g;
    text = text.replace(pattern, "<color=#$1>")
    return text;
}


/**
 * localToGlobal
 * 获取节点在全局的左边点
 */
export function globalPosition(node: cc.Node): cc.Vec2 {
    let result = new cc.Vec2(0, 0);
    // node.convertToWorldSpace

    return result;
}

// position 运算
export function addVec2(v1: cc.Vec2,) {
    return (v2: cc.Vec2): cc.Vec2 => {
        return new cc.Vec2(v1.x + v2.x, v1.y + v2.y);
    }
}

export function mutilVec2(scale: number) {
    return (v: cc.Vec2): cc.Vec2 => {
        return new cc.Vec2(v.x * scale, v.y * scale);
    }
}

export function distance(v1: cc.Vec2) {
    let func = x => x * x;
    return (v2: cc.Vec2): number => {
        return Math.sqrt(func(v1.x - v2.x) + func(v1.y - v2.y));
    }
}

type PolarPosition = { r: number, theta: number }

export function toPolar(p: cc.Vec2): PolarPosition {
    let r = distance(p)(cc.Vec2.ZERO);
    let theta = Math.atan2(p.y, p.x);
    return {r: r, theta: theta};
}