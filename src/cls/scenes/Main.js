/**
 * Created by jean.h.ma on 1/16/17.
 */
import Scene from '../Scene.js'
import {ASSETS} from './Loading.js'
let res = PIXI.loader.resources
	, Sprite = PIXI.Sprite;
export default class Main extends Scene {
	constructor(conf) {
		super(conf);
		// add background
		let backgroundSprite = new Sprite(res[ASSETS.background]);
		this.addSprite(ASSETS.background, backgroundSprite);
	}
}