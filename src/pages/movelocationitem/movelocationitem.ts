import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, Events, Content } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { QRScannerStatus } from '@ionic-native/qr-scanner';
import { DashboardPage } from '../dashboard/dashboard';
import { LoginPage } from '../login/login';
import { MovelocationPage } from '../movelocation/movelocation';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';


/**
 * Generated class for the MovelocationitemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-movelocationitem',
  templateUrl: 'movelocationitem.html',
})
export class MovelocationitemPage {
  @ViewChild(Content) content: Content;
  parameter1 : any;
  parameter2 : any;
  responseData:any;
  profilepicture : any;
  Itemarr  = [];
  formData = {"quantity_update":""};
  userData:any;
  warehouse_id : any;
  scannedCode : any;
  taskId : any;
  channel : any;
  location : any;
  allUsers = [];
  toUser : {toUserId: string, toUserName: string};
  classname : any;
  Itemlength :any;
  Stockitem : any;
  myVar:any;
  messagecount:any;
  date_started : any;
  customer_name : any;
  globalarr = {'customer_name':'','created_at':'','unique_id':''};
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public chatService : ChatServiceProvider, private push: Push, public events: Events, public viewCtrl : ViewController, public loadingCtrl : LoadingController, public navParams: NavParams, public authService : AuthService, private alertCtrl: AlertController, private qrScanner: QRScanner) {
      window.dispatchEvent(new Event('resize'));
      if(typeof(localStorage.getItem("tolocation")) != "undefined"){
        localStorage.removeItem("tolocation");
        localStorage.removeItem("tolocationuniqueid");
      }
      this.profilepicture = localStorage.getItem("profilepicture");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FullstockitemPage');

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

//loads all locatiosn and customer details
  loadData(){
      this.Itemarr  = [];
      this.formData = {"quantity_update":""};
      this.globalarr = {'customer_name':'','created_at':'','unique_id':''};
      this.parameter1 = this.navParams.get('param1');
      this.parameter2 = this.navParams.get("warehouse_unique_id");
      this.taskId = this.navParams.get("taskid");
      this.location = this.navParams.get("location");
      this.customer_name = this.navParams.get("customer_name");
      this.date_started = this.navParams.get("date_started");
      this.responseData = '';
      document.getElementById("quantity_expeceted").innerHTML = '';
      this.userData = '';
      this.parameter1 = this.navParams.get('param1');
      console.log(this.parameter1);
		  this.authService.getData('getmoveStockItems/'+this.parameter1).then((result) => {
			this.responseData = result;
			if(this.responseData.success){
      for(var i = 0; i < parseInt(this.responseData.getStockItems.length); i++){
				this.Itemarr.push(this.responseData.getStockItems[i]);
			}

			for(var j = 0; j < parseInt(this.responseData.getStockItems.length); j++){
			    if(this.responseData.getStockItems[j].stock_check_status == 2){
              this.classname = "completed";
			    }
			    else{
			        this.classname = "not completed";
			        break;
			    }
			}
      this.Itemlength = this.Itemarr.length;
      if(this.classname == 'completed' && this.Itemarr.length > 0){
          //document.getElementById('taptocomplete').style.display = "none";
      }

			this.globalarr.customer_name = this.responseData.getStockItems[0].customer_name;
			this.globalarr.created_at = this.responseData.getStockItems[0].created_at;
			this.globalarr.unique_id = this.responseData.getStockItems[0].unique_id;
			this.warehouse_id = this.responseData.getStockItems[0].warehouse_id;
			}
			else{
			  this.Itemlength = 0;
			  //document.getElementById('taptocomplete').style.display = "none";
		}

			console.log(this.globalarr);
		  }, (err) => {

		  });


  }

  //sample scan move location
  sampletaptomove(){
    var boxid = [];
    var elems = document.getElementById("quantity_expeceted").childNodes;
    [].forEach.call(elems, function(el) {
          boxid.push(el.id);
    });
    if(boxid.length > 0){
    localStorage.setItem("tolocationuniqueid","Container - S - B - 0 - 0");
      localStorage.setItem("tolocation",'1147');
      this.userData = {"qrcodeids":boxid,"warehouseid":localStorage.getItem("tolocation")};
      let message = "You are moving "+boxid.length+" items from location ("+this.parameter2+") to location ("+localStorage.getItem('tolocationuniqueid')+") is this correct?";
      let alert = this.alertCtrl.create({
        title: 'Confirm',
        message: message,
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
              this.authService.postData(this.userData,'movetootherlocation').then((result) => {
                  let loader = this.loadingCtrl.create({
                    spinner: 'hide',
                    cssClass: 'mainloader',
                    content: '<div class="moved_confirm" ><div class="main_box"><div class="added_icon"></div><div class="note hide">Note:<br> this screen will only appear for a couple of seconds<br> and then automatically revert to the stock screen</div></div></div>'
                  });

                  loader.present();
                  setTimeout(() => {
                    loader.dismiss();
                    this.navCtrl.push(DashboardPage).then(() => {

                    });
                  }, 800);
              });
            }
          }
        ]
      });
      alert.present();
    }
  }

  // scan move location
  taptomove(){
    var boxid = [];
    var elems = document.getElementById("quantity_expeceted").childNodes;
    [].forEach.call(elems, function(el) {
          boxid.push(el.id);
    });
    if(boxid.length > 0){
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
                              this.userData = {"scanedcode": this.scannedCode};
                              localStorage.setItem("tolocationuniqueid",this.scannedCode);
                              this.authService.postData(this.userData,'getqrcodeid').then((result) => {
                                this.responseData = result;
                                console.log(this.responseData);
                                if(this.responseData.success)
                                {
                                  if(this.responseData.type == "qrcode"){
                                    var itm = document.getElementById(this.responseData.id);
                                    itm.classList.remove("orange");
                                    itm.classList.add("green");
                                    var cln = itm.cloneNode(true);
                                    this.qrScanner.hide();
                                    document.getElementById("quantity_expeceted").appendChild(cln);
                                    itm.remove();

                                  }
                                  else if(this.responseData.type == "warehouse"){
                                    this.qrScanner.hide();

                                    localStorage.setItem("tolocation",this.responseData.id);


                                    this.userData = {"qrcodeids":boxid,"warehouseid":localStorage.getItem("tolocation"),"created_by":localStorage.getItem("userId")};
                                    let message = "You are moving "+boxid.length+" items from location ("+this.parameter2+") to location ("+localStorage.getItem('tolocationuniqueid')+") is this correct?";
                                    let alert = this.alertCtrl.create({
                                      title: 'Confirm',
                                      message: message,
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
                                            this.authService.postData(this.userData,'movetootherlocation').then((res) => {
                                              this.responseData = res;
                                              if(this.responseData.success){
                                                let loader = this.loadingCtrl.create({
                                                  spinner: 'hide',
                                                  cssClass: 'mainloader',
                                                  content: '<div class="moved_confirm" ><div class="main_box"><div class="added_icon"></div><div class="note hide">Note:<br> this screen will only appear for a couple of seconds<br> and then automatically revert to the stock screen</div></div></div>'
                                                });

                                                loader.present();
                                                const index = this.viewCtrl.index;
                                                setTimeout(() => {
                                                  loader.dismiss();
                                                  this.navCtrl.remove(index);
                                                  this.navCtrl.push(MovelocationPage).then(() => {

                                                  });
                                                }, 800);
                                              } else {
											   //alert(this.responseData.message);
                                                let alertmsg = this.alertCtrl.create({
                                                  title:"Alert",
                                                  message:this.responseData.message,
                                                });
                                                alertmsg.present();
                                                return false;
                                              }
                                            });
                                          }
                                        }
                                      ]
                                    });
                                    alert.present();

                                  }

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
    else{
      alert("Please select items, before moving to another location");
      return false;
    }

  }


//sample scn stock item
  samplescanstockitem(){
    this.userData = {"scanedcode": "SIH2018-018033"};
    this.authService.postData(this.userData,'getqrcodeid').then((result) => {
      this.responseData = result;
      console.log(this.responseData);
      if(this.responseData.success)
      {
        if(this.responseData.type == "qrcode"){
          var itm = document.getElementById(this.responseData.id);
          console.log(itm);
          if(itm != null){
            itm.classList.remove("orange");
            itm.classList.add("green");
            var cln = itm.cloneNode(true);

            document.getElementById("quantity_expeceted").appendChild(cln);
            itm.remove();
          }
          else{
            alert("Scanned Box is not available");
          }

        }
        else if(this.responseData.type == "warehouse"){
          localStorage.setItem("tolocationuniqueid",this.userData.scannedcode);
          localStorage.setItem("tolocation",this.responseData.id);
        }

      }
      else{
        alert(this.responseData.message);
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


//back to home
 calhome(){
    this.qrScanner.hide();
    clearInterval(this.myVar);
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
    clearInterval(this.myVar);
    this.loading.present();
    this.navCtrl.push(MovelocationPage).then(() => {
           this.loading.dismiss();
	  });
  }

  scrollTo(elementId: string) {
    let yOffset = document.getElementById('stockmovement_content').offsetTop;
    //var height = yOffset.;
    //alert(height);
    this.content.scrollTo(0, yOffset, 4000);
    // scrollToTop*/

    this.content.scrollToBottom();

  }

  //scan stock item
  scanstockitem(){
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
                            	this.userData = {"scanedcode": this.scannedCode};
								              this.qrScanner.hide();
                              let loader = this.loadingCtrl.create({
                                spinner: 'hide',
                                cssClass: 'mainloader',
                                content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
                              });

                              loader.present();
                              this.authService.postData(this.userData,'getqrcodeid').then((result) => {
                              loader.dismiss();
									              this.responseData = result;
									              console.log(this.responseData);
									              if(this.responseData.success)
                                {
                                  if(this.responseData.type == "qrcode"){
                                    var itm = document.getElementById(this.responseData.id);
                                    if(itm != null){
                                    itm.classList.remove("orange");
                                    itm.classList.add("green");
                                    var cln = itm.cloneNode(true);

                                    document.getElementById("quantity_expeceted").appendChild(cln);
                                    itm.remove();

                                    }
                                    else{
                                      alert("Scanned box not available in this location");

                                    }

                                  }
                                  else if(this.responseData.type == "warehouse"){
                                    localStorage.setItem("tolocationuniqueid",this.userData.scannedcode);
                                    localStorage.setItem("tolocation",this.responseData.id);
                                  }

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

  //opens chat
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
