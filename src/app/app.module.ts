import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyAppComponent } from './app.component';
import { PushOriginal } from '@awesome-cordova-plugins/push';
import { LoginPage } from '../pages/login/login';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { GoodsIn } from '../pages/goodsin/goodsin';
import { DeliveryPage } from '../pages/delivery/delivery';
import { ChatPage } from '../pages/chat/chat';
import { MovementPage } from '../pages/movement/movement';
import { CompleteddeliveriesPage } from '../pages/completeddeliveries/completeddeliveries';
import { AssignlocationPage } from '../pages/assignlocation/assignlocation';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AppRoutingModule } from './app-routing.module';
import { BarcodeScannerOriginal } from '@awesome-cordova-plugins/barcode-scanner';
import { QRScannerOriginal } from '@ionic-native/qr-scanner';
import { StatusBarOriginal } from '@awesome-cordova-plugins/status-bar';
import { SplashScreenOriginal } from '@awesome-cordova-plugins/splash-screen';
import { KeyboardOriginal } from '@awesome-cordova-plugins/keyboard';
import { Component, ViewChild } from '@angular/core';
//Providers
import { AuthService } from '../providers/auth-service/auth-service';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';




@NgModule({
  declarations: [
    MyAppComponent,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    GoodsIn,
    DeliveryPage,
    ChatPage,
    MovementPage,
    CompleteddeliveriesPage,
    AssignlocationPage,
    DashboardPage,
    TabsPage, AppRoutingModule,Component,ViewChild
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyAppComponent, {
      platforms: {
        ios: {
          // These options are available in ionic-angular@2.0.0-beta.2 and up.
          scrollAssist: false,    // Valid options appear to be [true, false]
          autoFocusAssist: false,  // Valid options appear to be ['instant', 'delay', false]
          backButtonText: ''
        }
        // http://ionicframework.com/docs/v2/api/config/Config/)
      }
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyAppComponent,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    GoodsIn,
    DeliveryPage,
    ChatPage,
    MovementPage,
    CompleteddeliveriesPage,
    AssignlocationPage,
    DashboardPage,
    TabsPage
  ],
  providers: [
    StatusBarOriginal, KeyboardOriginal,
    SplashScreenOriginal, AuthService, QRScannerOriginal, ChatServiceProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BarcodeScannerOriginal,
    PushOriginal
  ]
})
export class AppModule { }

