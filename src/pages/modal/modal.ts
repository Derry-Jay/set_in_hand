import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ViewController,LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import {DeliveryPage} from '../delivery/delivery';
//import { DeliveryPage } from '../delivery/delivery';

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage { 
 responseData = <any>{}; 
loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Adding Data ,Please Wait...<p></div>'  
  }); 
  
  Data = {"created_by":localStorage.getItem("userId"),"delivery_Id":localStorage.getItem("deliveryidd"),"stockcode":"","box":"","qty_per_box":"","action":""};
  constructor(public appCtrl:App,public viewCtrl : ViewController, public navCtrl: NavController, public navParams: NavParams, public authService : AuthService,  private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    //console.log(this.Data);
    console.log("nabparams",this.navParams.get('data'));
    if(this.navParams.get('data').stockcode != undefined){
      this.Data.stockcode = this.navParams.get('data').stockcode;
      this.Data.box = this.navParams.get('data').boxes;
      this.Data.qty_per_box = this.navParams.get('data').qtyperbox;
      //this.Data.delivery_Id = this.navParams.get('data').deliveryid;
    }
    if(this.navParams.get('data').stockcode != undefined && this.navParams.get('data').stockcode != ""){
      this.Data.action = "edit";
    }else{
      this.Data.action = "add";
    }
    console.log(this.Data);
  }

  public closeModal(){
  		this.viewCtrl.dismiss();
  }

 public ValidateNo(ev)
{
this.Data.box = ev.target.value.replace(/\D/g,'');
// if(this.Data.action == "edit"){
//   if(this.Data.box > this.navParams.get('data').boxes){

//   }
// }
console.log(this.Data.box);
}

 public QtyValidateNo(qty)
{
this.Data.qty_per_box = qty.target.value.replace(/\D/g,'');
}
isReadonly() {
  if(this.Data.action =="edit"){
    return this.isReadonly;
  }
     //return true/false 
}

  public adddiscrepancy(){
   let data = { 'foo': 'bar' }; 
    this.loading.present();
    console.log(this.Data.action);
	  if(this.Data.stockcode != '' && this.Data.box != '' && this.Data.qty_per_box != ''){
      if(this.Data.action == "edit"){
        if(parseInt(this.Data.box) > parseInt(this.navParams.get('data').boxes)){
          alert("Number of boxes is greater than Boxes in Stock");
          this.loading.dismiss();
          return false;
        }
      }else{
        if(this.Data.box < "1"){
          alert("Number of boxes cannot be 0");
          this.loading.dismiss();
          return false;
        }
      } 
        this.authService.postData(this.Data,'updatebox').then((result) => {
        this.loading.dismissAll();
        this.viewCtrl.dismiss(data);
		    this.responseData = result;
          if(this.responseData.success){
            if(this.Data.action == "edit"){
              alert('Discrepancy Updated Successfully');
            }else{
              alert('Discrepancy Added Successfully');
            }
        }
        else{
 
          alert(this.responseData.message);
        }
		  }, (err) => {
		});
	}
	else{
         
		 alert("Please fill all fields");
         this.loading.dismiss();
	}
  }
}
