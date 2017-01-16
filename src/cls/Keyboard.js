/**
 * Created by xxx on 2017/1/15.
 */
export default class Keyboard {
    static W = 87;
    static S = 83;
    static A = 65;
    static D = 68;
    static J = 74;
    static K = 75;
    static SPACE = 32;

    constructor() {
        this.status = new Array(255);
        this.reset();
        document.addEventListener('keydown', event=> {
            this.status[event.keyCode] = true;
        }, false);
        document.addEventListener('keyup', event=> {
            this.status[event.keyCode] = false;
        }, false);
    }

    keydown(code) {
        return this.status[code];
    }

    reset() {
        for (let i = 0; i < this.status.length; i++) {
            this.status[i] = false;
        }
    }
}