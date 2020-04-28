export class Product {
	name:string=null;
	description:string=null;
	furniture_style:string[]=null;
	delivery_time:string=null;
	price:number=0;
}
export class Dropdown {
	furniture_name:string=null;
	furniture_id:number=0;
}

export class Response {
	furniture_styles:Dropdown[] = new Array(new Dropdown());
	products:Product[] = new Array(new Product());
}