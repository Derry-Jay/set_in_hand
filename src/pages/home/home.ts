import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { GoodsIn } from '../../pages/goodsin/goodsin';
import { ChatPage } from '../../pages/chat/chat';
import { LoginPage } from '../../pages/login/login';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  userDetails : any;
  responseData: any;
  channel : any;
  allUsers = [];
  messagecount : any;  
  toUser : {toUserId: string, toUserName: string};
  userPostData = {"user_id":"","token":"","profilepicture":""};
  userData = {"user_id":localStorage.getItem("userId")};
  myVar:any;
  constructor(platform: Platform, public navCtrl: NavController, public authService:AuthService , public chatService : ChatServiceProvider, public events: Events, public loadingCtrl: LoadingController,private push: Push) {
  if(localStorage.getItem("isloggedin") != '1'){
    this.navCtrl.push(LoginPage);
  }
  else{
      const data = JSON.parse(localStorage.getItem('userData'));
      console.log(data.userData);
      this.userDetails = data.userData[0];
      localStorage.setItem("user_id",this.userDetails.user_id);
      this.userPostData.user_id = this.userDetails.user_id;
      this.userPostData.token = this.userDetails.token;
      this.userPostData.profilepicture = this.userDetails.profilepicture;

      platform.ready().then(() => {
    this.push.hasPermission().then((res: any) => {
     if (res.isEnabled) {
      console.log('We have permission to send push notifications');
     } else {
      console.log('We don\'t have permission to send push notifications');
     }
    });
    const options: PushOptions = {
     android: {},
     ios: {
      alert: 'true',
      badge: true,
      sound: 'false'
     },
     windows: {},
     browser: {
      pushServiceURL: 'http://push.api.phonegap.com/v1/push'
     }
    };
    const pushObject: PushObject = this.push.init(options);
    pushObject.on('registration').subscribe((registration: any) => {
     console.log('device token -> ' + registration.registrationId);
     
      let linkDevice = {
       deviceToken: registration.registrationId,
       userId: this.userDetails.id
      };
      console.log("Yes Logged User");
      console.log(linkDevice);
      this.authService.postData(linkDevice,'mappingDevice').then((result) => {});
      
    });
   });

      if(typeof this.channel == "undefined"){
        this.chatService.connectPusher();
        this.chatService.setChannel(this.userDetails.id);
        this.channel = this.chatService.getChannel();
      }
  }
  /*this.myVar = setInterval(() => { 
       this.authService.getData('getUnreadMessagesCount/'+localStorage.getItem("userId")).then((result) => {
        this.responseData = result;
        //this.messagecount = this.responseData.messagesCount;
        //this.events.publish('msgCount', this.responseData.messagesCount);
        document.getElementById('user_msg_count').innerHTML = this.responseData.messagesCount;
      });
    }, 3000);*/
  


}

logout(){
     this.authService.postData(this.userData,'logout').then((result) => {

     });
     localStorage.clear();
     clearInterval(this.myVar);
     this.navCtrl.setRoot(LoginPage);
}

goodsin(){
    clearInterval(this.myVar);
	this.navCtrl.push(GoodsIn);
}

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

}