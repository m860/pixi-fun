/**
 * Created by jean.h.ma on 1/16/17.
 */
import Scene from '../Scene.js'
import {ASSETS} from '../scenes/LoadingScene'
import Keyboard from '../Keyboard';

const Sprite = PIXI.Sprite,
	b2BodyDef = Box2D.Dynamics.b2BodyDef,
	b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
	b2Body=Box2D.Dynamics.b2Body,
	b2Vec2=Box2D.Common.Math.b2Vec2,
	b2PolygonShape=Box2D.Collision.Shapes.b2PolygonShape;

export default class Main extends Scene {
	constructor(conf){
		super(conf);
		this.keyboardListener=new Keyboard();
	}
	clear(callback){
		super.clear(()=>{
			this.keyboardListener.clear();
			callback();
		});
	}
	initScene(resources) {
		let planeTexture=resources[ASSETS.plane].texture;

		// //test
		// let progressBodyDef = new b2BodyDef();
		// progressBodyDef.type = b2Body.b2_staticBody;
		// progressBodyDef.position.Set(this.world.getWorldValue(this.world.width / 2), this.world.getWorldValue(this.world.height / 2));
		// // progressBodyDef.position.Set(0,0);
		// let progressFixtureDef = new b2FixtureDef();
		// progressFixtureDef.shape = new b2PolygonShape();
		// progressFixtureDef.shape.SetAsBox(this.world.getWorldValue(200), this.world.getWorldValue(30));
		// this.addBody('progress', progressBodyDef, [progressFixtureDef]);

		// create background
		let backgroundSprite = new Sprite(resources[ASSETS.background].texture);
		this.addSprite(ASSETS.background, backgroundSprite);

		// create plane body
		let planeBodyDef = new b2BodyDef();
		planeBodyDef.type=b2Body.b2_dynamicBody;
		planeBodyDef.position.Set(0,0);
		// planeBodyDef.position.Set(new b2Vec2(this.world.getWorldValue(this.world.width/2),this.world.getWorldValue(this.world.height/2)));
		let planeFixtureDef=new b2FixtureDef();
		planeFixtureDef.shape=new b2PolygonShape();
		planeFixtureDef.shape.SetAsBox(this.world.getWorldValue(planeTexture.width/2),this.world.getWorldValue(planeTexture.height/2));
		this.addBody('plane',planeBodyDef,[planeFixtureDef]);

		// create plane sprite
		let planeSprite=new Sprite(planeTexture);
		planeSprite.anchor.set(0.5)
		this.addSprite(ASSETS.plane,planeSprite,'plane');
	}
}