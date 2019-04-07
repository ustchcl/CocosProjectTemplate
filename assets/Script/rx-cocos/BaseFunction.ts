/**
 * 这是`const :: a -> b -> a`
 * 传入`x`返回一个函数，这个函数的值总是`x`
 * @param x 希望函数返回的数据
 */
export function always<T>(x: T) {
    return (_: any): T => {
        return x;
    }
}

export function rectBound(min: number, max: number) {
    return (v: number) => {
        return Math.min(max, Math.max(min, v));
    }
}

export function wait(seconds: number) {
    return new Promise(function (resolve, reject) {
        setTimeout(resolve, seconds * 1000);
    })
}

/**
 * 对数字进行精确度处理，如果其是整数，则返回自己
 * @param num 需要格式化的原数字
 * @param fixLength 保留小数点后几位
 */
export function formatFloat(num: number, fixLength: number) {
    if (num % 1 == 0) {
        return num;
    } else {
        let scale = Math.pow(10, fixLength);
        return Math.floor(num * scale) / scale;
    }
}


export function safeRemove(node: cc.Node) {
    if (node && node.parent) {
        node.parent.removeChild(node);
    }
}