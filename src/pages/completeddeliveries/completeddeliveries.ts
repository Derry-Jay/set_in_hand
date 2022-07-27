import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, ViewController, LoadingController, Events  } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { AssignlocationPage } from '../assignlocation/assignlocation';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { DashboardPage } from '../dashboard/dashboard';
import { MovementPage } from '../movement/movement';

/**
 * Generated class for the CompleteddeliveriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-completeddeliveries',
  templateUrl: 'completeddeliveries.html',
})
export class CompleteddeliveriesPage {
@ViewChild(Content) content: Content;
  responseData: any;
  channel: any;
  allUsers = [];
  profilepicture: any;
  toUser: {toUserId: string; toUserName: string};
  DeliveryArr = [];
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public events: Events, public chatService: ChatServiceProvider, private push: Push, public loadingCtrl: LoadingController, public navParams: NavParams,public authService: AuthService) {
	this.LoadData();
  this.profilepicture = localStorage.getItem('profilepicture');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CompleteddeliveriesPage');
  }

  //Loads complete deliveries Data
  LoadData(){
    this.loading.present();
	this.authService.getData('getCompletedDeliveries').then((result) => {
    this.loading.dismiss();
		this.responseData = result;


		if(this.responseData.success)
		{
			if(this.responseData.DeliveryData.length > 0){
				for(let i = 0; i < parseInt(this.responseData.DeliveryData.length); i++){
					this.DeliveryArr.push(this.responseData.DeliveryData[i]);
				}
				console.log(this.DeliveryArr);
			}
		}
	}, (err) => {

    });
  }

  //goes to previous page
  gotoback(){
    //this.loading.present();
    //const index = this.viewCtrl.index;
    //this.navCtrl.remove(index);
    this.navCtrl.push(MovementPage).then(() => {
           //this.loading.dismiss();
	  });
  }

  //goto home page
  calhome(){
    //this.loading.present();
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
           //this.loading.dismiss();
	  });
  }

  //go to assign location page
  Gotoassignlocation(deliveryid){

	  this.navCtrl.push(AssignlocationPage, {
		param1: deliveryid
	}).then(() => {
          const index = this.viewCtrl.index;
          this.navCtrl.remove(index);
      });
  }

  //Open chat
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

    //scroll to bottom of text
    scrollTo(elementId: string){
		  this.content.scrollToBottom();
	  }

}
