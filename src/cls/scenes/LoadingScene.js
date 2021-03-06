/**
 * Created by jean.h.ma on 1/15/17.
 */
import Scene from '../Scene'
import {getValues} from '../tools/utility'

export const ASSETS = {
	background: require('../../assets/background.png')
	, backgroundNotice: require('../../assets/background-notice.png')
	, balloon1: require('../../assets/balloon-1.png')
	, balloon2: require('../../assets/balloon-2.png')
	, navigationbar: require('../../assets/navigatinbar.png')
	, plane: require('../../assets/plane.png')
	, title: require('../../assets/title.png')
	, xiaolu: require('../../assets/xiaolu.png')
}
export default class LoadingScene extends Scene {
	constructor(onLoaded: Function, conf) {
		super(conf);
		this.onLoaded = onLoaded;
		let textStyle = {
			fontFamily: 'Arial',
			fontSize: '36px',
			fontStyle: 'italic',
			fontWeight: 'bold',
			fill: '#F7EDCA',
			stroke: '#4a1850',
			strokeThickness: 5,
			dropShadow: true,
			dropShadowColor: '#000000',
			dropShadowAngle: Math.PI / 6,
			dropShadowDistance: 6,
			wordWrap: true,
			wordWrapWidth: 440
		};
		let textSprite = new PIXI.Text('00', textStyle);
		this.addSprite('progressValue', textSprite);
	}

	start() {
		super.start();
		console.log('begin loading ...')
		PIXI.loader
			.add(getValues(ASSETS))
			.on('progress', event=> {
				//update sprite
				// this.sprites['progressValue'].sprite.setText(event.progress);
				this.sprites['progressValue'].sprite.text = event.progress;
			})
			.load((loader, resources)=> {
				this.sprites['progressValue'].sprite.text = 100;
				setTimeout(()=>{
					this.onLoaded(loader, resources);
				},1000);
			});
	}
}