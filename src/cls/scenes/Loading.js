/**
 * Created by jean.h.ma on 1/15/17.
 */
import Scene from '../Scene'
import {getValues} from '../tools/utility'

export const ASSETS={
	background:require('../../assets/background.png')
	,backgroundNotice:require('../../assets/background-notice.png')
}
export default class Loading extends Scene{
	constructor(onLoaded:Function,conf){
		super(conf);
		this.progress=0;
		this.onLoaded=onLoaded;
	}
	load(){
		PIXI.loader
			.add(getValues(ASSETS))
			.on('progress',event=>{
				this.progress=event.progress;
				//update sprite
			})
			.load((loader,resources)=>{
				this.pause=true;
				this.onLoaded();
			});
		this.update();
	}
}