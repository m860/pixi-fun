/**
 * Created by jean.h.ma on 1/5/17.
 */
require("./index.sass");
import ballImage from './assets/temp/ball.png';
import brickImage from './assets/temp/brick.png';

// box2d short name
let b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2DebugDraw = Box2D.Dynamics.b2DebugDraw,
	b2Vec2 = Box2D.Common.Math.b2Vec2,
	b2World = Box2D.Dynamics.b2World,
	b2Body = Box2D.Dynamics.b2Body,
	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef;

// PIXI short name
let Container = PIXI.Container,
	CanvasRenderer = PIXI.CanvasRenderer,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	TilingSprite = PIXI.extras.TilingSprite,
	loader = PIXI.loader,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite;

let createRender = (width, height, debug = false)=> {
	let renderer;
	if (debug) {
		renderer = new CanvasRenderer(width, height);
	}
	else {
		renderer = autoDetectRenderer(width, height,{
			transparent:true
		});
	}
	return renderer;
};
let appendDebugRender = (world, context, scale = 30.0)=> {
	let debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(context);
	debugDraw.SetAlpha(0.5);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_centerOfMassBit);
	debugDraw.SetDrawScale(scale);
	world.SetDebugDraw(debugDraw);
};

let getRV = (value, scale = 30.0)=> {
	return value / scale;
};

let applyState = (body, scale = 30.0)=> {
	let sprite = body.$sprite;
	if (sprite) {
		let pos = body.GetPosition();
		let angle = body.GetAngle();
		sprite.x = pos.x * scale;
		sprite.y = pos.y * scale;
		sprite.rotation = angle;
	}
};

let update = (debug, world, scale = 30.0, renderer, stage, fps = 60.0)=> {
	world.Step(1 / fps, 10, 8);
	if (debug) {
		world.DrawDebugData();
	}
	else {
		let body = world.GetBodyList();
		while (body) {
			applyState(body, scale);
			body = body.GetNext();
		}
		renderer.render(stage);
	}
	return requestAnimationFrame(()=> {
		update(debug, world, scale, renderer, stage, fps);
	});
}

//create canvas render
let width = window.innerWidth;
let height = window.innerHeight;
let debug = true;
// let debug = false;
let renderer = createRender(width, height, debug);
document.body.appendChild(renderer.view);
let stage = new Container();

let gravity = new b2Vec2(0, 10);
let allowSleep = true;
let scale = 30.0;
let world = new b2World(gravity, allowSleep);
if (debug) {
	let context = renderer.view.getContext('2d');
	appendDebugRender(world, context, scale);
}

loader.add([brickImage]).load(()=> {
	// ground
	let groundWidth=200;
	let groundHeight=100;
	let groundX=300;
	let groundY=300;
	let groundBodyDef = new b2BodyDef();
	groundBodyDef.position.Set(getRV(groundX, scale), getRV(groundY, scale));
	groundBodyDef.type = b2Body.b2_staticBody;
	let groundFixtureDef = new b2FixtureDef();
	groundFixtureDef.density = 1.0;
	groundFixtureDef.friction = 0.8;
	groundFixtureDef.restitution = 0.2;
	groundFixtureDef.shape = new b2PolygonShape();
	groundFixtureDef.shape.SetAsBox(getRV(groundWidth/2, scale), getRV(groundHeight/2, scale));
	let ground = world.CreateBody(groundBodyDef);
	ground.CreateFixture(groundFixtureDef);
	// add sprite to ground
	let groundSprite = new TilingSprite(resources[brickImage].texture,groundWidth, groundHeight);
	groundSprite.anchor.set(0.5);
	stage.addChild(groundSprite);
	ground.$sprite=groundSprite;

	// loop
	update(debug, world, scale, renderer, stage, 60);
});







