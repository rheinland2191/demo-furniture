import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'custom'
})
export class CustomPipe implements PipeTransform {

	transform(items: any, a: string, b: string, c: string){
		if (items && items.length){
		    return items.filter(item =>{
		    	console.log(item)
		        if (a&& item.name.toLowerCase().indexOf(a.toLowerCase()) === -1){
		            return false;
		        }
		        if (b && item.furniture_styles.toLowerCase().indexOf(b.toLowerCase()) === -1){
		            return false;
		        }
		        if (c&& item.delivery_time.toLowerCase().indexOf(c.toLowerCase()) === -1){
		            return false;
		        }
		        return true;
		   })
		}
		else{
		    return items;
		}
	}

}
