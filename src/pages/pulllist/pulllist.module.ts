import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PulllistPage } from './pulllist';

@NgModule({
  declarations: [
    PulllistPage,
  ],
  imports: [
    IonicPageModule.forChild(PulllistPage),
  ],
})
export class PulllistPageModule {}
