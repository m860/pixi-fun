require('./index.sass')
import World from './cls/World.js'
import Loading from './cls/scenes/Loading.js'
import Main from './cls/Scenes/Main.js'

let world = new World();


let mainScene = new Main();
let loadingScene = new Loading(()=> {
	console.log('assets is ready');
	// load main scene
	world.push(mainScene);
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



