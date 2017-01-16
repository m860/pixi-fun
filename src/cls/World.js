/**
 * Created by xxx on 2017/1/15.
 */
export default class World {
    constructor(conf: {
        gravity:Box2D.Common.Math.b2Vec2
        ,allowSleeping:Boolean
        ,scale:Number
        ,debug:Boolean
        ,width:Number
        ,height:Number
        ,target:Element
        ,fps:Number
        , velocityIterations:Number
        , positionIterations:Number
    } = {
        gravity: new Box2D.Common.Math.b2Vec2(0, 10)
        , allowSleeping: true
        , scale: 30.0
        , debug: true
        , width: 400
        , height: 300
        , target: document.body
        , fps: 60
        , velocityIterations: 10
        , positionIterations: 8
    }) {
        this.conf = conf;
        this.physics = new Box2D.Dynamics.b2World(conf.gravity, conf.allowSleeping);
        this.renderer = null;
        if (conf.debug) {
            this.renderer = new PIXI.CanvasRenderer(conf.width, conf.height);
        }
        else {
            this.renderer = PIXI.autoDetectRenderer(conf.width, conf.height);
        }
        conf.target.appendChild(this.renderer.view);
        if (conf.debug) {
            let debugDraw = new Box2D.Dynamics.b2DebugDraw();
            debugDraw.SetSprite(this.renderer.view.getContext('2d'));
            debugDraw.SetAlpha(0.5);
            debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit /*| b2DebugDraw.e_centerOfMassBit*/);
            debugDraw.SetDrawScale(conf.scale);
            this.physics.SetDebugDraw(debugDraw);
        }
        this.stage = new PIXI.Container();
        this._scenes = [];
    }

    get width() {
        return this.conf.width
    }

    get height() {
        return this.conf.height;
    }
    get currenScene(){
        return this._scenes[this._scenes.length-1];
    }

    getWorldValue(value: Number) {
        return value / this.conf.scale;
    }

    step(onBeforeStep:Function=()=>{},onAfterStep:Function=()=>{}) {
        onBeforeStep();
        this.physics.Step(1 / this.conf.fps,this.conf.velocityIterations,this.conf.positionIterations);
        onAfterStep();
    }
    render(onBeforeRender:Function=()=>{},onAfterRender:Function=()=>{}){
        onBeforeRender();
        if(this.conf.debug){
            this.physics.DrawDebugData()
        }
        else{
            this.renderer.render(this.stage);
        }
        onAfterRender();
    }

    push(scene: Object) {
        //clear previous scene
        // cancel update & remove all body & remove all sprite etc...
        //TODO
        scene.world=this;
        this._scenes.push(scene);
        scene.start();
    }

    pop() {
        //restore previous scene
        //TODO
    }
}