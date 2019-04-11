export class Singleton {
    private static _instance: Singleton = null;

    public static getInstance() {
        if (this._instance == null) {
            this._instance = new Singleton();
        }
        return this._instance;
    }
}