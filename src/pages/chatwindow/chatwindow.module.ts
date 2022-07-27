import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatwindowPage } from './chatwindow';

@NgModule({
  declarations: [
    ChatwindowPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatwindowPage),
  ],
})
export class ChatwindowPageModule {}
