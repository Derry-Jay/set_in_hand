import { Component } from '@angular/core';
import { Platform, PopoverController, IonicPage, NavController, NavParams, Events, LoadingController, ViewController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';
import { FullstocklocationPage } from '../fullstocklocation/fullstocklocation';
import { MovementPage } from '../movement/movement';
import { DeliveryPage } from '../delivery/delivery';
import { CyclestockcheckPage } from '../cyclestockcheck/cyclestockcheck';
import { LoginPage } from '../../pages/login/login';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { PushObject, PushOptions } from '@awesome-cordova-plugins/push';
import { PulllistPage } from '../pulllist/pulllist';
import { PopoverPage } from '../popover/popover';
import { WhatsthisPage } from '../whatsthis/whatsthis';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'app-page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  deliveryarr = [];
  taskarr = [];
  taskarr1 = [];
  messagecount: any;
  final_task: any;
  myVar: any;
  channel: any;
  userDetails: any;
  selectedData: any;
  userPostData = { user_id: '', token: '', profilepicture: '' };
  allUsers = [];
  toUser: { toUserId: string; toUserName: string };
  toNotify: { title: string; content: string; id: string };

  responseData: any;
  profilepicture: any;
  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(platform: Platform, public navCtrl: NavController, public popoverCtrl: PopoverController, public viewCtrl: ViewController, public navParams: NavParams, public authService: AuthService, public chatService: ChatServiceProvider, private push: Push, public loadingCtrl: LoadingController, public events: Events) {
    // this.logout();

    //Get device id and push notification
    if (localStorage.getItem('isloggedin') !== '1') {
      this.navCtrl.push(LoginPage);
    }
    else {
      const data = JSON.parse(localStorage.getItem('userData'));
      console.log(data.userData);
      this.userDetails = data.userData[0];
      localStorage.setItem('user_id', this.userDetails.user_id);
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

          const linkDevice = {
            deviceToken: registration.registrationId,
            userId: this.userDetails.id
          };
          console.log('Yes Logged User');
          console.log(linkDevice);
          this.authService.postData(linkDevice, 'mappingDevice').then((result) => { });

        });
      });


      if (typeof this.channel == 'undefined') {
        this.chatService.connectPusher();
        this.chatService.setChannel(this.userDetails.id);
        this.channel = this.chatService.getChannel();
      }
    }


    this.loadData();
    this.profilepicture = localStorage.getItem('profilepicture');
    // this.myVar = setInterval(() => {
    //      this.authService.getData('getUnreadMessagesCount/'+localStorage.getItem("userId")).then((result) => {
    //       this.responseData = result;
    //       this.messagecount = this.responseData.messagesCount;
    //       this.events.publish('msgCount', this.responseData.messagesCount);
    //       //document.getElementById('user_msg_count').innerHTML = this.responseData.messagesCount;
    //     });
    // }, 3000);
  }

  //calls after load initiated
  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');
    localStorage.removeItem('warehouse_id');

  }

  //refresh page
  doRefresh(refresher: { complete: () => void }) {
    console.log('Begin async operation', refresher);
    this.deliveryarr = [];
    this.taskarr = [];
    this.loadData();
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 5000);

  }

  //logout
  logout() {
    clearInterval(this.myVar);
    this.authService.postData({ user_id: localStorage.getItem('userId') }, 'logout').then((result) => {
    });
    localStorage.clear();
    this.loading.present();
    this.navCtrl.setRoot(LoginPage).then(() => {
      this.loading.dismiss();
    });
  }

  //loads tasks and deliveries
  loadData() {

    const loader = this.loadingCtrl.create({
      spinner: 'hide',
      cssClass: 'mainloader',
      content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
    });

    loader.present();
    this.authService.getData('getTasks').then((result) => {
      loader.dismiss();
      this.taskarr1 = [];
      this.responseData = result;
      console.log(this.responseData);
      if (this.responseData.success) {
        for (let i = 0; i < parseInt(this.responseData.tasks.deliveryDue.length, 10); i++) {
          this.deliveryarr.push(this.responseData.tasks.deliveryDue[i]);
        }
        for (let j = 0; j < parseInt(this.responseData.tasks.tasks.length, 10); j++) {
          if (this.responseData.tasks.tasks[j].status === 'Full Stock Check' || this.responseData.tasks.tasks[j].status === 'Cycle Stock Check') {
            this.taskarr1.push(this.responseData.tasks.tasks[j]);
          }
          else {
            this.taskarr.push(this.responseData.tasks.tasks[j]);
          }
        }
        this.final_task = this.taskarr1.concat(this.taskarr);
        console.log(this.final_task);
      }
      else {
        return false;
      }


    }, (err) => {
      console.log('====================================');
      console.log(err);
      console.log('====================================');
    });
  }

  //move to different tasks based on names
  movetootherpage(status: string, task_id: any) {

    if (status === 'Full Stock Check') {
      this.loading.present();

      this.navCtrl.push(FullstocklocationPage, {
        param1: task_id,
      }).then(() => {
        this.loading.dismiss();
      });
    }
    else if (status === 'Cycle Stock Check') {
      this.loading.present();

      this.navCtrl.push(CyclestockcheckPage, {
        param1: task_id,
      }).then(() => {
        this.loading.dismiss();
      });
    }
    else {
      this.navCtrl.push(PulllistPage, {
        param1: task_id,
      }).then(() => {


      });
    }
  }

  //goes to delivery page
  gotodeliverypage(delivery_id: any, allowtoredirect: string) {

    if (allowtoredirect === '1') {
      this.loading.present();
      this.navCtrl.push(DeliveryPage, {
        delivery_id,
      }).then(() => {
        this.loading.dismiss();
      });
    }
    else {
      alert('Customer has Enabled the Full Stock Check, Please wait for sometime');
      return false;
    }
  }

  //goes to whats this oage
  gotowhatsthis() {
    this.loading.present();

    this.navCtrl.push(WhatsthisPage).then(() => {
      this.loading.dismiss();
    });
  }

  //goes to goods in movement page
  goodsinmovement() {

    this.loading.present();

    this.navCtrl.push(MovementPage).then(() => {
      this.loading.dismiss();
    });
  }

  //click function for notification
  presentPopover(ev: any) {
    const listData = [];
    this.authService.postData({ user_id: localStorage.getItem('userId') }, 'showNotification').then((result) => {
      console.log(result);
      this.responseData = result;
      for (const post of this.responseData.getNotification) {
        this.toNotify = {
          title: post.title,
          id: post.id,
          content: post.username
        };
        listData.push(post);
      }
      console.log(listData);
      const popover = this.popoverCtrl.create(PopoverPage, { listData });

      popover.present({
        ev
      });

      popover.onDidDismiss(data => {
        console.log(data);
        if (data != null) {
          this.selectedData = data;
        }
      });
    });
    //let listData = [{title:"Settings",id:1},{title:"Logout",id:2},{title:"Profile",id:3},{title:"Help",id:4}]

  }

  //opens chat
  doChat() {
    //this.navCtrl.push(ChatPage);
    const loader = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loader.present();
    this.authService.getData('chatlistuser/' + localStorage.getItem('userId')).then((result) => {
      this.responseData = result;
      loader.dismiss();
      if (this.responseData.userData.users.length > 0) {
        this.allUsers = [];
        for (const post of this.responseData.userData.users) {
          this.toUser = {
            toUserId: post.id,
            toUserName: post.username
          };
          post.nav = this.toUser;

          this.allUsers.push(post);
          this.events.publish('usersLists', this.allUsers);
          document.getElementsByClassName('menu-inner')[0].classList.remove('keyboard-showup');
          console.log(this.channel);
          if (typeof this.channel == 'undefined') {
            this.chatService.connectPusher();
            this.chatService.setChannel(localStorage.getItem('userId'));
            this.channel = this.chatService.getChannel();
          }
          if (typeof this.channel != 'undefined') {

            this.channel = this.chatService.getChannel();
            this.channel.unbind('chat-to-' + post.id);

            this.channel.bind('chat-to-' + post.id, function (data: string) {
              console.log('Chat : ' + data);
              console.log(data);
              console.log(data.message);
            });
          }
        }
      }
      else {
        this.allUsers = [];
        this.events.publish('usersLists', this.allUsers);
      }
    }, (err) => {
      console.log(err);
      loader.dismiss();
    });
  }

}
