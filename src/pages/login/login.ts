import { Component } from '@angular/core';
import { NavController,LoadingController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service/auth-service';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { TabsPage } from '../tabs/tabs';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  responseData :  any;
  userData = {"username": "","password": ""};

loading = this.loadingCtrl.create({
       spinner: 'hide',    
       content:'<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Logging in ,Please Wait...<p></div>' 
  });
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public authService : AuthService, public chatService : ChatServiceProvider) {

  }

  ionViewDidEnter() {


  }
//login
  login(){
	  this.loading.present();
  	this.authService.postData(this.userData,'login').then((result) => {
		this.loading.dismissAll();
  		this.responseData = result;
  		console.log(this.responseData);
  		if(this.responseData.userData != ''){
        console.log(this.responseData);
        // localStorage.setItem("api_token",this.responseData.api_token);
  			localStorage.setItem("isloggedin","1");
        localStorage.setItem("userId",this.responseData.userData[0].id);
        localStorage.setItem("profilepicture",this.responseData.userData[0].profilepicture);
  			localStorage.setItem('userData',JSON.stringify(this.responseData));
        this.chatService.connectPusher();
        this.chatService.setChannel(this.responseData.userData[0].id);
  			this.navCtrl.push(DashboardPage);
  		}
  		else{
            this.loading.dismissAll();
  			alert("Incorrect Username or Password");
  		}
  	}, (err) => {

  	});
  }

}
