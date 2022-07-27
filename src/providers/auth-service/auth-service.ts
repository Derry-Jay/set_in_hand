import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { ChatMessage } from '../chat-service/chat-service';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from 'ionic-angular';
import { AppRoutingModule } from 'src/app/app-routing.module';
//live url
//let apiUrl = 'http://simia.setinhand.com/api/';
[
  BrowserModule,
  HttpClientModule,
  IonicModule.forRoot(),
  AppRoutingModule
];
// staging clone url
const apiUrl = 'https://setinhandflutter.cyb.co.uk/api/';

//staging url
// let apiUrl = 'http://setinhand-staging.cyb.co.uk/api/';

//testing url
//let apiUrl = 'http://testing.setinhand.cyb.co.uk/api/';

@Injectable()
export class AuthService {
  checkOnline: any;
  constructor(public http: HttpClient) {
    console.log('Hello AuthService Provider');
    this.checkOnline = window.navigator.onLine;

  }

  getApiUrl() {
    return apiUrl;
  }
  // serve
  getDataNourl(url: string) {
    if (this.checkOnline) {
      return new Promise((resolve, reject) => {
        const headers = new HttpHeaders({
          // 'Content-Type': 'application/json',
          accept: 'application/json'
        });
        this.http.get(url, { headers })
          .subscribe((res: { json: () => unknown }) => {
            console.log(res.json);
            resolve(res.json());
          }, (err: any) => {
            reject(err);
          });
      });
    } else {
      alert('Please check your Internet Connection');
    }
  }

  getData(type: string) {
    if (this.checkOnline) {
      return new Promise((resolve, reject) => {let headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json'
        });
        if (type === 'createuser' || type === 'getwarehousedetails' || type === 'getCompletedDeliveries' || type === 'getDeliveryDetails' || type === 'getFullStockItems' || type === 'getTasks' || type === 'getStockItems' || type === 'getCycleStockItems') {
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json'
          });
        }

        this.http.get(apiUrl + type, { headers })
          .subscribe((res: { json: () => unknown }) => {
            console.log(res.json);
            resolve(res.json());
          }, (err: any) => {
            reject(err);
          });
      });
    } else {
      alert('Please check your Internet Connection');
    }
  }


  postData(credentials: string | ChatMessage, type: string) {
    if (this.checkOnline) {
      return new Promise((resolve, reject) => {
        let headers = new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        });

        let body = '';

        // TODO: Encode the values using encodeURIComponent().
        if (type === 'login') {
          body = 'email=' + credentials.username + '&password=' + credentials.password;
        }
        else if (type === 'updateqrcode') {
          // credentials.api_token = localStorage.getItem("api_token");
          body = 'qrcodetext=' + credentials.qrcodetext + '&delivery_id=' + credentials.delivery_id +
            '&user_id=' + credentials.user_id + '&deliveryqrcodeId=' + credentials.deliveryqrcodeId;
        }
        else if (type === 'deliverycomplete' || type === 'deliverydiscrepancy') {
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          });
          // credentials.api_token = localStorage.getItem("api_token");
          body = credentials;
        }
        else if (type === 'updatebox' || type == 'usersmessges' || type == 'getstocking' || type == 'getstockpull' ||
          type == 'getstockpullinfo' || type == 'showNotification' || type == 'getdetailsbyqrcode' || type == 'getStockInfo' ||
          type == 'stockCheckComplete' || type == 'stockCheck' || type == 'locationCheck' || type == 'getStockPullPackItems' ||
          type == 'getStockPullItems' || type == 'sendchat' || type == 'mappingDevice' || type == 'getUnreadMessagesCount' ||
          type == 'getdeliveryComplete' || type == 'assignPalletLocation' || type == 'scanLocations' || type == 'stockBlockAndComplete' ||
          type == 'finalizeTask' || type == 'scanstockmovementLocations' || type == 'getqrcodeid' || type == 'movetootherlocation' ||
          type == 'getzone' || type == 'getrack' || type == 'getpalletlocations' || type == 'pulllistresponse' || 'updatezerostockquantity') {
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          });
          // credentials.api_token = localStorage.getItem("api_token");
          body = credentials;
        }
        else if (type == 'logout') {
          headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          });
          body = credentials;
        }
        else {
          // credentials.api_token = localStorage.getItem("api_token");
          body = 'created_by=' + credentials.created_by + '&delivery_Id=' + credentials.delivery_id + '&stock_code=' + credentials.stockcode + '&box=' + credentials.box + '&qty_per_box=' + credentials.qty_per_box;
        }

        this.http.post(apiUrl + type, body, { headers })
          .subscribe((res: { json: () => unknown }) => {
            resolve(res.json());
          }, (err: any) => {
            reject(err);
          });
      });
    } else {
      alert('Please check your Internet Connection');
    }
  }

}

