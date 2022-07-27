import { Component, ViewChild } from '@angular/core';
import { Content, TextInput, Platform, Keyboard, Events } from 'ionic-angular';
import { DashboardPage } from 'src/pages/dashboard/dashboard';
import { LoginPage } from 'src/pages/login/login';
import { AuthService } from 'src/providers/auth-service/auth-service';
import { ChatMessage, ChatServiceProvider } from 'src/providers/chat-service/chat-service';
import { SplashScreenOriginal } from '@awesome-cordova-plugins/splash-screen';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class MyAppComponent {
  @ViewChild(Content) content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  allUsers: any;
  rootPage: any;
  toUser: any;
  channel: any;
  editorMsg: '';
  loggeduser: any;
  responseData: any;
  msgList: ChatMessage[] = [];
  userDetails: any;
  messagecount: any;
  public_url: '';
  constructor(public platform: Platform, public keyboard: Keyboard, statusBar: StatusBar, splashScreen: SplashScreenOriginal,
     public events: Events, public chatService: ChatServiceProvider, public authService: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      if (!localStorage.getItem('isloggedin')) {
        this.rootPage = LoginPage; // user can user this.nav.setRoot(TutorialPage);
      } else {
        this.rootPage = DashboardPage; // user can user this.nav.setRoot(LoginPage);
      }
      splashScreen.hide();

      if (this.platform.is('ios')) {
        //keyboard.disableScroll(true);
      }
    });

    events.subscribe('usersLists', (allUsers: any) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      console.log('Welcome', allUsers);
      this.allUsers = [];
      this.allUsers = allUsers;
    });


  }

  /**
   * @name getMsg
   * @returns
   */

  closemessagewrap(userid: string) {
    document.getElementById('user_list_msg_count_' + userid).innerHTML = '0';
    document.getElementById('MessageUserList').style.display = 'block';
    document.getElementById('MsgtxtInput').style.display = 'none';
    document.getElementById('MessageWrap').style.display = 'none';
  }


  sendMsg() {
    if (!this.editorMsg.trim()) { return; }


    const newMsg: ChatMessage = {
      messageId: Date.now().toString(),
      userId: this.loggeduser.id,
      toUserId: this.toUser.id,
      message: this.editorMsg,
      datetime: Date.now(),
      status: 1,
      profilepicture: this.loggeduser.userAvatar,
      username: this.loggeduser.username
    };
    this.pushNewMsg(newMsg);
    this.editorMsg = '';
    //this.keyboard.close();
    document.getElementsByClassName('menu-inner')[0].classList.remove('keyboard-showup');

    this.authService.postData(newMsg, 'sendchat').then(() => {

    });
  }

  pushNewMsg(msg: ChatMessage) {
    const userId = this.loggeduser.id;
    const toUserId = this.toUser.id;
    // Verify user relationships
    console.log(msg);
    if (msg.userId === userId && msg.toUserId === toUserId) {
      this.msgList.push(msg);
    } else if (msg.toUserId === userId && msg.userId === toUserId) {
      this.msgList.push(msg);
    }
    this.scrollToBottom();
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
    document.getElementsByClassName('menu-inner')[0].classList.add('keyboard-showup');
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400);
  }

  clickk(user: { id: string; username: any }) {

    console.log('test', user.id);
    if (typeof user.id != 'undefined') {
      this.toUser = {
        id: user.id,
        name: user.username
      };
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData[0];
      console.log(this.userDetails);
      this.loggeduser = {
        id: this.userDetails.id,
        userAvatar: this.userDetails.profilepicture,
        username: this.userDetails.username,
      };
      this.channel = this.chatService.getChannel();
      this.channel.unbind('chat-to-' + user.id);


      this.channel.bind('user_typing', (map: any)=> {
        console.log(map);
      });
      this.msgList = [];
      document.getElementById('MessageUserList').style.display = 'none';
      document.getElementById('MsgtxtInput').style.display = 'block';
      document.getElementById('MessageWrap').style.display = 'block';

      //this.getMsg();
    }
  }

  private getMsg() {
    this.authService.postData('{"userId":' + this.loggeduser.id + ',"toUserId":' + this.toUser.id + '}', 'usersmessges').then(
      (result: any) => {
        this.responseData = result;
        this.public_url = this.responseData.messageData.public_url;
        if (this.responseData.messageData) {
          for (const post of this.responseData.messageData.messages) {
            this.msgList.push(post);
          }
          this.scrollToBottom();
        }
        console.log(this.channel);
        this.channel.bind('chat-to-' + this.toUser.id, function(data: { messages: {
          messageId: string;
          userId: string;
          toUserId: string;
          message: string;
          datetime: string | number;
          profilepicture: string; username: any;
}[]; }) {
          console.log(data);
          const newMsg: ChatMessage = {
            messageId: data.messages[0].messageId,
            userId: data.messages[0].userId,
            toUserId: data.messages[0].toUserId,
            message: data.messages[0].message,
            datetime: data.messages[0].datetime,
            status: 1,
            profilepicture: data.messages[0].profilepicture,
            username: data.messages[0].username
          };
          this.pushNewMsg(newMsg);
        }, this);
      });
  }
}
