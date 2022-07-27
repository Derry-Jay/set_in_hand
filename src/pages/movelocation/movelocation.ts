import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, ViewController, Content } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { MovelocationitemPage } from '../movelocationitem/movelocationitem';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { QRScannerStatus } from '@ionic-native/qr-scanner';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';

/**
 * Generated class for the MovelocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-movelocation',
  templateUrl: 'movelocation.html',
})
export class MovelocationPage {
@ViewChild(Content) content: Content;
  parameter1	: any;
  customer_name : any;
  date_started : any;
  qrData = null;
  scannedCode = null;
  userData = {};
  items = [];
  disitems = [];
  messagecount:any;
  channel : any;
  allUsers = [];
  toUser : {toUserId: string, toUserName: string};
  responseData = <any>{};
  classname = 'pending';
  myVar:any;
  bulidingArr = [];
  zoneArr = [];
  rackArr = [];
  HighArr = [];
  LowArr = [];
  zone:any;
  rack:any;
  building:any;
  profilepicture:any;
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public viewCtrl : ViewController, public chatService : ChatServiceProvider, private push: Push, public loadingCtrl: LoadingController, public events: Events,  public navParams: NavParams, public authService : AuthService, private qrScanner: QRScanner) {
    this.profilepicture = localStorage.getItem("profilepicture");

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullstocklocationPage');
	  this.loadData();
  }

  //logout of app
  logout(){
     this.qrScanner.hide();
     this.authService.postData({"user_id":localStorage.getItem("userId")},'logout').then((result) => {

     });
     localStorage.clear();
     clearInterval(this.myVar);
     this.loading.present();

     this.navCtrl.setRoot(LoginPage).then(() => {
           this.loading.dismiss();
    });
}

//loads location and datas
    loadData()
    {
      this.parameter1 = this.navParams.get('param1');
      let loader = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'mainloader',
        content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
      });

      loader.present();
      this.authService.getData('getpalletlocation').then((result) => {
      loader.dismiss();
      this.responseData = result;
      for(var i = 0; i < parseInt(this.responseData.palletLocations.getLocations.length); i++){
        this.HighArr.push(this.responseData.palletLocations.getLocations[i]);
      }


      for(var k = 0; k < parseInt(this.responseData.palletLocations.building.length); k++){
        this.bulidingArr.push(this.responseData.palletLocations.building[k]);
      }

      console.log(this.bulidingArr);

      this.building = this.responseData.palletLocations.building[0].id;
      this.selectzone();

      if(this.responseData.palletLocations.getLocations > 0)
      {
        this.customer_name = this.responseData.palletLocations.getLocations[0].customer_name;
        this.date_started = this.responseData.palletLocations.getLocations[0].date_started;
      }

      }, (err) => {

      });


    }

//hides camera
   hidecamera(){
    this.qrScanner.hide();
    const canclBtn = <HTMLElement>document.getElementById("qr_cancel_btn");
    canclBtn.style.display = "none";
  }

//selects zone
  selectzone(){
     this.zone = '';
     this.zoneArr = [];
     this.userData = {"building_id":this.building};
     let loader = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'mainloader',
        content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
      });

      loader.present();
      this.authService.postData(this.userData,'getzone').then((result) => {
        loader.dismiss();
        console.log(result);
        this.responseData = result;
        for(var i = 0; i < this.responseData.zoneData.zone.length; i++){
          this.zoneArr.push(this.responseData.zoneData.zone[i]);
        }
        if(this.responseData.zoneData.zone.length > 0){
          this.zone = this.responseData.zoneData.zone[0].id;
        }
     });

  }

  //selets track
  selectrack(){
     this.rack = '';
     this.rackArr = [];
     this.userData = {"zone_id":this.zone};
     if(this.zone != ''){
      let loader = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'mainloader',
        content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
      });

      loader.present();
       this.authService.postData(this.userData,'getrack').then((result) => {
       loader.dismiss();
          console.log(result);
          this.responseData = result;
          for(var i = 0; i < this.responseData.rackData.rack.length; i++){
            this.rackArr.push(this.responseData.rackData.rack[i]);
          }
          if(this.responseData.rackData.rack.length > 0){
            this.rack = this.responseData.rackData.rack[0].id;
          }
       });
     }
  }

  // searched location
  getlocationbysearch(){

     if( typeof(this.building) != 'undefined' && typeof(this.zone) != 'undefined' && typeof(this.rack) != 'undefined'){
      let loader = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'mainloader',
        content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
      });

      loader.present();
       this.userData = {"building_id":this.building,"zone_id":this.zone,"rack_id":this.rack};
       this.authService.postData(this.userData,'getpalletlocations').then((result) => {
       loader.dismiss();
          this.responseData = result;
          this.HighArr = [];
          for(var i = 0; i < parseInt(this.responseData.palletLocations.getLocations.length); i++){
            this.HighArr.push(this.responseData.palletLocations.getLocations[i]);
          }
       });
     }
     else{
      alert("Please fill all the mandatory fields and then click submit");
     }
  }


//goes to home page
  calhome(){
    this.qrScanner.hide();
    this.loading.present();
    clearInterval(this.myVar);
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
    });
  }

  //goes to previous page
  gotoback(){
    this.qrScanner.hide();
    this.loading.present();
    clearInterval(this.myVar);
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
	  });
  }

  //sample scan location
	scanlocation(){
    this.userData = {"unique_id":"East - X - H - 15 - 4"};
		this.authService.postData(this.userData,'scanstockmovementLocations').then((result) => {
			this.responseData = result;
			console.log(this.responseData);
			if(this.responseData.success)
			{
				this.navCtrl.push(MovelocationitemPage, {
           param1: this.responseData.warehouseId,
           warehouse_unique_id : "East - X - H - 15 - 4"
        });
			}
			else{
				alert("Scanned Location Code was not matched with the system");
			}
		}, (err) => {

		});




	}

  //Scan location
	scanpalletlocation(){
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

								              document.getElementsByTagName("ion-app")[0].removeAttribute("style");
                            	resolve(text);

                            	document.getElementById("qr_cancel_btn").style.display = 'none';
                              let loader = this.loadingCtrl.create({
                                spinner: 'hide',
                                cssClass: 'mainloader',
                                content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
                              });

                              loader.present();
                              this.userData = {"unique_id":this.scannedCode};
								              this.authService.postData(this.userData,'scanstockmovementLocations').then((result) => {
                                loader.dismiss();
									               this.responseData = result;
									               console.log(this.responseData);
									               if(this.responseData.success)
									               {
										                this.qrScanner.hide();
										                this.navCtrl.push(MovelocationitemPage, {
											                 param1: this.responseData.warehouseId,
                                       warehouse_unique_id : this.scannedCode
										                });
									                }
									                else{
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
                        setTimeout(function(){
                            ionApp.style.display = "block";
                        },500);


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


//scroll bottom
 scrollTo() {
    //let yOffset = document.getElementById('stockmovementlocation').offsetTop;
    //var height = yOffset.;
    //alert(height);
    //this.content.scrollTo(0, yOffset, 4000);
    // scrollToTop*/

    this.content.scrollToBottom();

  }

//open chat
  doChat(){
    //this.navCtrl.push(ChatPage);
    let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        this.authService.getData('chatlistuser/'+localStorage.getItem("userId")).then((result) => {
            this.responseData = result;
            loader.dismiss();
           if(this.responseData.userData.users.length > 0){
                 this.allUsers = [];
                for (let post of this.responseData.userData.users) {
                    this.toUser = {
                          toUserId:post.id,
                          toUserName:post.username
                    }
                    post.nav = this.toUser;

                    this.allUsers.push(post);
                    this.events.publish('usersLists', this.allUsers);
                     document.getElementsByClassName('menu-inner')[0].classList.remove("keyboard-showup");
                    console.log(this.channel);
                    if(typeof this.channel == "undefined"){
                        this.chatService.connectPusher();
                        this.chatService.setChannel(localStorage.getItem("userId"));
                        this.channel = this.chatService.getChannel();
                    }
                    if(typeof this.channel != "undefined")  {

                        this.channel = this.chatService.getChannel();
                        this.channel.unbind('chat-to-'+post.id);

                        this.channel.bind('chat-to-'+post.id, function (data) {
                            console.log("Chat : " + data);
                            console.log(data);
                            console.log(data.message);
                        });
                    }
                }
            }
        }, (err) => {
            loader.dismiss();
        });
}
}
