/**
 * Created by jean.h.ma on 1/5/17.
 */
require("./index.sass");

let Engine = Matter.Engine,
	Events = Matter.Events,
	Runner = Matter.Runner,
	Render = Matter.Render,
	Constraint = Matter.Constraint,
	World = Matter.World,
	Body = Matter.Body,
	Bodies = Matter.Bodies,
	Common = Matter.Common,
	Composite = Matter.Composite,
	Composites = Matter.Composites,
	MouseConstraint = Matter.MouseConstraint;

let loader = PIXI.loader,
	autoDetectRenderer = PIXI.autoDetectRenderer,
	resources = PIXI.loader.resources,
	Sprite = PIXI.Sprite,
	Container = PIXI.Container,
	TilingSprite = PIXI.extras.TilingSprite;

class $World {
	constructor(width, height, debug = false) {
		this.engine = Engine.create();
		this.stage = new Container();
		this.debug = debug;
		if (debug) {
			this.renderer = Render.create({
				element:document.body,
				engine:this.engine,
				options:{
					width,
					height
				}
			});
		}
		else {
			this.renderer = autoDetectRenderer(width, height);
			document.body.appendChild(this.renderer.view);
		}
		this.timer = null;
	}

	add(body, sprite) {
		World.add(this.engine.world, [body]);
		if (sprite) {
			body.sprite = sprite;
			this.stage.addChild(sprite);
		}
	}

	update() {
		if (this.debug) {
			Engine.run(this.engine);
			Render.run(this.renderer);
		}
		else {
			Engine.update(this.engine);
			Composite.allBodies(this.engine.world).map((body)=> {
				if (body.sprite) {
					body.sprite.position = body.position;
					body.sprite.rotation = body.angle;
				}
			});
			this.renderer.render(this.stage);
			this.timer = requestAnimationFrame(this.update.bind(this));
		}
	}

	run() {
		this.update();
	}
}

// let world = new $World(375, 600,true);
let world = new $World(375, 600,false);
import brickImage from "./assets/temp/brick.png";
import ballImage from "./assets/temp/ball.png";

loader.add([brickImage, ballImage]).load(()=> {
	let ground = Bodies.rectangle(187.5, 500, 375, 100, {isStatic: true});
	let groundSprite = new TilingSprite(resources[brickImage].texture, 375, 100);
	groundSprite.anchor.set(0.5);
	world.add(ground, groundSprite);

	let ball = Bodies.circle(187.5, 0, 30);
	let ballSprite = new Sprite(resources[ballImage].texture, 187.5, 0);
	ballSprite.anchor.set(0.5);
	world.add(ball, ballSprite);

	world.run();
});

//
// //create engine
// let engine=Engine.create();
//
// //create renderer
// // let renderer=Render.create({
// // 	element:document.body,
// // 	engine
// // });
//
// // demo : render with PIXI
// let ground=Bodies.rectangle(187.5,400,375,100,{
// 	isStatic:true
// });
//
// let ball=Bodies.circle(187.5,0,30);
//
// World.add(engine.world,[ground,ball]);
// // Runner.run(engine);
//
// //create PIXI renderer
// let renderer=PIXI.autoDetectRenderer(375,667);
// //create stage
// let stage=new PIXI.Container();
// //append render view
// document.body.appendChild(renderer.view);
// import brickImage from "./assets/temp/brick.png";
// import ballImage from "./assets/temp/ball.png";
//
//
// let syncData=()=>{
// 	Composite.allBodies(engine.world).map((body)=>{
// 		if(body.sprite){
// 			body.sprite.position=body.position;
// 			body.sprite.rotation=body.angle;
// 		}
// 	});
// 	Engine.update(engine);
// 	renderer.render(stage);
// 	requestAnimationFrame(syncData)
// }
//
// PIXI.loader
// 	.add(ballImage)
// 	.add(brickImage).load(()=>{
// 	let groundSprite=new PIXI.extras.TilingSprite(PIXI.loader.resources[brickImage].texture,300,100);
// 	groundSprite.anchor.set(0.5);
// 	stage.addChild(groundSprite);
// 	ground.sprite=groundSprite;
//
// 	let ballSprite=new PIXI.Sprite(PIXI.loader.resources[ballImage].texture,400,0);
// 	ballSprite.anchor.set(0.5);
// 	stage.addChild(ballSprite);
// 	ball.sprite=ballSprite;
//
// 	syncData();
// });
//


// console.log(renderer)

// Engine.run(engine);
// Runner.run(engine);

// Render.run(renderer);

// let testRunner=Runner.create();
// Events.on(testRunner,'tick',()=>{
// 	console.log('1');
// })
// console.log(testRunner)
// // Runner.run(testRunner);
// Runner.start(testRunner,engine)
/*
 //demo3
 let group = Body.nextGroup(true);

 let bridge = Composites.stack(150, 300, 9, 1, 10, 10, function(x, y) {
 return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
 });

 Composites.chain(bridge, 0.5, 0, -0.5, 0, { stiffness: 0.9 });

 let stack = Composites.stack(200, 40, 6, 3, 0, 0, function(x, y) {
 return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 40));
 });

 World.add(engine.world, [
 bridge,
 Bodies.rectangle(80, 440, 120, 280, { isStatic: true }),
 Bodies.rectangle(720, 440, 120, 280, { isStatic: true }),
 Constraint.create({ pointA: { x: 140, y: 300 }, bodyB: bridge.bodies[0], pointB: { x: -25, y: 0 } }),
 Constraint.create({ pointA: { x: 660, y: 300 }, bodyB: bridge.bodies[8], pointB: { x: 25, y: 0 } }),
 stack
 ]);
 */

/*
 // demo2
 let stack=Composites.stack(0,0,10,10,5,5,(x,y)=>{
 return Bodies.circle(x,y,Common.random(10,15),{
 restitution:0,
 friction:0.1
 });
 });

 let ground=Bodies.rectangle(0,400,400,10,{
 isStatic:true
 });

 World.add(engine.world,[stack,ground]);
 */

/* demo1
 //create box
 let boxA=Bodies.rectangle(0,0,50,50);

 let ground=Bodies.rectangle(0,400,200,20,{
 isStatic:true
 });

 // add box to world
 World.add(engine.world,[boxA,ground]);

 */




/*
 import test from "./assets/temp/test.png";

 class FPS extends PIXI.Text {
 constructor() {
 super(0)
 this.frames = 0;
 this.beginTime = Date.now();
 this.position.set(0,0);
 this.style={
 fontFamily : 'Arial',
 fontSize : '36px',
 fontStyle : 'italic',
 fontWeight : 'bold',
 fill : '#F7EDCA',
 stroke : '#4a1850',
 strokeThickness : 5,
 dropShadow : true,
 dropShadowColor : '#000000',
 dropShadowAngle : Math.PI / 6,
 dropShadowDistance : 6,
 wordWrap : true,
 wordWrapWidth : 440
 };
 }

 record() {
 this.frames++;
 this.text=this.fps;
 }

 get fps() {
 let seconds = (Date.now() - this.beginTime)/1000;
 return Math.floor(this.frames / seconds);
 }
 }

 let stage = new PIXI.Container(),
 cat,
 fps=new FPS(),
 renderer = PIXI.autoDetectRenderer(375, 667);
 document.body.appendChild(renderer.view);

 let update = ()=> {
 //Render the stage
 cat.tilePosition.x -= 0.2;
 fps.record();
 renderer.render(stage);
 requestAnimationFrame(update);
 };

 //Use Pixi's built-in `loader` object to load an image
 PIXI.loader
 .add(test)
 .load(()=> {
 //Create the `cat` sprite from the texture
 // cat = new PIXI.Sprite(
 // 	PIXI.loader.resources[test].texture
 // );
 cat = new PIXI.extras.TilingSprite(PIXI.loader.resources[test].texture, 375, 667)

 //Add the cat to the stage
 stage.addChild(cat);
 stage.addChild(fps);

 update();
 });
 */


