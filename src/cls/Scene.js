/**
 * Created by xxx on 2017/1/15.
 */
export default class Scene{
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
        this.pause=false;
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
        if(!this.pause) {
            this.world.step(this.conf.onBeforeStep, this.conf.onAfterStep);
            this.world.render(this.conf.onBeforeRender, this.conf.onAfterRender);
            requestAnimationFrame(this.update.bind(this));
        }
    }
    stop(){
    }
}