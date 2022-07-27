import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';

/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  responseData: any;
  allUsers = [];
  channel: any;
  toUser: { toUserId: string; toUserName: string };

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public authService: AuthService, public loadingCtrl: LoadingController, public chatService: ChatServiceProvider, public toastCtrl: ToastController) {

  }

  //calls automatically when view loaded
  ionViewDidLoad() {
    const loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.authService.getData('chatlistuser/' + localStorage.getItem('userId')).then((result) => {
      this.responseData = result;
      loader.dismiss();
      if (this.responseData.userData) {
        for (const post of this.responseData.userData.users) {
          this.toUser = {
            toUserId: post.id,
            toUserName: post.username
          };
          post.nav = this.toUser;
          this.allUsers = [];
          this.allUsers.push(post);
          this.events.publish('usersLists', this.allUsers);
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
    }, (err) => {
      console.log(err);
      loader.dismiss();
    });
  }


}
