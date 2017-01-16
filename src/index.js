require('./index.sass')
import World from './cls/World.js'
import LoadingScene from './cls/scenes/LoadingScene.js'
import MainScene from './cls/scenes/MainScene.js'

let world = new World();


let mainScene = new MainScene();
let loadingScene = new LoadingScene(()=> {
	console.log('assets is ready');
	setTimeout(()=>{
		// load main scene
		world.push(mainScene);
	},5*1000);

});
world.push(loadingScene);


/*
 let testBodyScene = new Scene({
 onInit: (scene)=> {
 PIXI.loader
 .add(getValues(assets))
 .on('progress', (event)=> {
 console.log(event.progress);
 })
 .load((loader, resources)=> {
 console.log('assets is ready')
 })
 },
 onUpdate: (scene)=> {
 }
 });

 let progressBodyDef = new Box2D.Dynamics.b2BodyDef();
 progressBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
 progressBodyDef.position.Set(world.getWorldValue(world.width / 2), world.getWorldValue(world.height / 2));
 let progressFixtureDef = new Box2D.Dynamics.b2FixtureDef();
 progressFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
 progressFixtureDef.shape.SetAsBox(world.getWorldValue(200), world.getWorldValue(30));
 testBodyScene.addBody('progress', progressBodyDef, [progressFixtureDef]);


 world.push(testBodyScene);
 */



