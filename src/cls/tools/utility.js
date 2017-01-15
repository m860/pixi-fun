/**
 * Created by jean.h.ma on 1/15/17.
 */
export function getValues(keyvalue:Object){
	let arr=[];
	for(let key in keyvalue){
		arr.push(keyvalue[key]);
	}
	return arr;
}