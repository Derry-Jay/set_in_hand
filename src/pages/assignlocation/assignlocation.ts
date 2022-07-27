import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ViewController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { QRScannerOriginal, QRScannerStatus } from '@ionic-native/qr-scanner';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';
import { CompleteddeliveriesPage } from '../completeddeliveries/completeddeliveries';


/**
 * Generated class for the AssignlocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-page-assignlocation',
  templateUrl: 'assignlocation.html',
})
export class AssignlocationPage {
@ViewChild(Content) content: Content;
  parameter1: any;
  deliverydateId: any;
  customer_name: any;
  customer_id: any;
  qrData = null;
  scannedCode = null;
  userData = {};
  items = [];
  profilepicture: any;
  disitems = [];
  responseData = <any>{};
  classname = 'pending';
  channel: any;
  myVar: any;
  messagesCount: any;
  allUsers = [];
  Dataarr = [];
  qrcodeArr = [];
  selectedlength: any;
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public navParams: NavParams, public authService: AuthService, private qrScanner: QRScannerOriginal) {
	this.loadData();
	this.profilepicture = localStorage.getItem('profilepicture');
	this.selectedlength = 0;

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AssignlocationPage');
  }

  //go to home page
  calhome(){
    this.qrScanner.hide();
    this.loading.present();
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
    });
  }



  //goto previous page
  gotoback(){
    this.qrScanner.hide();
    clearInterval(this.myVar);
    //this.loading.present();
    this.navCtrl.push(CompleteddeliveriesPage).then(() => {
        //this.loading.dismiss();
    });
  }


  //logout of app
  logout(){
     this.qrScanner.hide();
     this.authService.postData({user_id:localStorage.getItem('userId')},'logout').then(() => {
     });
     localStorage.clear();
     clearInterval(this.myVar);
     this.loading.present();
     this.navCtrl.setRoot(LoginPage).then(() => {
           this.loading.dismiss();
    });
  }

  //loads stock item and Qr code
   loadData()
   {
	   this.parameter1 = this.navParams.get('param1');
		this.authService.getData('getDeliveryDetails/'+this.parameter1).then((result) => {
			this.responseData = result;
			for(let i = 0; i < parseInt(this.responseData.DeliveryData.length, 10); i++){
				this.Dataarr.push(this.responseData.DeliveryData[i]);
        this.qrcodeArr.push(this.responseData.DeliveryData[i].qrcodetext);
			}
      if(this.responseData.DeliveryData.length > 15){
        const el = document.getElementById('ScrollConOut');
        el.classList.remove('hide');
      }

			this.deliverydateId = this.responseData.DeliveryData[0].deliveryId;
			this.customer_name = this.responseData.DeliveryData[0].customer_name;
			this.customer_id = this.responseData.DeliveryData[0].customer_id;
			//console.log(this.responseData);
		}, () => {

		});
   }

	selectitem(key: string){
		const mis = document.getElementById(key).className;
		const n = mis.search('assign_selected_blue');
		const m = mis.search('completed');
		if(m < 1 && n < 1){
			localStorage.setItem('selecteditem',key);
			const my = document.getElementById(key);
			my.classList.add('assign_selected_blue');
			my.classList.remove('orange');

			const elem = document.querySelectorAll('.assign_selected_blue');
      this.selectedlength = 0;
      this.selectedlength = elem.length;
		}
		else{
			const my = document.getElementById(key);
			my.classList.remove('assign_selected_blue');
			my.classList.add('orange');
			const elem = document.querySelectorAll('.assign_selected_blue');
      this.selectedlength = 0;
      this.selectedlength = elem.length;
		}
	}

  //deselect all
	selectall(){
		const elems = document.querySelectorAll('.assignstockrow');
    const elem = document.querySelectorAll('.assign_selected_blue');
		console.log(elems.length);
    console.log(elem.length);
      [].forEach.call(elem, function(el: { classList: { remove: (arg0: string) => void; add: (arg0: string) => void } }) {
        el.classList.remove('assign_selected_blue');
        el.classList.add('orange');
        //this.selectedlength = 0;
      });
    const elemss = document.querySelectorAll('.assign_selected_blue');
    this.selectedlength = 0;
    this.selectedlength = elemss.length;
	}

    scrollTo(){
		this.content.scrollToBottom();
	}

  //hides camera
	 hidecamera(){
    this.qrScanner.hide();
    const canclBtn = <HTMLElement>document.getElementById('qr_cancel_btn');
    canclBtn.style.display = 'none';
  }

  // Send to location
	assignlocation(){

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
                              const deliveryid = [];
                              const elems = document.querySelectorAll('.assign_selected_blue');

                              [].forEach.call(elems, function(el: { id: any }) {
                                    deliveryid.push(el.id);
                              });
                              if(elems.length > 0){
                              this.userData = {deliveryqrcodeIds:deliveryid,unique_id:this.scannedCode,customer_id:this.customer_id};
                              this.authService.postData(this.userData,'assignPalletLocation').then((result) => {
                              this.responseData = result;
                              if(this.responseData.success){
                                alert('Assigned to WareHouse Successfully');
                                window.document.querySelector('body').classList.remove('transparent-body');
                                this.loading.present();
                                const index = this.viewCtrl.index;
                                this.navCtrl.remove(index);
                                this.navCtrl.push(CompleteddeliveriesPage).then(() => {
                                        this.loading.dismiss();
                                });
                              }
                              else{
                                alert(this.responseData.message);
                              }

                              }, () => {

                              });
                              }
                              else{
                                alert('Please select the stock item');
                              }
                              console.log(deliveryid);
                              resolve(text);
                          });

                        // show camera preview
                        // show camera preview
                        ionApp.style.display = 'none';
                        this.qrScanner.show();

                        setTimeout(function(){
                            ionApp.style.display = 'block';
                        },500);
                        document.getElementById('qr_cancel_btn').style.display = 'block';

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

  //sample scan code
  samplescancode(){

    const text = '231';


    if(this.qrcodeArr.indexOf(text) > -1){
        const mis = document.getElementById(text);
        console.log(mis);
        mis.classList.add('assign_selected_blue');
        mis.classList.remove('orange');
    }else{
      alert('Scanned Code does not match with our system');
    }
  }

  //scan stock code
	scanCode() {
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
                            	const my = document.getElementById('location_count');
								              my.classList.add('green');

                              //turn into blue matched qrcode
                              if(this.qrcodeArr.indexOf(text) > -1){
                                  const mis = document.getElementById(text);
                                  console.log(mis);
                                  mis.classList.add('assign_selected_blue');
                                  mis.classList.remove('orange');
                              }else{
                                alert('Scanned Code does not match with our system');
                              }

                              const elemss = document.querySelectorAll('.assign_selected_blue');
                              this.selectedlength = 0;
                              this.selectedlength = elemss.length;

                            	// hack to hide the app and show the preview
                            	ionApp.style.display = 'block';
                              document.getElementById('qr_cancel_btn').style.display = 'none';
								              document.getElementsByTagName('ion-app')[0].removeAttribute('style');
                            	resolve(text);
                        	});

                        // show camera preview
                        // show camera preview
                        ionApp.style.display = 'none';
                        this.qrScanner.show();

                        setTimeout(function(){
                            ionApp.style.display = 'block';
                        },500);
                        document.getElementById('qr_cancel_btn').style.display = 'block';

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

}
