import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
/**
 * Generated class for the CompletedpagemodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-completedpagemodal',
  templateUrl: 'completedpagemodal.html',
})
export class CompletedpagemodalPage {
  responseData = <any>{};
  Data = {delivery_id:localStorage.getItem('delivery_id'),created_by:localStorage.getItem('userId')};
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public authService: AuthService, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompletedpagemodalPage');
  }

  //calls when delivery need to complete
  public deliverycomplete(){
    //this.viewCtrl.dismiss();
    this.loading.present();
    console.log(this.Data);
    this.authService.postData({delivery_id:localStorage.getItem('delivery_id'),created_by:localStorage.getItem('userId')},'deliverycomplete').then((result) => {
      this.loading.dismiss();
      this.responseData = result;
      alert(this.responseData.Data);
      const elems = document.querySelectorAll('.deliverystockitem');
      [].forEach.call(elems, function(el) {
        el.classList.remove('codescanned');
        el.classList.remove('deliverystockitem');
      });
      this.viewCtrl.dismiss();


    }, (err) => {

    });
  }

  //no need to complete delivery
  public closeModal(){
  		this.viewCtrl.dismiss();
  }

}
