import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

//let apiUrl = 'http://setinhand-dev.eu-west-2.elasticbeanstalk.com/public/api/';
const apiUrl = 'http://10.91.44.75/setinhand/public/api/';

@Injectable()
export class AuthService {

  constructor(public http: Http) {
    console.log('Hello AuthService Provider');
  }

  getApiUrl() {
     return apiUrl;
  }

  getDataNourl(url) {
        return new Promise((resolve, reject) => {
        const headers = new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json'
        });
        this.http.get(url,{headers})
            .subscribe(res => {
              resolve(res.json());
            }, (err) => {
              reject(err);
            });
        });
    }

   getData(type) {
        return new Promise((resolve, reject) => {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json'
        });
        if(type == 'createuser' || type == 'getwarehousedetails' || type == 'getCompletedDeliveries' || type == 'getDeliveryDetails'){
            headers = new Headers({
                'Content-Type': 'application/json',
                Accept: 'application/json'
            });
        }

        this.http.get(apiUrl + type, {headers})
            .subscribe(res => {
              resolve(res.json());
            }, (err) => {
              reject(err);
            });
        });
    }


  postData(credentials, type) {
    return new Promise((resolve, reject) => {
    	let headers = new Headers({
			'Content-Type': 'application/x-www-form-urlencoded'
		});

    let body = '';

		// TODO: Encode the values using encodeURIComponent().
    if(type == 'login'){
		   body = 'email='+credentials.username+'&password='+credentials.password;
    }
    else if(type == 'updateqrcode'){
       body = 'qrcodetext='+credentials.qrcodetext+'&itemid='+credentials.itemid;
    }
    else if(type == 'deliverycomplete'){
       body = 'delivery_id='+credentials.delivery_id;
    }
    else if(type == 'usersmessges' || type == 'sendchat' || type == 'mappingDevice' || type == 'getUnreadMessagesCount' || type == 'getdeliveryComplete' || type == 'assignPalletLocation'){
        headers = new Headers({
            'Content-Type' : 'application/json',
            Accept : 'application/json',
        });
        body = credentials;
    }
    else if(type == 'logout'){
        headers = new Headers({
            'Content-Type' : 'application/json',
            Accept : 'application/json',
        });
        body = credentials;
     }
    else{
      body = 'created_by='+credentials.created_by+'&delivery_id='+credentials.delivery_id+'&stock_code='+credentials.stockcode+'&box='+credentials.box+'&qty_per_box='+credentials.qty_per_box;
    }

     this.http.post(apiUrl + type, body, {headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });

  }
}
