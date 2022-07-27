import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { QRScannerStatus } from '@ionic-native/qr-scanner';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';
import { FullstocklocationPage } from '../fullstocklocation/fullstocklocation';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
/**
 * Generated class for the FullstockitemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fullstockitem',
  templateUrl: 'fullstockitem.html',
})
export class FullstockitemPage {
  parameter1: any;
  responseData: any;
  profilepicture: any;
  Itemarr = [];
  formData = { "quantity_update": "" };
  userData: any;
  warehouse_id: any;
  scannedCode: any;
  taskId: any;
  channel: any;
  location: any;
  allUsers = [];
  toUser: { toUserId: string, toUserName: string };
  classname: any;
  Itemlength: any;
  Stockitem: any;
  myVar: any;
  messagecount: any;
  date_started: any;
  customer_name: any;
  globalarr = { 'customer_name': '', 'created_at': '', 'unique_id': '' };
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public chatService: ChatServiceProvider, private push: Push, public events: Events, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public navParams: NavParams, public authService: AuthService, private alertCtrl: AlertController, private qrScanner: QRScanner) {
    window.dispatchEvent(new Event('resize'));
    this.profilepicture = localStorage.getItem("profilepicture");
  }

  //calls when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad FullstockitemPage');
    this.loadData();
    this.myVar = setInterval(() => {
      this.authService.getData('getUnreadMessagesCount/' + localStorage.getItem("userId")).then((result) => {
        this.responseData = result;
        this.messagecount = this.responseData.messagesCount;
        this.events.publish('msgCount', this.responseData.messagesCount);
        document.getElementById('user_msg_count').innerHTML = this.responseData.messagesCount;
      });
    }, 3000);
  }

  //logout of app
  logout() {
    this.qrScanner.hide();
    this.authService.postData({ "user_id": localStorage.getItem("userId") }, 'logout').then((result) => {

    });
    localStorage.clear();
    clearInterval(this.myVar);
    this.loading.present();

    this.navCtrl.setRoot(LoginPage).then(() => {
      this.loading.dismiss();
    });
  }

  //loads stock item and Quantity
  loadData() {
    this.Itemarr = [];
    this.formData = { "quantity_update": "" };
    this.globalarr = { 'customer_name': '', 'created_at': '', 'unique_id': '' };
    this.parameter1 = this.navParams.get('param1');
    this.taskId = this.navParams.get("taskid");
    this.location = this.navParams.get("location");
    this.customer_name = this.navParams.get("customer_name");
    this.date_started = this.navParams.get("date_started");
    this.responseData = '';
    document.getElementById("quantity_expeceted").innerHTML = '';
    document.getElementById('tapofzerostock').style.display = "none";
    this.userData = '';
    this.parameter1 = this.navParams.get('param1');
    this.authService.getData('getStockItems/' + this.parameter1 + '/' + this.taskId).then((result) => {
      this.responseData = result;
      if (this.responseData.success) {
        for (var i = 0; i < parseInt(this.responseData.getStockItems.length); i++) {
          this.Itemarr.push(this.responseData.getStockItems[i]);
        }

        for (var j = 0; j < parseInt(this.responseData.getStockItems.length); j++) {
          if (this.responseData.getStockItems[j].stock_check_status == 2) {
            this.classname = "completed";
          }
          else {
            this.classname = "not completed";
            break;
          }
        }
        this.Itemlength = this.Itemarr.length;
        if (this.classname == 'completed' && this.Itemarr.length > 0) {
          document.getElementById('taptocomplete').style.display = "none";
          document.getElementById('tapofzerostock').style.display = "none";
          document.getElementById('taptofinlaize').style.display = "block";
        }

        this.customer_name = this.responseData.getStockItems[0].customer_name;
        this.date_started = this.responseData.getStockItems[0].created_at;

        this.globalarr.customer_name = this.responseData.getStockItems[0].customer_name;
        this.globalarr.created_at = this.responseData.getStockItems[0].created_at;
        this.globalarr.unique_id = this.responseData.getStockItems[0].unique_id;
        this.warehouse_id = this.responseData.getStockItems[0].warehouse_id;
      }
      else {
        this.Itemlength = 0;
        document.getElementById('taptocomplete').style.display = "none";
        document.getElementById('taptofinlaize').style.display = "none";
        document.getElementById('tapofzerostock').style.display = "block";
        document.getElementById("quantity_expeceted").innerHTML = '0';
      }

      console.log(this.globalarr);
    }, (err) => {

    });
  }

  // complete item
  completeTofinalize() {
    if (this.Itemlength > 0) {
      this.authService.postData({ "task_id": this.taskId, "status": "1", "type": "full", "warehouse_id": this.parameter1 }, 'finalizeTask').then((result) => {
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.success) {
          alert("Status Updated Successfully");
          window.document.querySelector('body').classList.remove('transparent-body');
          this.loading.present();
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
          this.navCtrl.push(FullstocklocationPage, { param1: this.taskId }).then(() => {
            this.loading.dismiss();
          });
        }
        else {
          //alert("Scanned Item Code was not matched with the system");
        }
      }, (err) => {
      });
    }
    else {
      if (confirm("You are confirming that this location " + this.location + " does not contain stock at this time. Is this correct?")) {

        this.authService.postData({ "task_id": this.taskId, "status": "1", "type": "full", "warehouse_id": this.parameter1 }, 'finalizeTask').then((result) => {
          this.responseData = result;
          console.log(this.responseData);
          if (this.responseData.success) {
            alert("Status Updated Successfully");
            window.document.querySelector('body').classList.remove('transparent-body');
            this.loading.present();
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
            this.navCtrl.push(FullstocklocationPage, { param1: this.taskId }).then(() => {
              this.loading.dismiss();
            });
          }
          else {
            //alert("Scanned Item Code was not matched with the system");
          }
        }, (err) => {
        });
      }
    }


  }

  //hides camera
  hidecamera() {
    this.qrScanner.hide();

    const canclBtn = <HTMLElement>document.getElementById("qr_cancel_btn");
    canclBtn.style.display = "none";
  }


//back to home
  calhome() {
    this.qrScanner.hide();
    clearInterval(this.myVar);
    this.loading.present();
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
      this.loading.dismiss();
    });
  }

  // go back previous page
  gotoback() {
    this.qrScanner.hide();
    clearInterval(this.myVar);
    this.loading.present();
    this.navCtrl.push(FullstocklocationPage, { param1: this.taskId }).then(() => {
      this.loading.dismiss();
    });
  }

  //scan stock item
  scanstockitem() {
    return this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        return new Promise((resolve, reject) => {
          if (status.authorized) {
            // camera permission was granted
            window.document.querySelector('body').classList.add('transparent-body');
            const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];

            // start scanning
            let scanSub = this.qrScanner.scan().subscribe((text: string) => {
              scanSub.unsubscribe(); // stop scanning
              const canclBtn = <HTMLElement>document.getElementById("qr_cancel_btn");
              canclBtn.style.display = "none";
              this.scannedCode = text;

              // hack to hide the app and show the preview
              ionApp.style.display = "block";
              document.getElementById("qr_cancel_btn").style.display = 'none';
              document.getElementsByTagName("ion-app")[0].removeAttribute("style");
              resolve(text);
              this.userData = { "task_id": this.taskId, "qrCodeText": this.scannedCode, "createdBy": localStorage.getItem("userId"), "stockCheckStatus": "1", "warehouseId": this.warehouse_id };
              this.authService.postData(this.userData, 'stockBlockAndComplete').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
                if (this.responseData.success) {
                  this.loading.present();
                  document.getElementById("quantity_expeceted").innerHTML = this.responseData.expectedQuantity;
                  var my = document.getElementById(this.responseData.qrCodeId);
                  this.Stockitem = this.responseData.stockitem;
                  //localStorage.setItem("qrcodeid",this.responseData.qrCodeId);
                  my.classList.remove("orange");
                  my.classList.add("selected_blue");
                  this.qrScanner.hide();
                  this.loading.dismiss();
                }
                else {
                  alert(this.responseData.message);
                }
              }, (err) => {

              });
            });

            // show camera preview
            ionApp.style.display = "none";
            this.qrScanner.show();
            const canclBtn = <HTMLElement>document.getElementById("qr_cancel_btn");
            canclBtn.style.display = "block";
            setTimeout(function () {
              ionApp.style.display = "block";
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
        })
      })
      .catch((e: any) => console.log('Error is', e));





  }

  //complete stock item
  completestockitem() {
    if (this.formData.quantity_update != '') {
      let confirmalert = this.alertCtrl.create({
        title: 'Confirm purchase',
        message: 'You have update the quantity of stock item (' + this.Stockitem + ') to ' + this.formData.quantity_update + '. is this Correct?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.userData = { "task_id": this.taskId, "qrCodeText": this.scannedCode, "updateQuantity": this.formData.quantity_update, "createdBy": localStorage.getItem("userId"), "stockCheckStatus": "2", "warehouseId": this.warehouse_id };
              this.loading.present();
              this.authService.postData(this.userData, 'stockBlockAndComplete').then((result) => {
                this.loading.dismiss();
                this.responseData = result;
                console.log(this.responseData);
                if (this.responseData.success) {
                  alert("Quantity Updated Successfully");
                  document.getElementById("quantity_expeceted").innerHTML = '';
                  this.qrScanner.hide();
                  this.loadData();
                }
                else {
                  alert("Scanned Item Code was not matched with the system");
                }
              }, (err) => {

              });
            }
          }
        ]
      });
      confirmalert.present();

    }
    else {

      this.userData = { "task_id": this.taskId, "qrCodeText": this.scannedCode, "updateQuantity": "", "createdBy": localStorage.getItem("userId"), "stockCheckStatus": "2", "warehouseId": this.warehouse_id };
      this.authService.postData(this.userData, 'stockBlockAndComplete').then((result) => {
        this.responseData = result;
        console.log(this.responseData);
        if (this.responseData.success) {
          alert("Completed Successfully");
          this.qrScanner.hide();
          this.loadData();
        }
        else {
          alert("Scanned Item Code was not matched with the system");
        }
      }, (err) => {

      });
    }
  }

  //opens chat
  doChat() {
    //this.navCtrl.push(ChatPage);
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.authService.getData('chatlistuser/' + localStorage.getItem("userId")).then((result) => {
      this.responseData = result;
      loader.dismiss();
      if (this.responseData.userData.users.length > 0) {
        this.allUsers = [];
        for (let post of this.responseData.userData.users) {
          this.toUser = {
            toUserId: post.id,
            toUserName: post.username
          }
          post.nav = this.toUser;

          this.allUsers.push(post);
          this.events.publish('usersLists', this.allUsers);
          document.getElementsByClassName('menu-inner')[0].classList.remove("keyboard-showup");
          console.log(this.channel);
          if (typeof this.channel == "undefined") {
            this.chatService.connectPusher();
            this.chatService.setChannel(localStorage.getItem("userId"));
            this.channel = this.chatService.getChannel();
          }
          if (typeof this.channel != "undefined") {

            this.channel = this.chatService.getChannel();
            this.channel.unbind('chat-to-' + post.id);

            this.channel.bind('chat-to-' + post.id, function (data) {
              console.log("Chat : " + data);
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
