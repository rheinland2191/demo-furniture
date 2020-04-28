import { Component, OnInit, ViewChild, Renderer2 , ChangeDetectorRef,AfterViewInit} from '@angular/core';
import { AppService } from './service/app.service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NgbModalConfig, NgbModal]
})
export class AppComponent implements OnInit,AfterViewInit{
title = 'furniture-frontend';

constructor(private api: AppService,private config: NgbModalConfig
	, private modalService: NgbModal,private fb: FormBuilder, private cdRef : ChangeDetectorRef){
}
	display=[];
	response:any;
  	term="";
	dropdownListFurniture = [];
    selectedItemsFurniture = [];
    dropdownSettingsFurniture = {};
	dropdownListDelivery = [];
    selectedItemsDelivery = [];
    dropdownSettingsDelivery = {};

	// selectedItems = [];
	ngOnInit() {
		this.getData();
        this.dropdownSettingsFurniture = 
        { 
	      singleSelection: false, 
	      text:"Select Furniture Style",
	      enableSearchFilter: true,
	      classes:"myclass custom-class"
	    }; 
        this.dropdownSettingsDelivery = 
        { 
          singleSelection: false, 
          text:"Select Delivery Time",
          enableSearchFilter: true,
          classes:"myclass custom-class"
        };   
        this.dropdownListDelivery = 
        [
         {id:1,itemName:"1 Week"},
		 {id:2,itemName:"2 Week"},
		 {id:3,itemName:"4 Week"},
		 {id:4,itemName:"More"},
		];
	}
	ngAfterViewInit() {
		this.cdRef.detectChanges();
	}

	getData(){
		this.api.getData().subscribe((response) => {
		this.response = response.body;
		for (const [i, value] of this.response.furniture_styles.entries()) {
		    let data = {id:0,itemName:""};
		    data.id = i;
		    data.itemName = value;
		    this.dropdownListFurniture.push(data);
			}

		for (const [i, value] of this.response.products.entries()) {
		    
		    this.display.push(value);
			}
		});
	}
 
    filter(event,selectedFurniture,selectedDelivery){
    	if(selectedFurniture.length === 0 && selectedDelivery.length === 0){
    		this.display=[];
    		if(event !== ''){
	    		for(const [i,value] of this.response.products.entries()){
	    			if(value.name.toLowerCase().includes(event)){
	    				this.display.push(value)
	    			}
	    		};
    		}else{
    			for(const [i,value] of this.response.products.entries()){
	    			this.display.push(value)
	    		};
    		}
    		
    	}else if(selectedFurniture.length !== 0 && selectedDelivery === 0){

    		this.display=[];
	    		for(let i=0;i<this.response.products.length;i++){
	    			let checkPush = false;
	    			if(event !== ''){
		    			if(this.response.products[i].name.toLowerCase().includes(event)){
		    				checkPush = true;
							this.display.push(this.response.products[i]);
		    			}
		    		}
    				let furniture =[];
    				for(let j=0;j<selectedFurniture.length;j++){
    					if(this.response.products[i].furniture_style.includes(selectedFurniture[j].itemName)){
    						if(!checkPush){
    							this.display.push(this.response.products[i])
    						}
		    				
    					}
    				}	    				
    			}
    	}else if(selectedFurniture.length === 0 && selectedDelivery !== 0){

    		this.display=[];
	    		for(let i=0;i<this.response.products.length;i++){
	    			let checkPush = false;
	    			if(event !== ''){
		    			if(this.response.products[i].name.toLowerCase().includes(event)){
		    				checkPush = true;
							this.display.push(this.response.products[i]);
		    			}
		    		}
    				let one_week = selectedDelivery.map(e => e.itemName).includes("1 Week");
    				let two_week = selectedDelivery.map(e => e.itemName).includes("2 Week");
    				let four_week = selectedDelivery.map(e => e.itemName).includes("4 Week");
    				let more = selectedDelivery.map(e => e.itemName).includes("More");	
    				this.pushFunction(more,four_week,two_week,one_week,checkPush,this.response.products[i],i);				
    			}
    	}
    	else{
    		this.display=[];
	    		for(let i=0;i<this.response.products.length;i++){
	    			let checkPush = false;
	    			if(event !== ''){
		    			if(this.response.products[i].name.toLowerCase().includes(event)){
		    				checkPush = true;
							this.display.push(this.response.products[i]);
		    			}
		    		}
    				let furniture =[];
					let one_week = selectedDelivery.map(e => e.itemName).includes("1 Week");
    				let two_week = selectedDelivery.map(e => e.itemName).includes("2 Week");
    				let four_week = selectedDelivery.map(e => e.itemName).includes("4 Week");
    				let more = selectedDelivery.map(e => e.itemName).includes("More");
    				for(let j=0;j<selectedFurniture.length;j++){
    					if(this.response.products[i].furniture_style.includes(selectedFurniture[j].itemName)){
    						this.pushFunction(more,four_week,two_week,one_week,checkPush,this.response.products[i],i);	
    					}
    				}	    				
    			}
    		}
    	
    }
    pushFunction(more:Boolean,four_week:Boolean,two_week:Boolean,one_week:Boolean,checkPush:Boolean,items:any,index:number){
		if(more && !four_week && !two_week && !one_week){
			if(parseInt(items.delivery_time)>28){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(more && four_week && !two_week && !one_week){
			if(parseInt(items.delivery_time)>28 || parseInt(items.delivery_time) <= 28){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(more && !four_week && two_week && !one_week){
			if(parseInt(items.delivery_time)>28 || parseInt(items.delivery_time) <= 14){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(more && !four_week && !two_week && one_week){
			if(parseInt(items.delivery_time)>28 || parseInt(items.delivery_time) <= 7){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(!more && four_week && !two_week && !one_week){
			if(parseInt(items.delivery_time)<=28){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(!more && four_week && two_week && !one_week){
			if(parseInt(items.delivery_time)<=28 || parseInt(items.delivery_time) <=14){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(!more && four_week && !two_week && one_week){
			if(parseInt(items.delivery_time)<=28 || parseInt(items.delivery_time) <=7){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(!more && !four_week && two_week && !one_week){
			if(parseInt(items.delivery_time)<=14){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(!more && !four_week && two_week && one_week){
			if(parseInt(items.delivery_time)<=14 || parseInt(items.delivery_time) <= 7){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else if(!more && !four_week && !two_week && one_week){
			if(parseInt(items.delivery_time)<=7){
				if(!checkPush){
					this.display.push(this.response.products[index]);
				}
			}
		}else{
			if(!checkPush){
				this.display.push(this.response.products[index])
			}
		}
    }
} 
