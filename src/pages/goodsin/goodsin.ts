import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { DeliveryPage } from '../delivery/delivery';
import {HomePage} from '../home/home';
import {MovementPage} from '../movement/movement';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service'; 
@Component({
  selector: 'page-goodsin',
  templateUrl: 'goodsin.html'
})
export class GoodsIn {
    userDetails : any;
    responseData: any;
    channel : any;
  allUsers = [];
  myVar:any;
  messagecount : any;  
    toUser : {toUserId: string, toUserName: string};
  constructor(public navCtrl: NavController, public authService:AuthService , public chatService : ChatServiceProvider, public events: Events, public loadingCtrl: LoadingController) {
   

  }

  delivery(){
    clearInterval(this.myVar);
  	this.navCtrl.push(DeliveryPage);
  }

  //back to home
  calhome(){
    clearInterval(this.myVar);
     this.navCtrl.push(HomePage);
  }

  //good in movement
  goodsinmovement(){
  	//clearInterval(this.myVar);
  	this.navCtrl.push(MovementPage);
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

}
