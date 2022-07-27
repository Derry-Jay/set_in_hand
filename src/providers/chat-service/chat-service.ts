
import { Injectable } from '@angular/core';

import Pusher from 'pusher-js';

const pusherAppKey = 'ed71bc564da10b676dcb';
const pusherCluster = 'ap2';

/*
  Generated class for the ChatServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatMessage {
    messageId: string;
    userId: string;
    toUserId: string;
    message: string;
	datetime: number | string;
    status: number;
	profilepicture: string;
	username: string;
}

export class ChatServiceProvider {
	pusher: any;
	channel: any;
  constructor() {
	//console.log('Hello ChatService Provider');
  }

	connectPusher() {
		this.pusher = new Pusher(pusherAppKey, {
			cluster: pusherCluster
		});
	}

	getPusher(){
		return this.pusher;
	}

	setChannel(userId: string){
		this.channel = this.pusher.subscribe('user-'+userId+'-channel');
	}

	getChannel(){
		return this.channel;
	}

	unsubscribe(userId: string){
		this.channel = this.pusher.unsubscribe('user-'+userId+'-channel');
		//this.channel = this.pusher.subscribe('my-channel');
	}



}

