import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { QRScannerStatus } from '@ionic-native/qr-scanner';
import { DashboardPage } from '../dashboard/dashboard';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LoginPage } from '../login/login';
/**
 * Generated class for the CyclestockcheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cyclestockcheck',
  templateUrl: 'cyclestockcheck.html',
})
export class CyclestockcheckPage {
  parameter1: any;
  responseData: any;
  Itemarr  = [];
  formData = {quantity_update:''};
  userData: any;
  channel: any;
  allUsers = [];
  toUser: {toUserId: string; toUserName: string};
  quantity_expected = '';
  warehouse_id: any;
  scannedCode: any;
  taskId: any;
  profilepicture: any;

  myVar: any;
  classname: any;
  contentlen: any;
  Itemlength: any;
  messagecount: any;
  globalarr = {customer_name:'',created_at:'',unique_id:''};
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public chatService: ChatServiceProvider, public events: Events, public viewCtrl: ViewController, public loadingCtrl: LoadingController, public navParams: NavParams, public authService: AuthService, private alertCtrl: AlertController, private qrScanner: QRScanner) {
      window.dispatchEvent(new Event('resize'));
      this.loadData();
      this.profilepicture = localStorage.getItem('profilepicture');
      this.myVar = setInterval(() => {
         //this.authService.getData('getUnreadMessagesCount/'+localStorage.getItem("userId")).then((result) => {
          //this.responseData = result;
          //this.messagecount = this.responseData.messagesCount;
          //this.events.publish('msgCount', this.responseData.messagesCount);
          //document.getElementById('user_msg_count').innerHTML = this.responseData.messagesCount;
        //});
      }, 3000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CyclestockcheckPage');
  }

  //hides camera
   hidecamera(){
    this.qrScanner.hide();
    window.document.querySelector('body').classList.remove('transparent-body');
    const canclBtn = <HTMLElement>document.getElementById('qr_cancel_btn');
    canclBtn.style.display = 'none';
  }

  //loads stock item , Quantity expected and updated Quantity
  loadData(){
      this.Itemarr  = [];
      this.formData = {quantity_update:''};
      this.globalarr = {customer_name:'',created_at:'',unique_id:''};
      this.parameter1 = this.navParams.get('param1');
      this.responseData = '';
      this.taskId = '';
      this.userData = '';
      this.quantity_expected = '';


		  this.authService.getData('getCycleStockItems/'+this.parameter1).then((result) => {
			this.responseData = result;
			this.contentlen = parseInt(this.responseData.getStockItems);
      if(this.responseData.success){
			for(let i = 0; i < parseInt(this.responseData.getStockItems.length); i++){
				this.Itemarr.push(this.responseData.getStockItems[i]);
			}

			for(let j = 0; j < parseInt(this.responseData.getStockItems.length); j++){
			    if(this.responseData.getStockItems[j].stock_check_status == 2){
              this.classname = 'completed';
			    }
			    else{
			        this.classname = 'not completed';
			        break;
			    }
			}
      this.Itemlength = this.Itemarr.length;
      if(this.classname == 'completed' && this.Itemlength > 0){
          document.getElementById('taptocomplete').style.display = 'none';
          document.getElementById('tapofzerostock').style.display = 'none';
          document.getElementById('taptofinlaize').style.display = 'block';
      }

			this.globalarr.customer_name = this.responseData.getStockItems[0].customer_name;
			this.globalarr.created_at = this.responseData.getStockItems[0].created_at;
			this.globalarr.unique_id = this.responseData.getStockItems[0].unique_id;
			this.warehouse_id = this.responseData.getStockItems[0].warehouse_id;
			}
			else {
			  this.Itemlength = 0;
			  document.getElementById('taptocomplete').style.display = 'none';
        document.getElementById('taptofinlaize').style.display = 'none';
        document.getElementById('tapofzerostock').style.display = 'block';
			}
			this.taskId = this.parameter1;
		  }, (err) => {

		  });
  }

  //logout of app
  logout(){
     this.qrScanner.hide();
     this.authService.postData({user_id:localStorage.getItem('userId')},'logout').then((result) => {

     });
     localStorage.clear();
     clearInterval(this.myVar);
     this.loading.present();

     this.navCtrl.setRoot(LoginPage).then(() => {
           this.loading.dismiss();
    });
}

//Complete all task
  completeTofinalize(){
  	this.authService.postData({task_id: this.taskId,status: '1',type:'cycle'},'finalizeTask').then((result) => {
		  	this.responseData = result;
				console.log(this.responseData);
				if(this.responseData.success)
				{
            alert('Status Updated Successfully');
            this.loading.present();
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
            this.navCtrl.push(DashboardPage).then(() => {
            this.loading.dismiss();
        });
				}
				else{
			  		//alert("Scanned Item Code was not matched with the system");
				}
		}, (err) => {
		});
  }

  //sample scan particular stock item
  scanitem(){
    //alert(this.taskId);
    this.scannedCode = 'SIH2018-007890';
    this.userData = {task_id:this.taskId,qrCodeText: this.scannedCode,createdBy: localStorage.getItem('userId'),stockCheckStatus: '1',warehouseId: this.warehouse_id};
								this.authService.postData(this.userData,'stockBlockAndComplete').then((result) => {
									this.responseData = result;
									console.log(this.responseData);
									if(this.responseData.success)
									{
                    const split_code = this.responseData.stockitem.split('-');
                    localStorage.setItem('stockcode',split_code[0]);
										const my = document.getElementById(this.responseData.qrCodeId);
                      if(my.classList[3] == 'selected_blue')
                      {
                          const t = confirm('This code has already been scanned, would you like to scan again?');
                          if(t == true)
                          {
                            document.getElementById('quantity_expeceted').innerHTML = this.responseData.box_qty;
                            //localStorage.setItem("qrcodeid",this.responseData.qrCodeId);
                            my.classList.remove('orange');
                            my.classList.add('selected_blue');
                            this.qrScanner.hide();
                          }
                      }
                      else
                      {
                        console.log('else');
                        const elems = document.querySelectorAll('.selected_blue');
                        console.log(elems);

                        [].forEach.call(elems, function(el) {
                          console.log(el.classlist);

                            el.classList.remove('selected_blue');
                            el.classList.add('orange');
                        });
                        document.getElementById('quantity_expeceted').innerHTML = this.responseData.box_qty;
                        my.classList.remove('orange');
                        my.classList.add('selected_blue');
                        this.qrScanner.hide();
                      }
									}
									else{
                    alert(this.responseData.message);
                  }
								}, (err) => {

								});

	}

  //Select Particular Stock Item and Update zero for stock item
  selectitem(qrcodeid,stock_check_status){
    //alert(qrcodeid);
    if(stock_check_status != 2){
        const elems = document.querySelectorAll('.selected_blue');
      [].forEach.call(elems, function(el) {
        el.classList.remove('selected_blue');
        el.classList.add('orange');
      });
      const my = document.getElementById(qrcodeid);
      my.classList.remove('orange');
      my.classList.add('selected_blue');
      const t = confirm('Are you sure want to update this stock item quantity as zero?');
      if(t == true)
      {
          this.userData = {task_id:this.taskId,qrcodeid,updateQuantity:0,createdBy: localStorage.getItem('userId'),stockCheckStatus: '2',warehouseId: this.warehouse_id};
          this.authService.postData(this.userData,'updatezerostockquantity').then((result) => {
              this.responseData = result;
              console.log(this.responseData);
              if(this.responseData.success)
              {
                  alert('Updated Successfully');
                  //this.qrScanner.hide();
                  this.loadData();
              }
              else{
                alert('Scanned Item Code was not matched with the system');
              }
            }, (err) => {

          });
      }
      else{
        return false;
      }
    }
    else{
      alert('Already Updated this Stock Item');
      return false;
    }

  }

  //scan particular stock item
  scanstockitem(){
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
                              document.getElementById('qr_cancel_btn').style.display = 'none';
								              document.getElementsByTagName('ion-app')[0].removeAttribute('style');
                            	resolve(text);
                            	this.userData = {task_id:this.taskId,qrCodeText: this.scannedCode,createdBy: localStorage.getItem('userId'),stockCheckStatus: '1',warehouseId: this.warehouse_id};

								this.authService.postData(this.userData,'stockBlockAndComplete').then((result) => {
									this.responseData = result;
									console.log(this.responseData);
									if(this.responseData.success)
									{
                    const split_code = this.responseData.stockitem.split('-');
                    localStorage.setItem('stockcode',split_code[0]);
                      const my = document.getElementById(this.responseData.qrCodeId);
                      if(my.classList[3] == 'selected_blue')
                      {
                          const t = confirm('This code has already been scanned, would you like to scan again?');
                          if(t == true)
                          {
                            document.getElementById('quantity_expeceted').innerHTML = this.responseData.box_qty;
                            //localStorage.setItem("qrcodeid",this.responseData.qrCodeId);
                            my.classList.remove('orange');
                            my.classList.add('selected_blue');
                            this.qrScanner.hide();
                          }
                      }
                      else
                      {
                        console.log('else');
                        const elems = document.querySelectorAll('.selected_blue');
                        [].forEach.call(elems, function(el) {
                          console.log('val',el);
                          el.classList.remove('selected_blue');
                          el.classList.add('orange');
                        });
                        document.getElementById('quantity_expeceted').innerHTML = this.responseData.box_qty;
                        my.classList.remove('orange');
                        my.classList.add('selected_blue');
                        this.qrScanner.hide();
                      }

                        //document.getElementById("quantity_expeceted").innerHTML = this.responseData.expectedQuantity;
                                  //var my = document.getElementById(this.responseData.qrCodeId);
                                  //localStorage.setItem("qrcodeid",this.responseData.qrCodeId);
                                  //my.classList.remove("orange");
                                  //my.classList.add("selected_blue");
                                  //this.qrScanner.hide();
									}
									else{
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
                        setTimeout(function(){
                            ionApp.style.display = 'block';
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
                }))
				  .catch((e: any) => console.log('Error is', e));
  }

  //go to home
  calhome(){
    this.qrScanner.hide();
    this.loading.present();
    clearInterval(this.myVar);
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
    });
  }

  //goes to previous page
  gotoback(){

    this.loading.present();
    clearInterval(this.myVar);
    this.hidecamera();
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
    });
  }

  //Open chat and conversation
  doChat(){
    //this.navCtrl.push(ChatPage);
    const loader = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loader.present();
        this.authService.getData('chatlistuser/'+localStorage.getItem('userId')).then((result) => {
            this.responseData = result;
            loader.dismiss();
           if(this.responseData.userData.users.length > 0){
                     this.allUsers = [];
                    for (const post of this.responseData.userData.users) {
                        this.toUser = {
                              toUserId:post.id,
                              toUserName:post.username
                        };
                        post.nav = this.toUser;

                        this.allUsers.push(post);
                        this.events.publish('usersLists', this.allUsers);
                        document.getElementsByClassName('menu-inner')[0].classList.remove('keyboard-showup');
                        console.log(this.channel);
                        if(typeof this.channel == 'undefined'){
                            this.chatService.connectPusher();
                            this.chatService.setChannel(localStorage.getItem('userId'));
                            this.channel = this.chatService.getChannel();
                        }
                        if(typeof this.channel != 'undefined')  {

                            this.channel = this.chatService.getChannel();
                            this.channel.unbind('chat-to-'+post.id);

                            this.channel.bind('chat-to-'+post.id, function(data) {
                                console.log('Chat : ' + data);
                                console.log(data);
                                console.log(data.message);
                            });
                        }
                    }
                }
                else{
                    this.allUsers = [];
                    this.events.publish('usersLists', this.allUsers);
                }
        }, (err) => {
            loader.dismiss();
        });
}




//complete stock item
  completestockitem(){
      if(this.formData.quantity_update != ''){
          const confirmalert = this.alertCtrl.create({
    title: 'Confirm Quantity Change',
    message: 'You have updated the quantity of stock item '+localStorage.getItem('stockcode')+' to '+this.formData.quantity_update+'. is this Correct?',
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
          this.userData = {task_id:this.taskId,qrCodeText: this.scannedCode,updateQuantity:this.formData.quantity_update,createdBy: localStorage.getItem('userId'),stockCheckStatus: '2',warehouseId: this.warehouse_id};
					this.authService.postData(this.userData,'stockBlockAndComplete').then((result) => {
									this.responseData = result;
									console.log(this.responseData);
									if(this.responseData.success)
									{
									    document.getElementById('quantity_expeceted').innerHTML = '';
                      alert('Quantity Updated Successfully');
                      this.qrScanner.hide();
									    this.loadData();
									}
									else{
										alert('Scanned Item Code was not matched with the system');
									}
								}, (err) => {

					});
        }
      }
    ]
  });
  confirmalert.present();

      }
      else{

          this.userData = {task_id:this.taskId,qrCodeText: this.scannedCode,updateQuantity:'',createdBy: localStorage.getItem('userId'),stockCheckStatus: '2',warehouseId: this.warehouse_id};
					this.authService.postData(this.userData,'stockBlockAndComplete').then((result) => {
									this.responseData = result;
									console.log(this.responseData);
									if(this.responseData.success)
									{
                      alert('Completed Successfully');
                      this.qrScanner.hide();
									    this.loadData();
									}
									else{
										alert('Scanned Item Code was not matched with the system');
									}
								}, (err) => {

					});
			}
  }

}
