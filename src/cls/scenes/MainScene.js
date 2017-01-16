/**
 * Created by jean.h.ma on 1/16/17.
 */
import Scene from '../Scene.js'
import {ASSETS} from './LoadingScene.js'
let res = PIXI.loader.resources
	,Text=PIXI.Text
	, Sprite = PIXI.Sprite;
export default class Main extends Scene {
	constructor(conf) {
		super(conf);
		// add background
		// let backgroundSprite = new Sprite(res[ASSETS.background]);
		// this.addSprite(ASSETS.background, backgroundSprite);
		let textSprite=new Text('Main Scene',{
			stroke:'white'
			,fill:'white'
		})
		this.addSprite('title',textSprite);
	}
}