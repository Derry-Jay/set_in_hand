import {Component,ViewChild, ChangeDetectorRef} from '@angular/core';
import {IonicPage,NavController,NavParams,Platform,ModalController,LoadingController,ViewController,AlertController,Content,Events} from 'ionic-angular';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {AuthService} from '../../providers/auth-service/auth-service';
import {QRScanner,QRScannerStatus} from '@ionic-native/qr-scanner';
import {HomePage} from '../home/home';
import {LoginPage} from '../login/login';
import {ChatServiceProvider} from '../../providers/chat-service/chat-service';
import {DashboardPage} from '../dashboard/dashboard';
import { HashLocationStrategy } from '@angular/common';


/**
 * Generated class for the DeliveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-page-delivery',
  templateUrl: 'delivery.html',
})
export class DeliveryPage {

  @ViewChild(Content) content: Content;
  parameter1: any;
  qrData = null;
  scannedCode = null;
  userData = {};
  items = [];
  disitems = [];
  responseData = < any > {};
  classname = 'pending';
  disclassname = 'pending';
  channel: any;
  allUsers = [];
  deliveryidd: any;
  scanedCount: any;
  messagecount: any;
  toUser: {
    toUserId: string;
    toUserName: string;
  };
  profilepicture: any;
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  userPostData = {
    deliverynote_no: '',
    delivery_date: '',
    total_box: '',
    no_of_boxes: '',
    customer_name: '',
    product_code: '',
    job_no:'',
    deliverynote:''
  };
  //perbox click
  stockCode: any;
  totalBoxes: any;
  qtyPerBox: any;
  deliveryId: any;
  stockTotalboxcount: any;
  constructor(public navCtrl: NavController, _platform: Platform, public viewCtrl: ViewController,
    public loadingCtrl: LoadingController, public navParams: NavParams, public authService: AuthService,
    public modalCtrl: ModalController, private alertCtrl: AlertController, private qrScanner: QRScanner,
    public chatService: ChatServiceProvider, public events: Events, private changeDetector: ChangeDetectorRef) {
    window.dispatchEvent(new Event('resize'));
    this.LoadData();
    this.profilepicture = localStorage.getItem('profilepicture');
    // setInterval(() => {
    //    this.authService.getData('getUnreadMessagesCount/'+localStorage.getItem("userId")).then((result) => {
    //     this.responseData = result;
    //     this.messagecount = this.responseData.messagesCount;
    //     this.events.publish('msgCount', this.responseData.messagesCount);
    //     document.getElementById('user_msg_count').innerHTML = this.responseData.messagesCount;
    //   });
    // }, 3000);



  }


//logout of app
  logout() {

    this.qrScanner.hide();
    localStorage.clear();
    this.loading.present();
    this.authService.postData({user_id:localStorage.getItem('userId')},'logout').then((_result) => {
            this.navCtrl.setRoot(LoginPage).then(() => {
               //this.loading.dismiss();
            });
        });
  }

  StartCamera() {



  }

//goes to previous page
  gotoback() {
    //this.loading.present();
    this.navCtrl.push(DashboardPage).then(() => {
      //this.loading.dismiss();
    });

  }

//calls before when goes to nect page
  ionViewDidLeave() {
    if(localStorage.getItem('check_qrcode') == ''){
       localStorage.removeItem('check_qrcode');
    }
    window.document.querySelector('body').classList.remove('transparent-body');
  }

  ionViewDidLoad() {

  }

//loads stocks item , discrepancies and header datas
  LoadData() {

    localStorage.setItem('delivery_id', '');
    localStorage.setItem('deliveryidd','');
    localStorage.setItem('selecteditem','');

    this.parameter1 = this.navParams.get('delivery_id');
    this.loading.present();
    localStorage.setItem('delivery_id', this.parameter1);

    this.authService.postData(this.userData, 'deliverystock/' + this.parameter1).then((result) => {
      this.loading.dismissAll();
      this.responseData = result;
      if (this.responseData.Data.length > 0) {
        console.log(this.responseData);

        this.scanedCount = this.responseData.scanedCount;
        this.stockTotalboxcount = this.responseData.stock_total_box_count;
        this.deliveryidd = this.responseData.Data[0].delivery_id;
        localStorage.setItem('deliveryidd',this.deliveryidd);
        this.userPostData.deliverynote_no = this.responseData.Data[0].delivery_id;
        this.userPostData.delivery_date = this.responseData.Data[0].delivery_date;
        this.userPostData.total_box = this.responseData.Data[0].totalbox;
        this.userPostData.no_of_boxes = this.responseData.Data.length;

        this.userPostData.deliverynote = this.responseData.Data[0].deliverynote_no;
        this.userPostData.job_no = this.responseData.Data[0].jobno;

        this.userPostData.customer_name = this.responseData.Data[0].customer_name;
        this.userPostData.product_code = this.responseData.Data[0].product_code;
        const globalarr = [];
        const discrepancyarr = [];

        // if(this.responseData.discrepancy.length > 0){
        //   for(var j=0; j< this.responseData.discrepancy.length; j++){
        //     let test = this.responseData.discrepancy[j].stock_item_id + " Qty: " + this.responseData.discrepancy[j].qty_expected;
        //     if(this.responseData.discrepancy[j].qrcodestatus == 1){

        //       this.disclassname = 'codescanned';

        //     }
        //     else{
        //       this.disclassname = 'pending';
        //     }
        //     discrepancyarr.push({"stock":test, "deliveryqrcodeId": this.responseData.discrepancy[j].deliveryqrcodeId, "classname":this.disclassname});
        //   }
        //   this.disitems = discrepancyarr;
        // }

        if(this.scanedCount !== this.responseData.Data[0].totalbox){
          for (let i = 0; i < this.responseData.Data.length; i++) {
            console.log(this.responseData.Data[i].stock_item_id);
            const test = this.responseData.Data[i].stock_item_id + ' Qty: ' + this.responseData.Data[i].qty_expected;
            if(this.responseData.Data[i].qrcodestatus === 1){
              this.classname = 'codescanned';
            }
            else{
              this.classname = 'pending';
            }
            globalarr.push({
              stock: test,
              deliveryqrcodeId: this.responseData.Data[i].deliveryqrcodeId,
              classname : this.classname,
              product_code:this.responseData.Data[i].product_code,
              totalbox:this.responseData.Data[i].totalbox,
              qty_expected:this.responseData.Data[i].qty_expected,
              deliveryId:this.responseData.Data[i].delivery_id,
            });
          }
          this.items = globalarr;
        }
        else{
          if(this.scanedCount!=0){
            alert('Delivery Yet To Complete');
          }
          this.items = [];
        }
        console.log(this.items.length);
        if (this.responseData.Data.length > 15) {
          const el = document.getElementById('ScrollDelContent');
          el.classList.remove('hide');

        }

        console.log(this.items);
        return this.qrScanner.prepare()
          .then((status: QRScannerStatus) => new Promise((resolve, reject) => {
              if (status.authorized) {
                // camera permission was granted
                window.document.querySelector('body').classList.add('transparent-body');
                const ionApp = < HTMLElement > document.getElementsByTagName('ion-app')[0];

                // start scanning
                const scanSub = this.qrScanner.scan().subscribe((text: string) => {


                  scanSub.unsubscribe(); // stop scanning
                  const canclBtn = < HTMLElement > document.getElementById('qr_cancel_btn');
                  canclBtn.style.display = 'none';
                  this.scannedCode = text;
                  this.userData = {
                    qrcodetext: text,
                    delivery_id: localStorage.getItem('delivery_id'),
                    user_id: localStorage.getItem('userId'),
                    itemid: localStorage.getItem('selecteditem')
                  };
                  this.loading.present();
                  this.authService.postData(this.userData, 'updateqrcode').then((result) => {
                    this.loading.dismiss();
                    this.responseData = result;
                    if (this.responseData.success) {
                      const my = document.getElementById('CodeLinked');
                      my.classList.remove('none');
                      my.classList.add('show');
                      const ke = localStorage.getItem('selecteditem');
                      const mi = document.getElementById(ke);
                      mi.classList.remove('pending');
                      mi.classList.add('codescanned');

                      setTimeout(() => {

                        my.classList.remove('show');
                        my.classList.add('none');
                      }, 200);
                    } else {
                      const msg = this.responseData.Data;
                      const alert = this.alertCtrl.create({

                        title: '',
                        subTitle: msg,
                        buttons: ['Ok']
                      });
                      alert.present();
                    }
                  }, (_err) => {

                  });

                  // hack to hide the app and show the preview
                  ionApp.style.display = 'block';

                  document.getElementsByTagName('ion-app')[0].removeAttribute('style');
                  resolve(text);
                });

                // show camera preview
                ionApp.style.display = 'none';
                this.qrScanner.show();

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
            })).catch((e: any) => console.log('Error is', e));
      } else {
        console.log('No data Available');
      }
    }, (_err) => {});
  }

  //discrepancies model
  openModal() {
   console.log(this.stockTotalboxcount);
   let stockcodeboxcount: string;
   if(this.stockCode!==undefined && this.stockCode !==''){
     console.log('noemp');
     stockcodeboxcount = this.stockTotalboxcount[this.stockCode.toLowerCase()];
   }else{
     console.log('empty');
     stockcodeboxcount = '';
   }

    const data = {
      //deliveryid: this.deliveryId,
      stockcode:this.stockCode,
      boxes:stockcodeboxcount,
      qtyperbox:this.qtyPerBox,
    };
    const modalPage = this.modalCtrl.create('ModalPage', {data});
    modalPage.present();
    modalPage.onDidDismiss(_data => {
        //this.deliveryId = '';
        this.stockCode = '';
        this.totalBoxes = '';
        this.qtyPerBox = '';
        this.LoadData();
    });
  }

  //sample code for scanning
  scansamplecode(){
    this.scannedCode = 'tq1';
    this.userData = {
        qrcodetext: 'tq'+localStorage.getItem('selecteditem'),
        delivery_id: localStorage.getItem('delivery_id'),
        user_id: localStorage.getItem('userId'),
        deliveryqrcodeId: localStorage.getItem('selecteditem')
    };
    //this.loading.present();
    this.authService.postData(this.userData, 'updateqrcode').then((result) => {
        //this.loading.dismiss();
        this.stockCode = '';
        this.totalBoxes = '';
        this.qtyPerBox = '';
        this.responseData = result;
        if (this.responseData.success) {
            localStorage.setItem('check_qrcode','1');
            const my = document.getElementById('CodeLinked');
            console.log(my);
            my.classList.remove('none');
            my.classList.add('show');
            const ke = localStorage.getItem('selecteditem');
            const mi = document.getElementById(ke);
            mi.classList.remove('pending');
            mi.classList.add('codescanned');
            localStorage.removeItem('selecteditem');
            this.scanedCount = this.scanedCount + 1;
            const alertmsg = this.alertCtrl.create({
              title:'Success !',
              message:'Scanned Successfully',
            });
            alertmsg.present();
            setTimeout(() => {
              alertmsg.dismiss();
              const my1 = document.getElementById('CodeLinked');
              console.log(my1);
              my1.classList.remove('show');
              my1.classList.add('none');
            }, 1000);
        } else {
            // let msg = this.responseData.Data;
            // let alert = this.alertCtrl.create({

            //     title: '',
            //     subTitle: msg,
            //     buttons: ['Ok']
            // });
            // alert.present();
        }
    }, (_err) => {

    });
  }

//scan code stock item
  scanCode() {
    if (localStorage.getItem('selecteditem')) {
      const kes = localStorage.getItem('selecteditem');
      const mis = document.getElementById(kes).className;
      const n = mis.search('codescanned');
      if (n < 1) {
        const canclBtn = < HTMLElement > document.getElementById('qr_cancel_btn');
        canclBtn.style.display = 'none';
        return this.qrScanner.prepare()
          .then((status: QRScannerStatus) => new Promise((resolve, reject) => {
              if (status.authorized) {
                // camera permission was granted
                window.document.querySelector('body').classList.add('transparent-body');
                const ionApp = < HTMLElement > document.getElementsByTagName('ion-app')[0];

                // start scanning
                const scanSub = this.qrScanner.scan().subscribe((text: string) => {
                  scanSub.unsubscribe(); // stop scanning
                  const canclBtn = < HTMLElement > document.getElementById('qr_cancel_btn');
                  canclBtn.style.display = 'none';
                  this.scannedCode = text;

                  this.userData = {
                    qrcodetext: text,
                    delivery_id: localStorage.getItem('delivery_id'),
                    user_id: localStorage.getItem('userId'),
                    deliveryqrcodeId: localStorage.getItem('selecteditem')
                  };
                  this.loading.present();
                  this.authService.postData(this.userData, 'updateqrcode').then((result) => {
                    this.stockCode = '';
                    this.totalBoxes = '';
                    this.qtyPerBox = '';
                    this.loading.dismiss();
                    this.responseData = result;
                    if (this.responseData.success) {
                      this.scanedCount = this.scanedCount + 1;

                      localStorage.setItem('check_qrcode','1');
                      const my = document.getElementById('CodeLinked');
                      console.log(my);
                      my.classList.remove('none');
                      my.classList.add('show');
                      const ke = localStorage.getItem('selecteditem');
                      const mi = document.getElementById(ke);
                      mi.classList.remove('pending');
                      mi.classList.add('codescanned');
                      localStorage.removeItem('selecteditem');
                      const alertmsg = this.alertCtrl.create({
                        title:'Success !',
                        message:'Scanned Successfully',
                      });
                      alertmsg.present();
                      setTimeout(() => {
                        alertmsg.dismiss();
                        const my1 = document.getElementById('CodeLinked');
                        console.log(my1);
                        my1.classList.remove('show');
                        my1.classList.add('none');
                        this.changeDetector.detectChanges();
                      }, 1000);

                    } else {
                      const msg = this.responseData.Data;
                      const alert = this.alertCtrl.create({

                        title: '',
                        subTitle: msg,
                        buttons: ['Ok']
                      });
                      alert.present();
                    }
                  }, (_err) => {

                  });

                  // hack to hide the app and show the preview
                  ionApp.style.display = 'block';

                  document.getElementsByTagName('ion-app')[0].removeAttribute('style');
                  resolve(text);
                });
                // show camera preview
                ionApp.style.display = 'none';
                this.qrScanner.show();
                const canclBtn = < HTMLElement > document.getElementById('qr_cancel_btn');
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
      } else {
        alert('Code Already Scanned');
      }
    } else {
      const alert = this.alertCtrl.create({
        title: '',
        subTitle: 'Please select a stock item',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

//hides camera
  hidecamera() {
    this.qrScanner.hide();
    const canclBtn = < HTMLElement > document.getElementById('qr_cancel_btn');
    canclBtn.style.display = 'none';
  }

  //goes to home page
  calhome() {

    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
    });
  }


//partial model
  openParitalModal() {
    //
    // if(localStorage.getItem("check_qrcode") == '1'){
    //   alert('1');
    // }else{
    //   alert('2');
    // }
    if(localStorage.getItem('check_qrcode') === '1'){
    const index = this.viewCtrl.index;
    this.userData = {
      delivery_id: localStorage.getItem('delivery_id'),
      created_by : localStorage.getItem('userId'),

    };
    this.loading.present();

    this.authService.postData(this.userData, 'deliveryPartialcomplete').then((_result) => {
      this.loading.dismiss();
      alert('Partially Completed Successfully');
      const elems = document.querySelectorAll('.deliverystockitem');
      [].forEach.call(elems, function(el: { classList: { remove: (arg0: string) => void } }) {
        localStorage.removeItem('check_qrcode');
        el.classList.remove('codescanned');
        el.classList.remove('deliverystockitem');
      });

      const currentIndex = this.navCtrl.getActive().index;
      this.navCtrl.setRoot(DashboardPage).then(() => {
          this.navCtrl.remove(currentIndex);
      });

      //this.navCtrl.push(DashboardPage);
    });
    }else{
      alert('Please Scan Any Stock Item');
    }
  }

  //scroll bottom page
  scrollTo(_elementId: string) {
    /*

    let yOffset = document.getElementById('StockItems_7').offsetTop;
    //var height = yOffset.;
    //alert(height);

    this.content.scrollTo(0, yOffset, 4000);
    // scrollToTop*/

    this.content.scrollToBottom();

    //var messagesContent = this.app.getComponent('StockItems') as Content;
    //var messagesContent = document.getElementById('StockItems');
    //messagesContent.scrollTo(0, messagesContent.getContentDimensions().contentHeight, 700);

  }


  //complete delivery
  openCompletedModal() {
    console.log(this.userPostData.total_box);
    console.log(this.scanedCount);
    const value = localStorage.getItem('selecteditem');
    const allelems = document.querySelectorAll('.deliverystockitem');
    const elems = document.querySelectorAll('.codescanned');

    const len = allelems.length;
    if (this.userPostData.total_box === this.scanedCount) {
      //if(value){
      const data = {
        message: localStorage.getItem('delivery_id')
      };
      const completedmodalPage = this.modalCtrl.create('CompletedpagemodalPage', data);
      completedmodalPage.present();
      completedmodalPage.onDidDismiss(_data => {
        localStorage.removeItem('delivery_id');
        this.navCtrl.setRoot(DashboardPage);
      });

    } else {
      alert('Some of the items are not yet scanned,Please Scan the Stock Item');

    }
  }

  //selects stock item due
 select_item(key: string,stockcode: any,boxes: any,qtyperbox: any,_deliveryid: any) {
   this.stockCode = stockcode;
   this.totalBoxes = boxes;
   this.qtyPerBox = qtyperbox;
   //this.deliveryId = deliveryid;
    localStorage.removeItem('selecteditem');
    localStorage.setItem('selecteditem', key);
    const elems = document.querySelectorAll('.deliverystockitem');
    [].forEach.call(elems, function(el: { classList: { remove: (arg0: string) => void } }) {
      el.classList.remove('selected');
    });
    const my = document.getElementById(key);
    my.classList.add('selected');
     window.document.querySelector('body').classList.add('transparent-body');
     //const ionApp = < HTMLElement > document.getElementsByTagName("ion-app")[0];
     //ionApp.style.display = "none";
    // this.scanCode();
    this.scansamplecode();
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
      if (this.responseData.userData) {
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

            this.channel.bind('chat-to-' + post.id, function(data: string) {
              console.log('Chat : ' + data);
              console.log(data);
              console.log(data.message);
            });
          }
        }
      }
    }, (_err) => {
      loader.dismiss();
    });
  }
}
