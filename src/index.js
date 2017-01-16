import World from './cls/World'
import Scene from './cls/Scene'

let world=new World();

let loadingScene=new Scene({
    onInit:(scene)=>{

    },
    onUpdate:(scene)=>{}
});
let progressBodyDef=new Box2D.Dynamics.b2BodyDef();
progressBodyDef.type=Box2D.Dynamics.b2Body.b2_staticBody;
progressBodyDef.position.Set(world.getWorldValue(world.width/2),world.getWorldValue(world.height/2));
let progressFixtureDef=new Box2D.Dynamics.b2Fixture();
progressFixtureDef.shape=new Box2D.Collision.Shapes.b2PolygonShape();
progressFixtureDef.shape.SetAsBox(world.getWorldValue(200),world.getWorldValue(30));
loadingScene.addBody(progressBodyDef,[progressFixtureDef]);

