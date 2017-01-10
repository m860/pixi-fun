require("./index.sass");

let b2Vec2 = Box2D.Common.Math.b2Vec2;


export default {
	debug: false,
	world: {
		scale: 30.0,
		fps: 30,
		velocityIterations: 10,
		positionIterations: 2,
		gravity: new b2Vec2(0, 10),
		allowSleep: true,
	},
	renderer: {
		width: window.innerWidth,
		height: window.innerHeight
	},
	resources:{
		ball:require("./assets/temp/ball.png"),
		brick:require("./assets/temp/brick.png")
	},
	scenes: {
		home:{
			bodies:[{
				x:0,
				y:0,
				width:100,
				height:100,
				spriteType:PIXI.extras.TilingSprite,
				spriteOptions:['ball',100,100]
			}]
		}
	}
}
