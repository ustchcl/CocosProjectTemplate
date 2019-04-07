/**
 * 返回一个[0, max]之间的随机数
 * @param max 最大值
 */
export function rand(max: number): number {
    return Math.random() * max;
}

/**
 * 返回一个[0, max]之间的整数
 * @param max 最大值
 */
export function randi(max: number): number {
    return Math.floor(rand(max));
}