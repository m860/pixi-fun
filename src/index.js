require('./index.sass')
import World from './cls/World.js'
import Scene from './cls/Scene'
import LoadingScene, {ASSETS} from './cls/scenes/LoadingScene.js'
import MainScene from './cls/scenes/MainScene.js'

let world = new World();

let loadingScene = new LoadingScene((loader, resources)=> {
	let mainScene = new MainScene({
		onBeforePush:(self)=>{
			self.initScene(resources);
		}
	});
	world.push(mainScene);

});
world.push(loadingScene);


// let testBodyScene = new Scene();
//
// let progressBodyDef = new Box2D.Dynamics.b2BodyDef();
// progressBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
// progressBodyDef.position.Set(world.getWorldValue(world.width / 2), world.getWorldValue(world.height / 2));
// let progressFixtureDef = new Box2D.Dynamics.b2FixtureDef();
// progressFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
// progressFixtureDef.shape.SetAsBox(world.getWorldValue(200), world.getWorldValue(30));
// testBodyScene.addBody('progress', progressBodyDef, [progressFixtureDef]);
//
//
// world.push(testBodyScene);




