import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Content, TextInput } from 'ionic-angular';
import { ChatServiceProvider, ChatMessage } from '../../providers/chat-service/chat-service';
import { AuthService } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the ChatwindowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatwindow',
  templateUrl: 'chatwindow.html',
})
export class ChatwindowPage {
	 @ViewChild(Content) content: Content;
	 @ViewChild('chat_input') messageInput: TextInput;
	toUser: any;
	channel: any;
	editorMsg: '';
	loggeduser: any;
	responseData: any;
	msgList: ChatMessage[] = [];
	userDetails: any;
	public_url: '';
  constructor(public navCtrl: NavController, public navParams: NavParams, public chatService: ChatServiceProvider, public authService: AuthService) {
  	this.toUser = {
		id: navParams.get('toUserId'),
		name: navParams.get('toUserName')
	};
	const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
	console.log(this.userDetails);
	this.loggeduser = {
        id: this.userDetails[0].id,
		userAvatar: this.userDetails[0].profilepicture,
		username : this.userDetails[0].username,
	};
	this.channel = this.chatService.getChannel();
	this.channel.unbind('chat-to-'+navParams.get('toUserId'));


	this.channel.bind('user_typing', function(data) {
		console.log(data);
	});
	console.log(this.channel);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatwindowPage');
  }

	//calls when view entered
  ionViewDidEnter() {
	//get message list
	this.getMsg();
  }

   /**
    * @name getMsg
    * @returns {Promise<ChatMessage[]>}
    */

		 //loads all previous messages
    private getMsg() {
		this.authService.postData('{"userId":'+this.loggeduser.id+',"toUserId":'+this.toUser.id+'}','usersmessges').then((result) => {
			this.responseData = result;
			this.public_url = this.responseData.messageData.public_url;
			if(this.responseData.messageData){
				for (const post of this.responseData.messageData.messages) {
					this.msgList.push(post);
				}
				this.scrollToBottom();
			}
			this.channel.bind('chat-to-'+this.toUser.id, function(data) {
			const newMsg: ChatMessage = {
				messageId: data.messages[0].messageId,
				userId: data.messages[0].userId,
				toUserId: data.messages[0].toUserId,
				message: data.messages[0].message,
				datetime: data.messages[0].datetime,
				status: 1,
				profilepicture:data.messages[0].profilepicture,
				username:data.messages[0].username
			};
			this.pushNewMsg(newMsg);
			},this);
		});
	}

	//sends message
	sendMsg() {
		if (!this.editorMsg.trim()) {return;}


		const newMsg: ChatMessage = {
            messageId: Date.now().toString(),
            userId: this.loggeduser.id,
            toUserId: this.toUser.id,
            message: this.editorMsg,
            datetime: Date.now(),
            status: 1,
			profilepicture:this.loggeduser.userAvatar,
			username:this.loggeduser.username
		};
		this.pushNewMsg(newMsg);
		this.editorMsg = '';
		this.authService.postData(newMsg,'sendchat').then((result) => {

		});
	}

	//calls when new message received
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
	}

	//automaically loads recent text
	scrollToBottom() {
        setTimeout(() => {
            if (this.content.scrollToBottom) {
                this.content.scrollToBottom();
            }
        }, 400);
	}


}
