/**
 * Created by jean.h.ma on 1/5/17.
 */
require("./index.sass");
import test from "./assets/temp/test.png";
import ballImage from './assets/temp/ball.png';
import brickImage from './assets/temp/brick.png';

class Thing {
	constructor() {
		this.bodyDef = new Box2D.Dynamics.b2BodyDef();
		this.fixtureDef = new Box2D.Dynamics.b2FixtureDef();
		this.fixtureDef.density = 1.0;
		this.fixtureDef.friction = 0.8;
		this.fixtureDef.restitution = 0.2;
		this.sprite = null;
		this.body = null;
	}

	addSprite(name) {
		this.sprite = new PIXI.Sprite(
			PIXI.loader.resources[name].texture
		);
		this.sprite.anchor.set(0.5);
	}
}

class World {
	static scale = 30
	static fps = 1 / 30

	constructor(debug = true, gravity = new Box2D.Common.Math.b2Vec2(0, 10), allowSleep = true, width, height) {
		if(!width){
			width=window.screen.availWidth;
		}
		if(!height){
			height=window.screen.availHeight;
		}
		this.world = new Box2D.Dynamics.b2World(gravity, allowSleep);
		this.stage = new PIXI.Container();
		this.renderer = null;
		this.debug = debug;
		if (debug) {
			this.renderer = new PIXI.CanvasRenderer(width, height);
			let debugDraw = new Box2D.Dynamics.b2DebugDraw();
			debugDraw.SetSprite(this.renderer.view.getContext('2d'));
			debugDraw.SetAlpha(0.5);
			debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit);
			debugDraw.SetDrawScale(World.scale);
			this.world.SetDebugDraw(debugDraw);
		}
		else {
			this.renderer = PIXI.autoDetectRenderer(width, height);
		}
		document.body.appendChild(this.renderer.view);
	}

	applyData(body) {
		if (body && body.thing && body.thing.sprite) {
			let sprite = body.thing.sprite;
			let pos = body.GetPosition();
			let angle = body.GetAngle();
			sprite.x = pos.x * World.scale;
			sprite.y = pos.y * World.scale;
			sprite.rotation = angle;
		}
	}

	addThing(thing) {
		let body = this.world.CreateBody(thing.bodyDef);
		body.thing = thing;
		// thing.body=body;
		body.CreateFixture(thing.fixtureDef);
		if (thing.sprite) {
			this.stage.addChild(thing.sprite);
		}
		return body;
	}

	run() {
		this.world.Step(World.fps, 10, 8);
		if (this.debug) {
			this.world.DrawDebugData();
		}
		else {
			//TODO
			let body = this.world.GetBodyList();
			while (body) {
				this.applyData(body)
				body = body.GetNext();
			}
			// this.world.GetBodyList().map(body=>{
			// 	this.applyData(body,body.thing.sprite)
			// });
			this.renderer.render(this.stage);
		}
		// this.renderer.render(this.stage);
		requestAnimationFrame(this.run.bind(this));
	}
}

class Floor extends Thing {
	constructor() {
		super();
		this.bodyDef.position.Set(200 / World.scale, 250 / World.scale);
		this.bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

		this.fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
		this.fixtureDef.shape.SetAsBox(200 / World.scale, 5 / World.scale);
	}
}

class Ball extends Thing {
	constructor() {
		super();
		this.bodyDef.position.Set(200 / World.scale, 0 / World.scale);
		this.bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
		this.fixtureDef.shape = new Box2D.Collision.Shapes.b2CircleShape();
		this.fixtureDef.shape.SetRadius(30 / World.scale);
		this.fixtureDef.restitution=1;
	}
}


let world = new World(false);
world.addThing(new Floor());
PIXI.loader
	.add(ballImage)
	.add(brickImage)
	.load(()=> {
		let ball = new Ball();
		ball.sprite = new PIXI.Sprite(
			PIXI.loader.resources[ballImage].texture
		);
		ball.sprite.anchor.set(0.5);
		world.addThing(ball);

		let floor = new Floor();
		floor.sprite = new PIXI.extras.TilingSprite(
			PIXI.loader.resources[brickImage].texture,
			400,
			10
		);
		floor.sprite.anchor.set(0.5);
		world.addThing(floor);

		world.run();
	});


// let stage=new PIXI.Container();
// let renderer=new PIXI.CanvasRenderer(400,300);
// document.body.appendChild(renderer.view);
// PIXI.loader.add(ballImage).load(()=>{
// 	let ball=new PIXI.Sprite(
// 		PIXI.loader.resources[ballImage].texture
// 	);
// 	stage.addChild(ball);
// 	renderer.render(stage);
// });

/*
 const config={
 scale:30,
 allowSleep:true,
 gravity:new Box2D.Common.Math.b2Vec2(0,10)
 };

 let getWorldValue=(value)=>{
 return value/config.scale;
 };

 //create renderer
 let $stage = new PIXI.Container()
 // ,renderer = PIXI.autoDetectRenderer(375, 667);
 ,renderer =new PIXI.CanvasRenderer(375, 667);
 document.body.appendChild(renderer.view);

 //create box2d world
 let world=new Box2D.Dynamics.b2World(config.gravity,config.allowSleep);
 let debugDraw=new Box2D.Dynamics.b2DebugDraw();
 debugDraw.SetSprite(renderer.view.getContext('2d'));
 // debugDraw.SetSprite(world.renderer.view.getContext('2d'));
 debugDraw.SetAlpha(0.5);
 debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit|Box2D.Dynamics.b2DebugDraw.e_centerOfMassBit);
 debugDraw.SetDrawScale(config.scale);
 world.SetDebugDraw(debugDraw);

 // create floor
 let floorBodyDef=new Box2D.Dynamics.b2BodyDef();
 floorBodyDef.type=Box2D.Dynamics.b2Body.b2_staticBody;
 floorBodyDef.position.Set(getWorldValue(187.5),getWorldValue(300));

 let floorFixtureDef=new Box2D.Dynamics.b2FixtureDef();
 floorFixtureDef.density=1.0;
 floorFixtureDef.friction=0.8;
 floorFixtureDef.restitution=0.2;
 floorFixtureDef.shape=new Box2D.Collision.Shapes.b2PolygonShape();
 floorFixtureDef.shape.SetAsBox(getWorldValue(100),getWorldValue(25));

 let floor=world.CreateBody(floorBodyDef);
 floor.CreateFixture(floorFixtureDef);

 let loop=()=>{
 world.Step(1/60,10,8);
 world.DrawDebugData();
 requestAnimationFrame(loop);
 };

 loop();*/



