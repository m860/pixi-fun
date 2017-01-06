/**
 * Created by jean.h.ma on 1/5/17.
 */
require("./index.sass");
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



