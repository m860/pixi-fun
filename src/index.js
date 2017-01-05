/**
 * Created by jean.h.ma on 1/5/17.
 */
require("./index.sass");
import test from "./assets/temp/test.png";

let stage = new PIXI.Container(),
	renderer = PIXI.autoDetectRenderer(375, 667);
document.body.appendChild(renderer.view);

//Use Pixi's built-in `loader` object to load an image
PIXI.loader
	.add(test)
	.load(()=>{
		//Create the `cat` sprite from the texture
		let cat = new PIXI.Sprite(
			PIXI.loader.resources[test].texture
		);

		//Add the cat to the stage
		stage.addChild(cat);

		//Render the stage
		renderer.render(stage);
	});

