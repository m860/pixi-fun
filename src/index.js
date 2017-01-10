/**
 * Created by jean.h.ma on 1/5/17.
 */
require("./index.sass")
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let config = {
	debug: false,
	world: {
		scale: 30.0,
		fps: 30,
		velocityIterations: 10,
		positionIterations: 2,
		gravity: new b2Vec2(0, 0),
		allowSleep: true,
	},
	renderer: {
		width: 300//window.innerWidth,
		, height: 400 // window.innerHeight
	},
	resources: {
		player: require("./assets/planes/my_1.png")
	}
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

let update = (debug, world, scale = 30.0, renderer, stage, fps = 60.0, onKeyboard,lastTime=Date.now())=> {
	if (onKeyboard) {
		onKeyboard(Date.now()-lastTime);
	}
	lastTime=Date.now();
	world.Step(1 / fps, 10, 8);
	if (debug) {
		world.DrawDebugData();
	}
	else {
		let body = world.GetBodyList();
		while (body && body.IsAwake()) {
			applyState(body, scale);
			body = body.GetNext();
		}
		renderer.render(stage);
	}
	return requestAnimationFrame(()=> {
		update(debug, world, scale, renderer, stage, fps, onKeyboard,lastTime);
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
	fixtureDef.restitution = 0.0;
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
let createBall = (world, stage, texture, x, y, radius, scale = 30.0)=> {
	let bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.Set(getRV(x, scale), getRV(y, scale));
	let fixtureDef = new b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.8;
	fixtureDef.restitution = 0.0;
	fixtureDef.shape = new b2CircleShape(getRV(radius, scale));
	let body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	// add sprite to ground
	let sprite = new Sprite(texture, x, y);
	sprite.anchor.set(0.5);
	stage.addChild(sprite);
	body.$sprite = sprite;
	return body;
};
let getResourcesArray = (res)=> {
	let arr = [];
	for (let key in res) {
		arr.push(res[key]);
	}
	return arr;
};
let createEdge = (world, stage, layout = 2, width = config.renderer.width, height = 20, scale = 30.0)=> {
	let x = config.renderer.width / 2,
		y = config.renderer.height + height / 2;
	switch (layout) {
		case 1:
			x = config.renderer.width + width / 2;
			y = config.renderer.height / 2;
			break;
		case 3:
			x = -width / 2;
			y = config.renderer.height / 2;
			break;
		default:
	}
	let bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.Set(getRV(x, scale), getRV(y, scale));
	let fixtureDef = new b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.8;
	fixtureDef.restitution = 0.0;
	fixtureDef.shape = new b2PolygonShape();
	fixtureDef.shape.SetAsBox(getRV(width / 2, scale), getRV(height / 2, scale));
	let body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	return body;
};
let createPlane = (world, stage, texture, scale = 30.0)=> {
	let x = config.renderer.width / 2,
		y = config.renderer.height / 2,
		width = 20,
		height = 30;
	let bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.Set(getRV(x, scale), getRV(y, scale));
	let fixtureDef = new b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.8;
	fixtureDef.restitution = 0.0;
	fixtureDef.shape = new b2PolygonShape();
	fixtureDef.shape.SetAsBox(getRV(width / 2, scale), getRV(height / 2, scale));
	let body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	let sprite = new Sprite(texture, x, y);
	body.$sprite = sprite;
	stage.addChild(sprite);
	return body;
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
class Plane{
	constructor(world, stage, texture, scale = 30.0){
		let x = config.renderer.width / 2,
			y = config.renderer.height / 2,
			width = 20,
			height = 30;
		this.bodyDef = new b2BodyDef();
		this.bodyDef.type = b2Body.b2_dynamicBody;
		this.bodyDef.position.Set(getRV(x, scale), getRV(y, scale));
		this.fixtureDef = new b2FixtureDef();
		this.fixtureDef.density = 1.0;
		this.fixtureDef.friction = 0.8;
		this.fixtureDef.restitution = 0.0;
		this.fixtureDef.shape = new b2PolygonShape();
		this.fixtureDef.shape.SetAsBox(getRV(width / 2, scale), getRV(height / 2, scale));
		let body = world.CreateBody(this.bodyDef);
		body.SetSleepingAllowed(false);
		body.CreateFixture(this.fixtureDef);
		let sprite = new Sprite(texture, x, y);
		sprite.anchor.set(0.5);
		body.$sprite = sprite;
		stage.addChild(sprite);
		this.body=body;
		// return body;

		this.speedValue=0.2;
	}

	update(direction=0,delta){
		let pos=this.body.GetPosition();
		let speedUnit=new b2Vec2(0,-1);
		switch (direction){
			case 1:
				speedUnit=new b2Vec2(1,0);
				break;
			case 2:
				speedUnit=new b2Vec2(0,1);
				break;
			case 3:
				speedUnit=new b2Vec2(-1,0);
				break;
			default:
				speedUnit=new b2Vec2(0,-1);
		}
		speedUnit.Multiply(this.speedValue);
		pos.Add(speedUnit);
		this.body.SetPosition(pos);
	}

}
class Keyboard {
	static W = 87
	static S = 83
	static A = 65
	static D = 68
	static J = 74
	static K = 75
	static SPACE = 32

	constructor() {
		this.status = new Array(255);
		this.reset();
		document.addEventListener('keydown', event=> {
			this.status[event.keyCode] = true;
		}, false);
		document.addEventListener('keyup', event=> {
			this.status[event.keyCode] = false;
		}, false);
	}

	keydown(code) {
		return this.status[code];
	}

	reset() {
		for (let i = 0; i < this.status.length; i++) {
			this.status[i] = false;
		}
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//create render
let renderer = createRender(config.renderer.width, config.renderer.height, config.debug);
document.body.appendChild(renderer.view);
let stage = new Container();

//create world
let world = new b2World(config.world.gravity, config.world.allowSleep);
if (config.debug) {
	let context = renderer.view.getContext('2d');
	appendDebugRender(world, context, config.world.scale);
}

// create keyboard linsten
let keyboard = new Keyboard();

// load assets
loader.add(getResourcesArray(config.resources)).load(()=> {
	// create edge
	// right
	createEdge(world, stage, 1, 20, config.renderer.height);
	// bottom
	createEdge(world, stage);
	// left
	createEdge(world, stage, 3, 20, config.renderer.height);

	//create plane
	let plane = new Plane(world, stage, resources[config.resources.player].texture, config.world.scale);

	// loop
	update(config.debug, world, config.world.scale, renderer, stage, 30, (deltaTime)=> {
		if(keyboard.keydown(Keyboard.A)){
			plane.update(3,deltaTime);
		}
		if(keyboard.keydown(Keyboard.D)){
			plane.update(1,deltaTime);
		}
		if(keyboard.keydown(Keyboard.W)){
			plane.update(0,deltaTime);
		}
		if(keyboard.keydown(Keyboard.S)){
			plane.update(2,deltaTime);
		}
	});
});









