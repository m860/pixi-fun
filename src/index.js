/**
 * Created by jean.h.ma on 1/5/17.
 */
require("./index.sass");
import ballImage from './assets/temp/ball.png';
import brickImage from './assets/temp/brick.png';
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// box2d short name
let b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2ContactFilter = Box2D.Dynamics.b2ContactFilter,
	b2ContactListener = Box2D.Dynamics.b2ContactListener,
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
//config
let config = {
	debug: true,
	world: {
		gravity: new b2Vec2(0, 0),
		allowSleeping: true,
		scale: 30.0,
		positionIterations: 8,
		velocityIterations: 10,
		fps: 30.0
	},
	renderer: {
		width: window.innerWidth,
		height: window.innerHeight
	}
}
const EDGE = 0x000001;
const PLAYER = 0x000010;
const BULLET = 0x000100;
const OTHER = 0x001000;
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
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit /*| b2DebugDraw.e_centerOfMassBit*/);
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

let update = (debug, world, scale = 30.0, renderer, stage, fps = 60.0, onPreStep = ()=> {
}, onRender = ()=> {
}, lastUpdateTime = Date.now())=> {
	onPreStep(Date.now() - lastUpdateTime);
	lastUpdateTime = Date.now();
	world.Step(1 / fps, config.world.velocityIterations, config.world.positionIterations);
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
	onRender();
	return requestAnimationFrame(()=> {
		update(debug, world, scale, renderer, stage, fps, onPreStep, onRender, lastUpdateTime);
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
let createEdge = (world, stage, position = 0)=> {
	let x, y, width, height;
	switch (position) {
		case 1:
			width = 20.0;
			height = config.renderer.height;
			x = config.renderer.width + width / 2;
			y = height / 2;
			break;
		case 2:
			width = config.renderer.width;
			height = 20;
			x = width / 2;
			y = config.renderer.height + height / 2;
			break;
		case 3:
			width = 20.0;
			height = config.renderer.height;
			x = -width / 2;
			y = height / 2;
			break;
		default:
			width = config.renderer.width;
			height = 20.0;
			x = width / 2;
			y = -height / 2;
	}
	let bodyDef = new b2BodyDef();
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.Set(getRV(x, config.world.scale), getRV(y, config.world.scale));
	bodyDef.userData = {
		type: EDGE
	};
	let fixtureDef = new b2FixtureDef();
	fixtureDef.density = 1.0;
	fixtureDef.friction = 0.8;
	fixtureDef.restitution = 0.0;
	fixtureDef.shape = new b2PolygonShape();
	fixtureDef.shape.SetAsBox(getRV(width / 2, config.world.scale), getRV(height / 2, config.world.scale));
	fixtureDef.userData = {
		type: EDGE
	};
	let body = world.CreateBody(bodyDef);
	body.CreateFixture(fixtureDef);
	return body;
};
let removeDead = (world, deads = [])=> {
	let body = deads.pop();
	while (body) {
		world.DestroyBody(body);
		body = deads.pop();
	}
};
let getBodyByType=(type,bodies)=>{
	return bodies.find(body=>{
		let ud=body.GetUserData();
		return type===ud.type;
	});
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
class Player {
	constructor(world) {
		let x = config.renderer.width / 2,
			y = config.renderer.height - 100,
			radius = 25;
		let bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.position.Set(getRV(x, config.world.scale), getRV(y, config.world.scale));
		bodyDef.userData = {
			type: PLAYER
		};
		let fixtureDef = new b2FixtureDef();
		fixtureDef.density = 1.0;
		fixtureDef.friction = 0.0;
		fixtureDef.restitution = 0.0;
		fixtureDef.shape = new b2CircleShape(getRV(radius, config.world.scale));
		fixtureDef.userData = {
			type: PLAYER
		};
		let body = world.CreateBody(bodyDef);
		body.SetSleepingAllowed(false);
		// body.SetAngle(Math.PI/2);
		body.CreateFixture(fixtureDef);

		this.world = world;
		this.body = body;
		this.angleVelcoityValue = 0.0005;
		this.forceValue = 0.5;

		this.bulletBodyDef = new b2BodyDef();
		this.bulletBodyDef.type = b2Body.b2_dynamicBody;
		this.bulletBodyDef.bullet = true;
		this.bulletBodyDef.fixedRotation = true;
		this.bulletBodyDef.userData = {
			type: BULLET
		};
		// this.bulletBodyDef.linearVelocity=new b2Vec2()
		this.bulletFixtureDef = new b2FixtureDef();
		this.bulletFixtureDef.density = 1.0;
		this.bulletFixtureDef.friction = 0;
		this.bulletFixtureDef.restitution = 0;
		this.bulletFixtureDef.shape = new b2CircleShape(getRV(2));
		this.bulletFixtureDef.userData = {
			type: BULLET
		};
		// this.bulletFixtureDef.shape.SetAsBox(getRV(0.1,config.world.scale),getRV(5,config.world.scale));
		this.fireDuration = 100;
		this.lastFireTime = Date.now();
	}

	turn(deltaTime, clockwise = true) {
		let angle = this.body.GetAngle();
		if (!clockwise) {
			angle -= deltaTime * this.angleVelcoityValue;
		}
		else {
			angle += deltaTime * this.angleVelcoityValue;
		}
		this.body.SetAngle(angle);
	}

	getFacing() {
		return this.body.GetWorldVector(new b2Vec2(0, -1)).Copy();
	}

	getWorldFacing() {
		let v = this.body.GetWorldPoint(new b2Vec2(0, -1)).Copy();
		v.Multiply(config.world.scale);
		return v;
	}

	move(deltaTime, reverse = false) {
		let force = this.getFacing();
		if (reverse) {
			force.Multiply(this.forceValue * deltaTime * -1);
		}
		else {
			force.Multiply(this.forceValue * deltaTime);
		}
		this.body.ApplyForce(force, this.body.GetWorldCenter());
	}

	getCenter() {
		let pos = this.body.GetPosition().Copy();
		pos.Multiply(config.world.scale);
		return pos;
	}

	drawFacing(context) {
		let center = this.getCenter();
		let facingPoint = this.getWorldFacing()
		// context.beginPath();
		// context.arc(center.x,center.y,5,0,Math.PI*2);
		// context.stroke();
		// context.beginPath();
		// context.arc(facingPoint.x,facingPoint.y,5,0,Math.PI*2);
		// context.stroke();
		context.beginPath();
		context.moveTo(center.x, center.y);
		context.lineTo(facingPoint.x, facingPoint.y);
		context.stroke();
	}

	fire(deltaTime) {
		let escape = Date.now() - this.lastFireTime;
		if (escape >= this.fireDuration) {
			let bullet = this.world.CreateBody(this.bulletBodyDef);
			bullet.CreateFixture(this.bulletFixtureDef);
			let pos = this.getWorldFacing();
			pos.Multiply(1 / config.world.scale);
			bullet.SetPosition(pos);
			let velocity = this.getFacing();
			velocity.Multiply(deltaTime * 1);
			bullet.SetLinearVelocity(velocity);
			this.lastFireTime = Date.now();
		}
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//create render
let renderer = createRender(config.renderer.width, config.renderer.height, config.debug);
let context = renderer.view.getContext('2d');
document.body.appendChild(renderer.view);
let stage = new Container();

let world = new b2World(config.world.gravity, config.world.allowSleeping);
if (config.debug) {
	appendDebugRender(world, context, config.world.scale);
}
let keyboard = new Keyboard();

let dead = [];

// filter
let contactFilter = new b2ContactFilter();
contactFilter.ShouldCollide = (a, b)=> {
	let ua = a.GetUserData();
	let ub = b.GetUserData();
	let r = ua.type | ub.type;
	switch (r) {
		case BULLET:
		case BULLET | PLAYER:
			return false;
		default:
			return true;
	}
};
world.SetContactFilter(contactFilter);

// contact listener
let contactListener = new b2ContactListener();
contactListener.BeginContact = (contact)=> {
	let fa = contact.GetFixtureA();
	let fb = contact.GetFixtureB();
	let ua = fa.GetUserData();
	let ub = fb.GetUserData();
	let r = ua.type | ub.type;
	switch (r) {
		case BULLET|EDGE:
			dead.push(getBodyByType(BULLET,[fa.GetBody(),fb.GetBody()]));
			break;
	}
};
world.SetContactListener(contactListener);

loader.add([brickImage, ballImage]).load(()=> {
	createEdge(world, stage, 0);
	createEdge(world, stage, 1);
	createEdge(world, stage, 2);
	createEdge(world, stage, 3);

	let player = new Player(world);

	// loop
	update(config.debug, world, config.world.scale, renderer, stage, config.world.fps, (deltaTime)=> {
		removeDead(world, dead);
		world.ClearForces();
		if (keyboard.keydown(Keyboard.A)) {
			player.turn(deltaTime, false);
		}
		if (keyboard.keydown(Keyboard.D)) {
			player.turn(deltaTime, true);
		}
		if (keyboard.keydown(Keyboard.W)) {
			player.move(deltaTime, false);
		}
		if (keyboard.keydown(Keyboard.S)) {
			player.move(deltaTime, true);
		}
		if (keyboard.keydown(Keyboard.J)) {
			player.fire(deltaTime);
		}

	}, ()=> {
		player.drawFacing(context);
	});
});








