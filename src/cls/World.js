/**
 * Created by xxx on 2017/1/15.
 */
const defaultConf = {
	gravity: new Box2D.Common.Math.b2Vec2(0, 10)
	, allowSleeping: true
	, scale: 30.0
	, debug: false
	, width: 800
	, height: 600
	, target: document.body
	, fps: 60
	, velocityIterations: 10
	, positionIterations: 8
	, design: {
		width: 800,
		height: 600
	}
	, scaleSpriteModel: 'none'
}
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
		, design: {
			width: Number,
			height: Number
		}
		,scaleSpriteModel:'auto'|'uniform-width'|'uniform-height'|'none'
	} = defaultConf) {
		conf = Object.assign({
			...defaultConf
		}, conf);
		this._spriteScale = {
			x: conf.width / conf.design.width,
			y: conf.height / conf.design.height
		};
		this.conf = conf;
		this.physics = new Box2D.Dynamics.b2World(conf.gravity, conf.allowSleeping);
		this.renderer = null;
		if (conf.debug) {
			this.renderer = new PIXI.CanvasRenderer(conf.width, conf.height);
		}
		else {
			this.renderer = PIXI.autoDetectRenderer(conf.width, conf.height);
		}
		// resize render
		switch (conf.scaleSpriteModel) {
			case 'auto':
				this.renderer.resize(conf.design.width * this._spriteScale.x, conf.design.height * this._spriteScale.y);
				break;
			case 'uniform-width':
				this.renderer.resize(conf.design.width * this._spriteScale.x, conf.design.height * this._spriteScale.x);
				break;
			case 'uniform-height':
				this.renderer.resize(conf.design.width * this._spriteScale.y, conf.design.height * this._spriteScale.y);
				break;
			default:
		}
		conf.target.appendChild(this.renderer.view);
		if (conf.debug) {
			let debugDraw = new Box2D.Dynamics.b2DebugDraw();
			debugDraw.SetSprite(this.renderer.view.getContext('2d'));
			debugDraw.SetAlpha(0.5);
			debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit);
			debugDraw.SetDrawScale(conf.scale);
			this.physics.SetDebugDraw(debugDraw);
		}
		this.stage = new PIXI.Container();
		this._scenes = [];
	}

	get width() {
		return this.renderer.width;
	}

	get height() {
		return this.renderer.height;
	}

	get currenScene() {
		return this._scenes[this._scenes.length - 1];
	}

	getWorldValue(value: Number) {
		return value / this.conf.scale;
	}

	step(onBeforeStep: Function = ()=> {
	}, onAfterStep: Function = ()=> {
	}) {
		onBeforeStep();
		this.physics.Step(1 / this.conf.fps, this.conf.velocityIterations, this.conf.positionIterations);
		onAfterStep();
	}

	render(onBeforeRender: Function = ()=> {
	}, onAfterRender: Function = ()=> {
	}) {
		onBeforeRender();
		if (this.conf.debug) {
			this.physics.DrawDebugData()
		}
		else {
			this.renderer.render(this.stage);
		}
		onAfterRender();
	}

	removeAllBodies() {
		let body = this.physics.GetBodyList();
		while (body) {
			this.physics.DestroyBody(body);
			body = body.GetNext();
		}
	}

	removeAllSprite() {
		this.stage.removeChildren();
	}

	push(scene: Object, autoStart: Boolean = true) {
		let next = ()=> {
			console.log(`start ${scene.constructor.name}`)
			//load new scene
			scene.world = this;
			if (scene.conf.onBeforePush) {
				scene.conf.onBeforePush(scene);
			}
			//create body
			for (let name in scene.bodies) {
				let obj = scene.bodies[name];
				obj.body = this.physics.CreateBody(obj.bodyDef);
				obj.fixtureDefs.map(fixture=> {
					obj.body.CreateFixture(fixture);
				})
			}

			//add sprite
			for (let name in scene.sprites) {
				let obj = scene.sprites[name];
				if (obj.bindBody) {
					scene.sync.push({
						sprite: obj.sprite,
						body: scene.bodies[obj.bindBody].body
					});
				}
				switch (this.conf.scaleSpriteModel) {
					case 'uniform-width':
						obj.sprite.scale.x = this._spriteScale.x;
						obj.sprite.scale.y = this._spriteScale.x;
						break;
					case 'uniform-height':
						obj.sprite.scale.x = this._spriteScale.y;
						obj.sprite.scale.y = this._spriteScale.y;
						break;
					case 'auto':
						obj.sprite.scale.x = this._spriteScale.x;
						obj.sprite.scale.y = this._spriteScale.y;
						break;
					default:
				}

				this.stage.addChild(obj.sprite);
			}
			this._scenes.push(scene);
			if (scene.conf.onAfterPush) {
				scene.conf.onAfterPush(scene);
			}
			if (autoStart) {
				scene.start();
			}
		};
		//clear previous scene
		// cancel update & remove all body & remove all sprite etc...
		if (this.currenScene) {
			console.log('clear previous scene')
			this.currenScene.clear(()=> {
				next();
			});
		}
		else {
			next();
		}
	}

	pop() {
		//restore previous scene
		//TODO
	}
}