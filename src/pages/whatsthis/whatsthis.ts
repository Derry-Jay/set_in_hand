import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { QRScannerStatus } from '@ionic-native/qr-scanner';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';

/**
 * Generated class for the WhatsthisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-whatsthis',
  templateUrl: 'whatsthis.html',
})
export class WhatsthisPage {

  parameter1: any;
  deliverydateId: any;
  customer_name: any;
  customer_id: any;
  header1: any;
  header2: any;
  header3: any;
  header4: any;
  header5: any;

  qrData = null;
  scannedCode = null;
  userData = {};
  items = [];
  isfrom: any;
  Itemarr = [];

  profilepicture: any;
  disitems = [];
  responseData = <any>{};
  classname = 'pending';
  styleclass = '';
  channel: any;
  myVar: any;
  messagesCount: any;
  allUsers = [];
  Dataarr = [];
  selectedlength: any;
  loading: any;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public navParams: NavParams, public authService: AuthService, private qrScanner: QRScanner) {
  	this.profilepicture = localStorage.getItem("profilepicture");
  	this.selectedlength = 0;
    this.loading = this.loadingCtrl.create({
      spinner: 'hide',
      cssClass: 'mainloader',
      dismissOnPageChange: true,
      content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssignlocationPage');
  }

  //back to home
  calhome(){
    this.qrScanner.hide();
    this.loading.present();
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
    });
  }


//back to previous page
  gotoback(){
    this.qrScanner.hide();
    this.loading.present();
    this.navCtrl.setRoot(DashboardPage).then(() => {
           this.loading.dismiss();
    });
  }

//logout of application
  logout(){
     this.qrScanner.hide();
     this.authService.postData({"user_id":localStorage.getItem("userId")},'logout').then(() => {

     });
     localStorage.clear();
     clearInterval(this.myVar);
     this.loading.present();

     this.navCtrl.setRoot(LoginPage).then(() => {
           this.loading.dismiss();
    });
  }

  //hides camera
  hidecamera() {
    this.qrScanner.hide();
    const canclBtn = < HTMLElement > document.getElementById("qr_cancel_btn");
    canclBtn.style.display = "none";
  }

  // sample scan QR code
  samplescancode(){
    this.scannedCode = 'East - GI - A - 1 - 1';
    this.userData = {
        "qrcodetext": 'East - GI - A - 1 - 1',
    };
    this.Itemarr  = [];
    let loader = this.loadingCtrl.create({
      spinner: 'hide',
      cssClass: 'mainloader',
      dismissOnPageChange: true,
      content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
    });
    loader.present();
    setTimeout(() => {
        loader.dismiss();
    }, 5000);
    this.authService.postData(this.userData, 'getdetailsbyqrcode').then((result) => {
      this.loading.dismiss();
      this.responseData = result;
      if (this.responseData.success) {

        this.isfrom = this.responseData.isfrom;
        if(this.responseData.isfrom == 'Stockcode'){
          this.header1 = "Location";
          this.header2 = "Stock Code";
          this.header3 = "Type";
          this.header4 = "Qty";
          if(this.responseData.data.stockcodedetails.length > 0){
            for(var i = 0; i < parseInt(this.responseData.data.stockcodedetails.length); i++){
              this.Itemarr.push(this.responseData.data.stockcodedetails[i]);
            }
          }
          else{
            alert("No records found");
          }
        }
        else if(this.responseData.isfrom == 'Warehouse'){
          this.header1 = "Location";
          this.header2 = "Stock Code";
          this.header3 = "Type";
          this.header4 = "Qty";
          if(this.responseData.data.warehousedetails.length > 0){
            for(var i = 0; i < parseInt(this.responseData.data.warehousedetails.length); i++){
              this.Itemarr.push(this.responseData.data.warehousedetails[i]);
            }
          }
          else{
            alert("No records found");
          }
        }
        else if(this.responseData.isfrom == 'Moverequest'){
          this.header1 = "MR Id";
          this.header2 = "Customer";
          this.header3 = "Reason";
          this.header4 = "Details";
          this.header5 = "MR Date";
          this.styleclass = "move_request";
          if(this.responseData.data.boxdetails.length > 0){
            for(var i = 0; i < parseInt(this.responseData.data.boxdetails.length); i++){
              this.Itemarr.push(this.responseData.data.boxdetails[i]);
            }
          }
          else{
            alert("No records found");
          }
      }

      } else {

      }

      }, () => {

    });
  }

  // Scan QR code
  scanCode() {
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
                              this.qrScanner.hide();
                              document.getElementsByTagName("ion-app")[0].removeAttribute("style");
                              resolve(text);


                              this.Itemarr  = [];
                              this.userData = {
                                  "qrcodetext": this.scannedCode,
                              };
                              let loader = this.loadingCtrl.create({
                                spinner: 'hide',
                                cssClass: 'mainloader',
                                dismissOnPageChange: true,
                                content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
                              });
                              loader.present();
                              setTimeout(() => {
                                  loader.dismiss();
                              }, 3000);
                              this.authService.postData(this.userData, 'getdetailsbyqrcode').then((result) => {
                                this.loading.dismiss();
                                this.responseData = result;
                                if (this.responseData.success) {

                                  this.isfrom = this.responseData.isfrom;
                                  if(this.responseData.isfrom == 'Stockcode'){
                                    this.header1 = "Location";
                                    this.header2 = "Stock Code";
                                    this.header3 = "Type";
                                    this.header4 = "Qty";
                                    this.styleclass = "";
                                    if(this.responseData.data.stockcodedetails.length > 0){
                                      for(var i = 0; i < parseInt(this.responseData.data.stockcodedetails.length); i++){
                                        this.Itemarr.push(this.responseData.data.stockcodedetails[i]);
                                      }
                                    }
                                    else{
                                      alert("No records found");
                                    }
                                  }
                                  else if(this.responseData.isfrom == 'Warehouse'){
                                    this.header1 = "Location";
                                    this.header2 = "Stock Code";
                                    this.header3 = "Type";
                                    this.header4 = "Qty";
                                    this.styleclass = "";
                                    if(this.responseData.data.warehousedetails.length > 0){
                                      for(var i = 0; i < parseInt(this.responseData.data.warehousedetails.length); i++){
                                        this.Itemarr.push(this.responseData.data.warehousedetails[i]);
                                      }
                                    }
                                    else{
                                      alert("No records found");
                                    }
                                  }
                                  else if(this.responseData.isfrom == 'Moverequest'){
                                    this.header1 = "MR Id";
                                    this.header2 = "Customer";
                                    this.header3 = "Reason";
                                    this.header4 = "Details";
                                    this.header5 = "MR Date";
                                    this.styleclass = "move_request";
                                    if(this.responseData.data.boxdetails.length > 0){
                                      for(var i = 0; i < parseInt(this.responseData.data.boxdetails.length); i++){
                                        this.Itemarr.push(this.responseData.data.boxdetails[i]);
                                      }
                                    }
                                    else{
                                      alert("No records found");
                                    }
                                }

                                } else {

                                }

                                }, () => {

                              });
                         	});


                        // show camera preview
                        // show camera preview
                        ionApp.style.display = "none";
                        this.qrScanner.show();

                        setTimeout(function(){
                            ionApp.style.display = "block";
                        },500);
                        document.getElementById("qr_cancel_btn").style.display = 'block';

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

}
