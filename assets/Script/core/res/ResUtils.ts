export module ResUtils {
    export function sprite(spriteId: number | string) {
        return new Promise<cc.SpriteFrame>(function (resolve, reject) {
            cc.loader.loadRes(`sprites/sprite_${spriteId}`, cc.SpriteFrame, function (err: Error, spriteFrame) {
                if (err) {
                    cc.error(err.message || err);
                    reject(err);
                    return;
                }
                resolve(spriteFrame);
            });
        });
    }


    export async function setSprite(sp: cc.Sprite, spriteId: number | string) {
        sp.spriteFrame = await sprite(spriteId);
    }
}