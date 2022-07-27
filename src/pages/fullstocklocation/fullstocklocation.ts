import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { FullstockitemPage } from '../fullstockitem/fullstockitem';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { QRScannerStatus } from '@ionic-native/qr-scanner';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';
/**
 * Generated class for the FullstocklocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-page-fullstocklocation',
  templateUrl: 'fullstocklocation.html',
})
export class FullstocklocationPage {
  parameter1: any;
  customer_name: any;
  date_started: any;
  qrData = null;
  scannedCode = null;
  userData = {};
  items = [];
  disitems = [];
  messagecount: any;
  channel: any;
  allUsers = [];
  toUser: { toUserId: string; toUserName: string };
  responseData = <any>{};
  classname = 'pending';
  myVar: any;

  HighArr = [];
  LowArr = [];
  profilepicture: any;
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public chatService: ChatServiceProvider, public loadingCtrl: LoadingController, public events: Events, public navParams: NavParams, public authService: AuthService, private qrScanner: QRScanner) {
    this.profilepicture = localStorage.getItem('profilepicture');
    setInterval(() => {
      this.authService.getData('getUnreadMessagesCount/' + localStorage.getItem('userId')).then((result) => {
        this.responseData = result;
        this.messagecount = this.responseData.messagesCount;
        this.events.publish('msgCount', this.responseData.messagesCount);
        document.getElementById('user_msg_count').innerHTML = this.responseData.messagesCount;
      });
    }, 3000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullstocklocationPage');
    this.loadData();
  }

  //logout of app
  logout() {
    this.qrScanner.hide();
    this.authService.postData({ user_id: localStorage.getItem('userId') }, 'logout').then((result) => {

    });
    localStorage.clear();
    clearInterval(this.myVar);
    this.loading.present();

    this.navCtrl.setRoot(LoginPage).then(() => {
      this.loading.dismiss();
    });
  }

  //loads pallet locations and customer details
  loadData() {
    this.parameter1 = this.navParams.get('param1');
    this.authService.getData('getFullStockItems/' + this.parameter1).then((result) => {
      this.responseData = result;
      for (let i = 0; i < parseInt(this.responseData.palletLocations.highValues.length, 10); i++) {
        this.HighArr.push(this.responseData.palletLocations.highValues[i]);
      }
      for (let j = 0; j < parseInt(this.responseData.palletLocations.lowValues.length, 10); j++) {
        this.LowArr.push(this.responseData.palletLocations.lowValues[j]);
      }

      if (this.responseData.palletLocations.lowValues.length > 0) {
        this.customer_name = this.responseData.palletLocations.lowValues[0].customer_name;
        this.date_started = this.responseData.palletLocations.lowValues[0].date_started;
      }
      else if (this.responseData.palletLocations.highValues > 0) {
        this.customer_name = this.responseData.palletLocations.highValues[0].customer_name;
        this.date_started = this.responseData.palletLocations.highValues[0].date_started;
      }

      console.log(this.LowArr);
    }, (err) => {

    });
  }

  //hides camera
  hidecamera() {
    this.qrScanner.hide();
    const canclBtn = <HTMLElement>document.getElementById('qr_cancel_btn');
    canclBtn.style.display = 'none';
  }


  //back to home
  calhome() {
    this.qrScanner.hide();
    this.loading.present();
    clearInterval(this.myVar);
    this.navCtrl.push(DashboardPage).then(() => {
      this.loading.dismiss();
    });
  }

  //back to previous page
  gotoback() {
    this.qrScanner.hide();
    this.loading.present();
    clearInterval(this.myVar);
    this.navCtrl.push(DashboardPage).then(() => {
      this.loading.dismiss();
    });
  }

  // sample scan pallet locations
  scanlocation() {
    this.userData = { unique_id: 'max - z - r - 1 - 1', created_by: localStorage.getItem('userId'), task_id: this.parameter1 };
    this.authService.postData(this.userData, 'scanLocations').then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      if (this.responseData.success) {
        this.navCtrl.push(FullstockitemPage, {
          param1: this.responseData.warehouseId,
          taskid: this.parameter1,
        });
      }
      else {
        alert('Scanned Location Code was not matched with the system');
      }
    }, (err) => {

    });

  }

  //scan pallet locations
  scanpalletlocation() {
    return this.qrScanner.prepare()
      .then((status: QRScannerStatus) => new Promise((resolve, reject) => {
          if (status.authorized) {
            // camera permission was granted
            window.document.querySelector('body').classList.add('transparent-body');
            const ionApp = <HTMLElement>document.getElementsByTagName('ion-app')[0];

            // start scanning
            const scanSub = this.qrScanner.scan().subscribe((text: string) => {
              scanSub.unsubscribe(); // stop scanning
              const canclBtn = <HTMLElement>document.getElementById('qr_cancel_btn');
              canclBtn.style.display = 'none';
              this.scannedCode = text;

              // hack to hide the app and show the preview
              ionApp.style.display = 'block';

              document.getElementsByTagName('ion-app')[0].removeAttribute('style');
              resolve(text);
              this.userData = { unique_id: this.scannedCode, created_by: localStorage.getItem('userId'), task_id: this.parameter1 };
              document.getElementById('qr_cancel_btn').style.display = 'none';
              this.authService.postData(this.userData, 'scanLocations').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
                if (this.responseData.success) {
                  window.document.querySelector('body').classList.remove('transparent-body');
                  const index = this.viewCtrl.index;
                  this.navCtrl.remove(index);
                  this.navCtrl.push(FullstockitemPage, {
                    param1: this.responseData.warehouseId,
                    taskid: this.parameter1,
                    customer_name: this.customer_name,
                    date_started: this.date_started,
                    location: this.scannedCode,
                  });
                }
                else {
                  alert(this.responseData.message);
                }
              }, (err) => {

              });
            });
            // show camera preview
            ionApp.style.display = 'none';
            this.qrScanner.show();
            const canclBtn = <HTMLElement>document.getElementById('qr_cancel_btn');
            canclBtn.style.display = 'block';
            setTimeout(function() {
              ionApp.style.display = 'block';
            }, 500);


          } else if (status.denied) {
            // camera permission was permanently denied
            // you must use QRScanner.openSettings() method to guide the user to the settings page
            // then they can grant the permission from there
            this.qrScanner.openSettings();
            reject(new Error('MESSAGES.QRSCANNER.CHANGE_SETTINGS_ERROR'));
          } else {
            // permission was denied, but not permanently. You can ask for permission again at a later time.
            reject(new Error('MESSAGES.QRSCANNER.PERMISSION_DENIED_ERROR'));
          }
        }))
      .catch((e: any) => console.log('Error is', e));
  }

  //scroll to end
  scrollTo(elementId: string) {
    //this.content.scrollToBottom();
  }

  //opens chat
  doChat() {
    //this.navCtrl.push(ChatPage);
    const loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.authService.getData('chatlistuser/' + localStorage.getItem('userId')).then((result) => {
      this.responseData = result;
      loader.dismiss();
      if (this.responseData.userData.users.length > 0) {
        this.allUsers = [];
        for (const post of this.responseData.userData.users) {
          this.toUser = {
            toUserId: post.id,
            toUserName: post.username
          };
          post.nav = this.toUser;

          this.allUsers.push(post);
          this.events.publish('usersLists', this.allUsers);
          document.getElementsByClassName('menu-inner')[0].classList.remove('keyboard-showup');
          console.log(this.channel);
          if (typeof this.channel == 'undefined') {
            this.chatService.connectPusher();
            this.chatService.setChannel(localStorage.getItem('userId'));
            this.channel = this.chatService.getChannel();
          }
          if (typeof this.channel != 'undefined') {

            this.channel = this.chatService.getChannel();
            this.channel.unbind('chat-to-' + post.id);

            this.channel.bind('chat-to-' + post.id, function(data) {
              console.log('Chat : ' + data);
              console.log(data);
              console.log(data.message);
            });
          }
        }
      }
      else {
        this.allUsers = [];
        this.events.publish('usersLists', this.allUsers);
      }

    }, (err) => {
      loader.dismiss();
    });
  }


}
