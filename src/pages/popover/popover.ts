import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {
   items: any;
   userData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController, public authService: AuthService) {
    this.items = this.navParams.get('listData');
    console.log(this.items);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  //clear notification
  clearnotification(notification_id: string){
    this.userData = {};
    this.authService.getData('markread/'+notification_id).then((result) => {
        alert('Notification Read Successfully');

    }, (err) => {

    });
  }


  dismiss(item: any) {
    const data = item;
    this.viewCtrl.dismiss(data);
  }

}
