/**
 * Created by xxx on 2017/1/15.
 */

export default class Scene{
    static STATUS_INIT=0;
    static STATUS_RUNNING=10;
    static STATUS_PAUSE=20;
    static STATUS_CLEAR=30;
    constructor(conf:{
        onBeforeStep:Function
        ,onAfterStep:Function
        ,onBeforeRender:Function
        ,onAfterRender:Function
    }={
        onBeforeStep:()=>{}
        ,onAfterStep:()=>{}
        ,onBeforeRender:()=>{}
        ,onAfterRender:()=>{}
    }){
        this.conf=conf;
        this.world=null;
        this.bodies={};
        this.sprites={};
        this.status=Scene.STATUS_INIT;
        this.onClear=null;
    }
    addBody(name:String,bodyDef:Box2D.Dynamics.b2BodyDef,fixtureDefs:Box2D.Dynamics.b2FixtureDef[]){
        if(!this.bodies[name]){
            this.bodies[name]={
                bodyDef,
                fixtureDefs
            };
        }
        else{
            throw new Error(`the body name is ${name} is exists`);
        }
    }
    addSprite(name:String,sprite:Object,bindBody:String){
        if(!this.sprites[name]){
            this.sprites[name]={
                sprite,
                bindBody
            };
        }
        else{
            throw new Error(`the sprite name is ${name} is exists`);
        }
    }
    update(){
        if(this.status===Scene.STATUS_RUNNING) {
            this.world.step(this.conf.onBeforeStep, this.conf.onAfterStep);
            this.world.render(this.conf.onBeforeRender, this.conf.onAfterRender);
            requestAnimationFrame(this.update.bind(this));
        }
        if(this.status===Scene.STATUS_CLEAR){
            debugger
            // remove all bodies
            this.world.removeAllBodies();
            // remove all sprite
            this.world.removeAllSprite();
            this.world.step(this.conf.onBeforeStep, this.conf.onAfterStep);
            this.world.render(this.conf.onBeforeRender, this.conf.onAfterRender);
            // invoke onClear
            this.onClear();
        }
    }
    pause(){
        this.status=Scene.STATUS_PAUSE;
    }
    start(){
        this.status=Scene.STATUS_RUNNING;
        this.update();
    }
    clear(callback:Function=()=>{}){

        this.status=Scene.STATUS_CLEAR;
        this.onClear=callback;
    }
}