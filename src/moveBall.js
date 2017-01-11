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
		renderer = autoDetectRenderer(width, height);
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

let update = (debug, world, scale = 30.0, renderer, stage, fps = 60.0,onKeyboard)=> {
	if(onKeyboard){
		onKeyboard();
	}
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
		update(debug, world, scale, renderer, stage, fps,onKeyboard);
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let createGround = (world, stage, texture, x, y, width, height, scale = 30.0)=> {
	let bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.Set(getRV(x, scale), getRV(y, scale));
	let fixtureDef = new b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.8;
	fixtureDef.restitution = 0.2;
	fixtureDef.shape = new b2PolygonShape();
	fixtureDef.shape.SetAsBox(getRV(width / 2, scale), getRV(height / 2, scale));
	let body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	// add sprite to ground
	let sprite = new TilingSprite(texture, width, height);
	sprite.anchor.set(0.5);
	stage.addChild(sprite);
	body.$sprite = sprite;
	return body;
};
let createBall=(world, stage, texture, x, y, radius, scale = 30.0)=>{
	let bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.Set(getRV(x, scale), getRV(y, scale));
	let fixtureDef = new b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.8;
	fixtureDef.restitution = 0.2;
	fixtureDef.shape = new b2CircleShape(getRV(radius,scale));
	let body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	// add sprite to ground
	let sprite = new Sprite(texture,x,y);
	sprite.anchor.set(0.5);
	stage.addChild(sprite);
	body.$sprite = sprite;
	return body;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Keyboard{
	static W=87
	static S=83
	static A=65
	static D=68
	static J=74
	static K=75
	static SPACE=32
	constructor(){
		this.status=new Array(255);
		this.reset();
		document.addEventListener('keydown',event=>{
			this.status[event.keyCode]=true;
		},false);
		document.addEventListener('keyup',event=>{
			this.status[event.keyCode]=false;
		},false);
	}
	keydown(code){
		return this.status[code];
	}
	reset(){
		for(let i =0;i<this.status.length;i++){
			this.status[i]=false;
		}
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//create canvas render
let width = 800;
let height = 600;
let debug = true;
// let debug = false;
let renderer = createRender(width, height, debug);
document.body.appendChild(renderer.view);
let stage = new Container();

let gravity = new b2Vec2(0, 0);
let allowSleep = true;
let scale = 30.0;
let world = new b2World(gravity, allowSleep);
if (debug) {
	let context = renderer.view.getContext('2d');
	appendDebugRender(world, context, scale);
}
let keyboard=new Keyboard();
loader.add([brickImage,ballImage]).load(()=> {
	// bottom ground
	createGround(world,stage,resources[brickImage].texture,400,590,800,20);
	// left ground
	createGround(world,stage,resources[brickImage].texture,0,300,20,800);
	// right ground
	createGround(world,stage,resources[brickImage].texture,790,300,20,800);
	//
	createGround(world,stage,resources[brickImage].texture,400,10,800,20);

	//ball
	let ball=createBall(world,stage,resources[ballImage].texture,400,300,30);
	ball.SetSleepingAllowed(false);
	// ball.ApplyForce(new b2Vec2(2,0),ball.GetLocalCenter());

	// document.addEventListener("keypress",event=>{
	// 	if(event.keyCode===32){
	// 		ball.ApplyForce(new b2Vec2(0,-3),ball.GetWorldCenter());
	// 	}
	// },false);

	// loop
	update(debug, world, scale, renderer, stage, 60,()=>{
		let ballPos=ball.GetPosition();
		if(keyboard.keydown(Keyboard.W)){
			ballPos.y--;
		}
		if(keyboard.keydown(Keyboard.S)){
			ballPos.y++;
		}
		if(keyboard.keydown(Keyboard.A)){
			ballPos.x--;
		}
		if(keyboard.keydown(Keyboard.D)){
			ballPos.x++;
		}
		ball.SetPosition(ballPos);
	});
});








