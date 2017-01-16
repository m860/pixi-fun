/**
 * Created by xxx on 2017/1/15.
 */
class Loading{
    constructor(renderer,stage){
        this.renderer=renderer;
        this.stage=stage;
        PIXI.loader.add([
            '../asets/background.png'
        ]).load(()=>{

        });
    }
}