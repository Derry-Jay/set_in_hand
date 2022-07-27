import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, Events } from 'ionic-angular';
import { CompleteddeliveriesPage } from '../completeddeliveries/completeddeliveries';
import { DashboardPage } from '../dashboard/dashboard';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LoginPage } from '../login/login';
import { MovelocationPage } from '../movelocation/movelocation';
/**
 * Generated class for the MovementPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-movement',
  templateUrl: 'movement.html',
})
export class MovementPage {
  channel : any;
  allUsers = [];
  responseData : any;
  profilepicture : any;
  toUser : {toUserId: string, toUserName: string};
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public authService : AuthService, public chatService : ChatServiceProvider, private push: Push, public viewCtrl : ViewController, public loadingCtrl : LoadingController) {
    this.profilepicture = localStorage.getItem("profilepicture");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MovementPage');
  }

  //go previous page
  gotoback(){

    //this.loading.present();
    this.navCtrl.push(DashboardPage).then(() => {
          //this.loading.dismiss();

    });
  }

  logout(){

     this.authService.postData({"user_id":localStorage.getItem("userId")},'logout').then((result) => {

     });
     localStorage.clear();

     this.loading.present();

     this.navCtrl.setRoot(LoginPage).then(() => {
           this.loading.dismiss();
    });
  }

  //go to home page
  calhome(){
    this.loading.present();
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
    });
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
                else{
                    this.allUsers = [];
                    this.events.publish('usersLists', this.allUsers);
                }

        }, (err) => {
            loader.dismiss();
        });
}


//goes to pallet location
  movetopalletlocation(){
	  this.navCtrl.push(CompleteddeliveriesPage);
  }

  //goes to stock movement page
  stockmovement(){
    this.navCtrl.push(MovelocationPage);
  }

}
