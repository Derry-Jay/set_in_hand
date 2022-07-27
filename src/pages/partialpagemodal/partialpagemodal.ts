import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the PartialpagemodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-partialpagemodal',
  templateUrl: 'partialpagemodal.html',
})
export class PartialpagemodalPage {
  responseData = <any>{};
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Adding Data ,Please Wait...<p></div>'
  });
  Data = {created_by:localStorage.getItem('userId'),delivery_Id:localStorage.getItem('delivery_id'),stock_code:'',box:'',qty_per_box:''};
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public authService: AuthService, public loadingCtrl: LoadingController) {


  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PartialpagemodalPage');
  }

  //open model
  public openModal(){
    const ParitalPage = <HTMLElement>document.getElementById('ParitalPage');
    ParitalPage.style.display = 'none';
    const ModalForm = <HTMLElement>document.getElementById('ModalForm');
    ModalForm.style.display = 'block';
  }

   public ValidateNo(ev: { target: { value: string } })
  {
    this.Data.box = ev.target.value.replace(/\D/g,'');
  }

 public QtyValidateNo(qty: { target: { value: string } })
{
   this.Data.qty_per_box = qty.target.value.replace(/\D/g,'');
}

//add descrepancy
  public adddiscrepancymodal(){
   let data = { foo: 'bar' };
    this.loading.present();
    console.log(this.Data.stock_code);
    //this.Data.delivery_Id =  this.navParams.get("message");
    if(this.Data.stock_code != '' && this.Data.box != '' && this.Data.qty_per_box != ''){
        this.viewCtrl.dismiss(data);
        this.authService.postData(this.Data,'deliverydiscrepancy').then((result) => {
        this.loading.dismissAll();
        this.responseData = result;
        alert('Discrepancy Added Successfully');
        }, (err) => {
        });
    }
    else{

         alert('Please fill all fields');
         this.loading.dismiss();
    }
  }

  public closeModal(){
  	this.viewCtrl.dismiss();
  }

}
