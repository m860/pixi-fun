/**
 * Created by xxx on 2017/1/15.
 */
import World from './World'

export default class Scene {
	world: World;
	static STATUS_INIT = 0;
	static STATUS_RUNNING = 10;
	static STATUS_PAUSE = 20;
	static STATUS_CLEAR = 30;

	constructor(conf: {
		onBeforeStep:Function
		,onAfterStep:Function
		,onBeforeRender:Function
		,onAfterRender:Function
		,onBeforePush:Function
		,onAfterPush:Function
	} = {
		onBeforeStep: ()=> {
		}
		, onAfterStep: ()=> {
		}
		, onBeforeRender: ()=> {
		}
		, onAfterRender: ()=> {
		}
		, onBeforePush: ()=> {
		}
		, onAfterPush: ()=> {
		}
	}) {
		this.conf = conf;
		this.world = null;
		this.bodies = {};
		this.sprites = {};
		this.status = Scene.STATUS_INIT;
		this.onClear = null;
		this.sync=[];
	}

	addBody(name: String, bodyDef: Box2D.Dynamics.b2BodyDef, fixtureDefs: Box2D.Dynamics.b2FixtureDef[]) {
		if (!this.bodies[name]) {
			this.bodies[name] = {
				bodyDef,
				fixtureDefs
			};
		}
		else {
			throw new Error(`the body name is ${name} is exists`);
		}
	}

	addSprite(name: String, sprite: Object, bindBody: String) {
		if (!this.sprites[name]) {
			this.sprites[name] = {
				sprite,
				bindBody
			};
		}
		else {
			throw new Error(`the sprite name is ${name} is exists`);
		}
	}

	update(lastUpdateTime=Date.now()) {
		lastUpdateTime=Date.now();
		if (this.status === Scene.STATUS_RUNNING) {
			this.world.step(this.conf.onBeforeStep, this.conf.onAfterStep);
			this.sync.map(item=>{
				let bodyPos=item.body.GetPosition().Copy();
				bodyPos.Multiply(this.world.conf.scale);
				let bodyAngle=item.body.GetAngle();
				item.sprite.x=bodyPos.x;
				item.sprite.y=bodyPos.y;
				item.sprite.angle=bodyAngle;
			});
			this.world.render(this.conf.onBeforeRender, this.conf.onAfterRender);
			requestAnimationFrame(this.update.bind(this,lastUpdateTime));
		}
		if (this.status === Scene.STATUS_CLEAR) {
			console.log(`${this.constructor.name} is clear`);
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

	pause() {
		this.status = Scene.STATUS_PAUSE;
	}

	start() {
		this.status = Scene.STATUS_RUNNING;
		this.update();
	}

	clear(callback: Function = ()=> {
	}) {
		this.status = Scene.STATUS_CLEAR;
		this.onClear = callback;
	}
}