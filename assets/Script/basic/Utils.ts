
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