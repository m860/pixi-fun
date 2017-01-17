/**
 * Created by xxx on 2017/1/15.
 */
const keydownHandler=Symbol();
const keyupHandler=Symbol();
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
        document.addEventListener('keydown', this[keydownHandler], false);
        document.addEventListener('keyup', this[keyupHandler], false);
    }

    [keydownHandler](event){
        this.status[event.keyCode] = true;
    }
    [keyupHandler](event){
        this.status[event.keyCode] = false;
    }

    keydown(code) {
        return this.status[code];
    }

    reset() {
        for (let i = 0; i < this.status.length; i++) {
            this.status[i] = false;
        }
    }

    clear(){
        document.removeEventListener('keydown',this[keydownHandler],false);
        document.removeEventListener('keyup',this[keyupHandler],false);
    }
}