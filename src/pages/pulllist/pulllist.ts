import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, ViewController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { ChatServiceProvider } from '../../providers/chat-service/chat-service';
import { LoginPage } from '../login/login';
import { DashboardPage } from '../dashboard/dashboard';
import { QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the PulllistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pulllist',
  templateUrl: 'pulllist.html',
})
export class PulllistPage {
  scannedCode: any;
  Itemarr: any;
  parameter1: any;
  responseData: any;
  userData: any;
  tmpl: any;
  customer_name: any;
  delivery_id: any;
  qr_code_id: any;
  channel: any;
  allUsers = [];
  messagecount: any;
  datestarted: any;
  profilepicture: any;
  toUser: {toUserId: string, toUserName: string};
  mr_id: any;
  mr_number: any;
  selected_warehouseid: any;
  warehouse_arr = [];
  remaining_qty_to_be_pulled: any;

  reason: any;
  details: any;
  result: any;

  current_warehouseid: any;
    stock_count: any;


  loading = this.loadingCtrl.create({
    spinner: 'hide',
    cssClass: 'mainloader',
    content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
  });
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, public chatService: ChatServiceProvider, private push: Push, public loadingCtrl: LoadingController, public events: Events,  public navParams: NavParams, public authService: AuthService, private qrScanner: QRScanner) {
    this.loadData();
    this.profilepicture = localStorage.getItem("profilepicture");

  }

  ionViewDidEnter(){
    //alert("enter");
  }

  //calls when view loaded
  ionViewDidLoad() {
    console.log('ionViewDidLoad PulllistPage');
    localStorage.removeItem("expectedqty");
    localStorage.removeItem("quantity_pulled");
    localStorage.removeItem("qr_code_id");
    localStorage.removeItem("delivery_id");
    localStorage.removeItem("mr_number");
    localStorage.removeItem("quantity_type");
  }

  //calls when view leave page
  ionViewDidLeave(){
    localStorage.removeItem("expectedqty");
    localStorage.removeItem("quantity_pulled");
    localStorage.removeItem("qr_code_id");
    localStorage.removeItem("delivery_id");
    localStorage.removeItem("mr_number");
    localStorage.removeItem("quantity_type");
  }

  //loads customer details , stock itesm and locations
  loadData(){
   //localStorage.setItem("warehouse_id","1153");

    var elements = document.getElementsByClassName("childrow");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    this.scannedCode = '';

    this.Itemarr  = [];
    localStorage.removeItem("expectedqty");
    localStorage.removeItem("quantity_pulled");
    localStorage.removeItem("qr_code_id");
    localStorage.removeItem("delivery_id");
    localStorage.removeItem("mr_number");
    localStorage.removeItem("quantity_type");
    localStorage.removeItem("manualPull");
    this.parameter1 = this.navParams.get('param1');

     let loader = this.loadingCtrl.create({
        spinner: 'hide',
        cssClass: 'mainloader',
        content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
      });

    //   setTimeout(function(){
    //     loader.dismiss();
    //   },3000);
      //localStorage.removeItem(this.parameter1);
      loader.present();
      //this.authService.postData({"task_id": this.parameter1,"user_id":localStorage.getItem("userId")},'getstockpull').then((result) => {
        // this.authService.postData({"task_id": this.parameter1,"user_id":localStorage.getItem("userId")},'getstocking').then((result) => {

      if(localStorage.getItem(this.parameter1) != null){
            loader.dismiss();
            this.result = JSON.parse(localStorage.getItem(this.parameter1));

            this.warehouse_arr = [];
            for(var i = 0; i < parseInt(this.result.length); i++){
                this.result[i].warehouse_id = Number(this.result[i].warehouse_id);
                console.log(typeof(this.result[i].warehouse_id));
                if(this.result[i].show_qty > localStorage.getItem(this.parameter1+"remaining_qty_to_be_pulled")){
                    this.result[i].show_qty = localStorage.getItem(this.parameter1+"remaining_qty_to_be_pulled");
                }
                this.warehouse_arr.push(this.result[i].warehouseId);
                this.Itemarr.push(this.result[i]);
            }
                // this.authService.postData(
                // {
                //     "task_id": this.parameter1,
                //     "user_id":localStorage.getItem("userId")
                //     },'getstocking').then((result) => {
                //         this.responseData = result;
                //         var check_Arr = [];
                //         var check_Arr_1 = [];
                //         check_Arr = this.warehouse_arr;
                //         check_Arr_1 = this.responseData.all_warehouses_locations;
                //         var v = check_Arr.some((val) => check_Arr_1.indexOf(val) !== -1);
                //         if(v == false){
                //         this.Itemarr = [];
                //         for(var i = 0; i < parseInt(this.responseData.getStockPullItems.length); i++){
                //             this.responseData.getStockPullItems[i].warehouse_id = Number(this.responseData.getStockPullItems[i].warehouse_id);
                //             console.log(typeof(this.responseData.getStockPullItems[i].warehouse_id));
                //             this.warehouse_arr.push(this.responseData.getStockPullItems[i].warehouseId);
                //             this.Itemarr.push(this.responseData.getStockPullItems[i]);
                //         }
                //     }
                // });
            localStorage.setItem("mr_id",this.result[0].moveReqId);
            localStorage.setItem("quantity_pulled",this.result.quantityPulled);
            localStorage.setItem("manualPull",this.result.manualPull);
            this.mr_number = this.result[0].mr_number;
            this.reason = this.result[0].reason;
            this.details = this.result[0].details;
            this.customer_name = this.result[0].customer_name;
            this.datestarted = this.result[0].date_started;
            console.log(this.parameter1+"remaining_qty_to_be_pulled");
            this.remaining_qty_to_be_pulled = localStorage.getItem(this.parameter1+"remaining_qty_to_be_pulled");
            var index = this.warehouse_arr.indexOf(Number(localStorage.getItem("warehouse_id")));

                if(index < 0){
                    localStorage.removeItem("warehouse_id");
                }

                if(typeof (localStorage.getItem("warehouse_id")) != "undefined" || localStorage.getItem("warehouse_id") != null){
                    this.selected_warehouseid = localStorage.getItem("warehouse_id");
                    this.selected_warehouseid = Number(this.selected_warehouseid);
                    console.log(typeof(this.selected_warehouseid));
                }
        }else{
                this.authService.postData(
                    {
                        "task_id": this.parameter1,
                        "user_id":localStorage.getItem("userId")
                    },'getstocking').then((result) => {

                console.log(result);
                this.responseData = result;
                if(this.responseData.success){
                    loader.dismiss();
                this.warehouse_arr = [];
                localStorage.setItem("mr_id",this.responseData.getStockPullItems[0].moveReqId);
                localStorage.setItem("quantity_pulled",this.responseData.quantityPulled);
                localStorage.setItem("manualPull",this.responseData.manualPull);
                this.mr_number = this.responseData.getStockPullItems[0].mr_number;
                this.reason = this.responseData.getStockPullItems[0].reason;
                this.details = this.responseData.getStockPullItems[0].details;
                this.customer_name = this.responseData.getStockPullItems[0].customer_name;
                this.datestarted = this.responseData.getStockPullItems[0].date_started;
                this.remaining_qty_to_be_pulled = this.responseData.remaining_qty;
                for(var i = 0; i < parseInt(this.responseData.getStockPullItems.length); i++){
                    this.responseData.getStockPullItems[i].warehouse_id = Number(this.responseData.getStockPullItems[i].warehouse_id);
                    console.log(typeof(this.responseData.getStockPullItems[i].warehouse_id));
                    this.warehouse_arr.push(this.responseData.getStockPullItems[i].warehouseId);
                    this.Itemarr.push(this.responseData.getStockPullItems[i]);
                }
                if(localStorage.getItem(this.parameter1) == null){
                    localStorage.setItem(this.parameter1,JSON.stringify(this.Itemarr));
                    localStorage.setItem(this.parameter1+"remaining_qty_to_be_pulled", this.responseData.remaining_qty);
                    localStorage.setItem("task_id", this.parameter1);
                }

                var index = this.warehouse_arr.indexOf(Number(localStorage.getItem("warehouse_id")));

                if(index < 0){
                    localStorage.removeItem("warehouse_id");
                }

                if(typeof (localStorage.getItem("warehouse_id")) != "undefined" || localStorage.getItem("warehouse_id") != null){
                    this.selected_warehouseid = localStorage.getItem("warehouse_id");
                    this.selected_warehouseid = Number(this.selected_warehouseid);
                    console.log(typeof(this.selected_warehouseid));
                }
                }
                else{
                    alert("It seems Empty No boxes left, please delete this to continue this MR.");
                    return false;
                }
            });
        }



  }

  //hides camera
  hidecamera(){
    this.qrScanner.hide();
    const canclBtn = <HTMLElement>document.getElementById("qr_cancel_btn");
    canclBtn.style.display = "none";
  }

  //go back to home
  gotohome(){
    this.qrScanner.hide();

    this.loading.present();
    const index = this.viewCtrl.index;
    this.navCtrl.remove(index);
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
    });
  }

  //back to previous page
  gotoback(){
    this.qrScanner.hide();
    this.loading.present();
    this.navCtrl.push(DashboardPage).then(() => {
           this.loading.dismiss();
	  });
   }

   //expand box after scanned
   expandboxinfo1(qrcodeId,deliveryId,expectedQty,quantity_type,qty_expected,product_code,index,manualpull,warehouse_id,unique_id){
        localStorage.setItem("delivery_id",deliveryId);
        localStorage.setItem("quantity_type",quantity_type);
        localStorage.setItem("product_code",product_code);
        localStorage.setItem("qrcodevalue",qrcodeId);
        this.current_warehouseid = warehouse_id;
        console.log(this.current_warehouseid);
        let ele = document.getElementsByClassName("selected_blue");
        let getidvalue = "qrcode"+qrcodeId;
        var expcty;
        //console.log(ele[0].nextElementSibling.attributes[1].nodeValue);
        //console.log(manualpull);
        if(typeof localStorage.getItem("warehouse_id") != "undefined" && localStorage.getItem("warehouse_id") != null){
                if(manualpull == 0){
                    this.userData = {"stockcode":product_code , "task_id": this.parameter1, "qty_expectedd":expectedQty, "warehouse_id" : localStorage.getItem("warehouse_id")};
                }
                else{
                    this.userData = {"qrcodeid":qrcodeId, "task_id": this.parameter1, "qty_expectedd":expectedQty, "warehouse_id" : localStorage.getItem("warehouse_id")};
                }
                localStorage.setItem("expectedqty",expectedQty);
                this.tmpl = '';

                let tml = '';
                let loader = this.loadingCtrl.create({
                  spinner: 'hide',
                  cssClass: 'mainloader',
                  content: '<div class="custom-spinner-container"><div class="custom-spinner-box"></div><p>Retrieving Data ,Please Wait...<p></div>'
                });

                loader.present();
                var element = document.getElementsByClassName("childrow");
                        if (typeof(element) != 'undefined' && element != null)
                        {
                        while(element[0]) {
                            element[0].parentNode.removeChild(element[0]);
                        }
                    }
                if(unique_id == ele[0].id){
                    this.authService.postData(this.userData,'getStockInfo').then((result) => {
                    //this.authService.postData(this.userData,'getstockpullinfo').then((result) => {
                        this.responseData = [];
                        var element = document.getElementsByClassName("childrow");
                        if (typeof(element) != 'undefined' && element != null)
                        {
                        while(element[0]) {
                            element[0].parentNode.removeChild(element[0]);
                        }   ​
                        }
                        this.responseData = result;
                        if(this.responseData.success){
                            this.stock_count = this.responseData.get_stock_info.length;
                            console.log(this.responseData);

                             expcty = localStorage.getItem("expectedqty");
                            if(manualpull != 0 && expcty == 0){
                                var res = JSON.parse(localStorage.getItem(this.parameter1));
                                localStorage.setItem("expectedqty",this.responseData.expected_Qty);
                            }

                            if(this.stock_count > 0){
                                for(var i = 0; i < parseInt(this.responseData.get_stock_info.length); i++){
                                    tml += '<div class="pull_list_row tapbox_pull_list childrow" (click)="tapbox()" id="dynamic'+i+'">';
                                    tml += '<div class="col_empty col stockcol_1"></div>';

                                    tml += '<div class="col stockcol_2 StockItemId code'+this.responseData.get_stock_info[i].qrcodetext.replace(/\s/g,'')+' qrid_'+this.responseData.get_stock_info[i].qrCodeId+'"><span class="stock_code_cls">'+this.responseData.get_stock_info[i].stock_item_id+'</span>';

                                    tml += '<div class="Qrcodeid" style="display:none;">'+this.responseData.get_stock_info[i].qrCodeId+'</div>';


                                    tml += '<span class="sub-left-class">'+this.responseData.get_stock_info[i].qrcodetext+'</span>';
                                    tml += '<span class="sub-right-class">'+this.responseData.get_stock_info[i].qr_perbox+'</span>';
                                    tml += '</div>';
                                    tml += '<div class="col_empty col stockcol_3"></div>';
                                    tml += '<div class="col_empty col stockcol_4"></div>';
                                    tml += '</div>';
                                }

                                var d1 = document.getElementById('mainqrcode'+index);
                                d1.insertAdjacentHTML('afterend', tml);
                                loader.dismiss();
                                //this.tmpl = tml;
                                console.log(localStorage.getItem("qrcodevalue"));
                                let btn = document.querySelectorAll('.tapbox_pull_list');
                                [].forEach.call(btn, function(el) {
                                    el.addEventListener('click', function(evt){
                                    //this.tapbox(el.getAttribute("id"))
                                    console.log(evt);
                                    var elems = document.querySelectorAll(".selected");
                                    [].forEach.call(elems, function(el) {
                                        el.classList.remove("selected");
                                    });

                                    if(evt.target.className == 'Qrcodeid' || evt.target.className == 'sub-left-class' || evt.target.className == 'sub-right-class' || evt.target.className == 'stock_code_cls'){
                                        var el = evt.target.parentElement;

                                        el.className += " selected";

                                        //this.scanpalletlocation();
                                        document.getElementById("scanbutton").click();

                                    }

                                    });
                                });
                            }else{
                                localStorage.removeItem(this.parameter1+"remaining_qty_to_be_pulled");
                                localStorage.removeItem(this.parameter1);
                                this.loadData();
                                loader.dismiss();
                            }

                        }
                    });
                }else{
                    loader.dismiss();
                }
        }
        else{
            alert("Please Scan the Location First");
            return false;
        }

   }

   //calls when a box is clicked
   tapbox(e){


        var elems = document.querySelectorAll(".selected");
          [].forEach.call(elems, function(el) {
              el.classList.remove("selected");
          });

        //var e = document.getElementById(divid);
        if(e.target.className == 'Qrcodeid' || e.target.className == 'sub-left-class' || e.target.className == 'sub-right-class' || e.target.className == 'stock_code_cls'){
          var el = e.target.parentElement;

          el.className += " selected";

          this.scanpalletlocation();

        }

    }


//sample Scans particular location
scanlocation(){
    console.log(localStorage.getItem("warehouse_id"));
    if(typeof localStorage.getItem("warehouse_id") == "undefined" ||
    localStorage.getItem("warehouse_id") == null){
        localStorage.setItem("ui_id","East - GI - A - 1 - 1");
        var el = document.getElementById(localStorage.getItem("ui_id"));
        if(el != null){
            this.delivery_id = el.getElementsByClassName("ware_delivery_id")[0].innerHTML;
            this.userData = {"unique_id":localStorage.getItem("ui_id") , "delivery_id" : this.delivery_id};
            this.authService.postData(this.userData,'locationCheck').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
                if(this.responseData.success)
                {
                    window.document.querySelector('body').classList.remove('transparent-body');
                    var elems = document.querySelectorAll(".warehouse"+this.responseData.warehouse_id);
                    [].forEach.call(elems, function(el) {
                        el.classList.add("selected_blue");
                    });
                    localStorage.setItem("warehouse_id",this.responseData.warehouse_id);
                    //this.loadData();
                }
                else{
                    alert("Please select the correct location");
                }
            }, (err) => {

            });
        }
        else{
            alert("Please select the correct location");
            return false;
        }
    }
    else{
        var elems = document.getElementsByClassName("codeu4");
        this.mr_id = '';
        var qrselection = document.querySelectorAll(".selected .Qrcodeid");
        if(typeof(qrselection[0]) == "undefined"){
            alert("Please select the box and then Scan");
        }
        else{
            var qrcodeid = qrselection[0].innerHTML;

            localStorage.setItem("qr_code_id",qrcodeid);

            this.userData = {
                "qr_code_text":"tt104977",
                "stockcode":localStorage.getItem("product_code"),
                "mr_id":localStorage.getItem('mr_id'),
                "qr_code_id":localStorage.getItem("qr_code_id"),
                "warehouse_id":localStorage.getItem("warehouse_id"),
                "delivery_id" : localStorage.getItem("delivery_id")
            };
            document.querySelector(".qrid_"+qrcodeid).classList.add("codescanned");
            this.authService.postData(this.userData,'stockCheck').then((result) => {
                this.responseData = result;
                console.log(this.responseData);
                if(this.responseData.success)
                {
                    window.document.querySelector('body').classList.remove('transparent-body');

                    if(this.responseData.quantity_type != 'Box'){
                        if(confirm("Please confirm you have picked the exact amount required?")){

                            this.authService.postData(
                                {
                                    "mr_id":localStorage.getItem('mr_id'),
                                    "stockcode":localStorage.getItem("product_code"),
                                    "qr_code_id": this.responseData.qr_code_id,
                                    "expectedqty":localStorage.getItem("expectedqty"),
                                    "user_id":localStorage.getItem("userId")
                                },'stockCheckComplete').then((result) => {

                                this.responseData = result;
                                console.log(this.responseData);
                                if(this.responseData.success)
                                {
                                    var res = JSON.parse(localStorage.getItem(this.parameter1));
                                    var productarr_index = [];
                                    for(var i=0;i<res.length;i++){
                                        if(res[i].product_code == localStorage.getItem("product_code")){
                                            res[i].expectedqty = this.responseData.expected_qty;
                                        }
                                    }

                                    localStorage.setItem(this.parameter1,JSON.stringify(res));

                                    this.stock_count = this.responseData.location_qty;
                                    console.log(typeof(this.stock_count));
                                    console.log(this.stock_count);
                                    if(this.stock_count == 0){
                                        //localStorage.removeItem("warehouse_id");
                                        var data = JSON.parse(localStorage.getItem(this.parameter1));
                                        console.log("deletingData");
                                        console.log("vijay",data);
                                        for(var i=0;i<data.length;i++){
                                            // if(data[i].warehouseId == this.current_warehouseid){
                                            if(this.responseData.individual_box != 0){
                                                if(data[i].product_code == localStorage.getItem("product_code") &&
                                                data[i].qrCodeId == this.responseData.individual_box){
                                                    data.splice(i, 1);
                                                    localStorage.removeItem(this.parameter1);
                                                    localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                }
                                            }else
                                            if(this.responseData.expected_qty == 0 && this.responseData.location_qty == 0){
                                                console.log("a1"+i);
                                                console.log("productcde"+data[i].product_code);
                                                if(data[i].product_code == localStorage.getItem("product_code")){
                                                    console.log("productcode_1"+data[i].product_code);
                                                    console.log("secondcondition",data);
                                                    console.log("checki",i);
                                                    productarr_index.push(i);
                                                    //data.splice(i, 1);
                                                    //localStorage.removeItem(this.parameter1);
                                                    //localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                }
                                            }else
                                            if(data[i].warehouseId == this.current_warehouseid &&
                                                data[i].product_code == localStorage.getItem("product_code")){
                                                console.log("a2"+i);
                                                if(data[i].warehouseId != localStorage.getItem("warehouse_id")){
                                                    localStorage.removeItem("warehouse_id");
                                                }
                                                data.splice(i, 1);
                                                localStorage.removeItem(this.parameter1);
                                                localStorage.setItem(this.parameter1,JSON.stringify(data));
                                            }


                                        }
                                        if(data.length == 0 && this.responseData.remaining_qty!=0){
                                            localStorage.removeItem(this.parameter1);
                                        }
                                    }
                                    alert("Exact amount of Stock has been pulled and Stock Records updated Successfully");
                                    if(productarr_index.length > 0){
                                        var remove_productcode = JSON.parse(localStorage.getItem(this.parameter1));
                                        remove_productcode = remove_productcode.filter(function(value, index) {
                                            return productarr_index.indexOf(index) == -1;
                                        })
                                        localStorage.removeItem(this.parameter1);
                                        localStorage.setItem(this.parameter1,JSON.stringify(remove_productcode));
                                    }
                                    localStorage.removeItem("expectedqty");
                                    localStorage.removeItem("quantity_pulled");
                                    localStorage.removeItem("quantity_type");
                                    localStorage.removeItem("qr_code_id");
                                    localStorage.removeItem("delivery_id");
                                    localStorage.removeItem("mr_id");
                                    localStorage.setItem("quantity_pulled",this.responseData.quantityPulled);
                                    if(this.responseData.pull_list_completed == 1){
                                        this.qrScanner.hide();
                                        localStorage.removeItem("warehouse_id");
                                        //this.loading.present();
                                        // this.navCtrl.push(DashboardPage).then(() => {
                                        //     this.loading.dismiss();
                                        // });
                                        localStorage.removeItem(this.parameter1+"remaining_qty_to_be_pulled");
                                        localStorage.removeItem(this.parameter1);
                                        this.gotohome();
                                    }else{
                                        localStorage.setItem(this.parameter1+"remaining_qty_to_be_pulled",this.responseData.remaining_qty);
                                        this.loadData();
                                    }
                                }
                                else{
                                    this.loading.dismiss();
                                    //alert("Scanned Item Code was not matched with the system");
                                }
                            }, (err) => {
                            });
                        }
                        else{

                        }
                    }
                    else{

                        this.authService.postData(
                            {
                                "mr_id":localStorage.getItem('mr_id'),
                                "stockcode":localStorage.getItem("product_code"),
                                "expectedqty":localStorage.getItem("expectedqty"),
                                "qr_code_id": this.responseData.qr_code_id,
                                "user_id":localStorage.getItem("userId")
                            },'stockCheckComplete').then((result) => {

                            this.responseData = result;
                            console.log(this.responseData);
                            if(this.responseData.success)
                            {
                                var res = JSON.parse(localStorage.getItem(this.parameter1));
                                var productarr_index = [];
                                for(var i=0;i<res.length;i++){
                                    if(res[i].product_code == localStorage.getItem("product_code")){
                                        res[i].expectedqty = this.responseData.expected_qty;
                                    }
                                }
                                localStorage.setItem(this.parameter1,JSON.stringify(res));
                                this.stock_count = this.responseData.location_qty;
                                if(this.stock_count == 0){
                                    var data = JSON.parse(localStorage.getItem(this.parameter1));
                                    console.log("deletingData");
                                    console.log(data);
                                    for(var i=0;i<data.length;i++){
                                        if(this.responseData.individual_box != 0){
                                            if(data[i].product_code == localStorage.getItem("product_code") &&
                                            data[i].qrCodeId == this.responseData.individual_box){
                                                data.splice(i, 1);
                                                localStorage.removeItem(this.parameter1);
                                                localStorage.setItem(this.parameter1,JSON.stringify(data));
                                            }
                                        }else
                                        if(this.responseData.expected_qty == 0 && this.responseData.location_qty == 0){
                                            if(data[i].product_code == localStorage.getItem("product_code")){
                                                console.log("b1"+i);
                                                productarr_index.push(i);
                                                //data.splice(i, 1);
                                                //localStorage.removeItem(this.parameter1);
                                                //localStorage.setItem(this.parameter1,JSON.stringify(data));
                                            }
                                        }else
                                        if(data[i].warehouseId == this.current_warehouseid &&
                                            data[i].product_code == localStorage.getItem("product_code")){
                                            console.log("b2"+i);
                                            data.splice(i, 1);
                                            localStorage.removeItem(this.parameter1);
                                            localStorage.setItem(this.parameter1,JSON.stringify(data));
                                            if(data[i].warehouseId != localStorage.getItem("warehouse_id")){
                                                localStorage.removeItem("warehouse_id");
                                            }
                                            //localStorage.removeItem("warehouse_id");
                                        }
                                    }
                                    if(data.length == 0 && this.responseData.remaining_qty!=0){
                                        localStorage.removeItem(this.parameter1);
                                    }
                                }
                                alert("Stock Records updated Successfully");

                                if(productarr_index.length > 0){
                                    var remove_productcode = JSON.parse(localStorage.getItem(this.parameter1));
                                    remove_productcode = remove_productcode.filter(function(value, index) {
                                        return productarr_index.indexOf(index) == -1;
                                    })
                                    localStorage.removeItem(this.parameter1);
                                    localStorage.setItem(this.parameter1,JSON.stringify(remove_productcode));
                                }
                                localStorage.removeItem("expectedqty");

                                localStorage.removeItem("quantity_pulled");
                                localStorage.removeItem("qr_code_id");
                                localStorage.removeItem("delivery_id");
                                localStorage.removeItem("mr_id");
                                localStorage.removeItem("quantity_type");
                                localStorage.setItem("quantity_pulled",this.responseData.quantityPulled);
                                if(this.responseData.pull_list_completed == 1){
                                    localStorage.removeItem("warehouse_id");
                                    this.qrScanner.hide();
                                    localStorage.removeItem(this.parameter1+"remaining_qty_to_be_pulled");
                                    localStorage.removeItem(this.parameter1);
                                    // this.loading.present();
                                    // this.navCtrl.push(DashboardPage).then(() => {
                                    //     this.loading.dismiss();
                                    // });
                                    this.gotohome();
                                }else{
                                    localStorage.setItem(this.parameter1+"remaining_qty_to_be_pulled",this.responseData.remaining_qty);
                                    this.loadData();
                                }
                            }
                            else{
                                //this.loading.dismiss();
                                //alert("Scanned Item Code was not matched with the system");
                            }
                        }, (err) => {
                        });
                    }
                }
                else{
                    alert("Scanned Item Code was not matched with the Location");
                    document.querySelector(".qrid_"+qrcodeid).classList.remove("codescanned");
                    var elems = document.getElementsByClassName(this.scannedCode);
                    this.mr_id = '';
                    [].forEach.call(elems, function(el) {
                        el.classList.remove("selected_blue");
                    });
                    //localStorage.removeItem("expectedqty");
                    localStorage.removeItem("quantity_pulled");
                    localStorage.removeItem("qr_code_id");
                    localStorage.removeItem("delivery_id");
                    localStorage.removeItem("mr_number");
                    localStorage.removeItem("quantity_type");
                }
            }, (err) => {

            });

        }

    }
}

    //logout of app
    logout(){
        this.qrScanner.hide();
        localStorage.clear();
        //this.loading.present();

        this.authService.postData({"user_id":localStorage.getItem("userId")},'logout').then((result) => {
            this.navCtrl.setRoot(LoginPage);
        });

    }

//opens chat
    doChat(){
        //this.navCtrl.push(ChatPage);
        let loader = this.loadingCtrl.create({
                content: "Please wait..."
            });
            loader.present();
            this.authService.getData('chatlistuser/'+localStorage.getItem("userId")).then((result) => {
                this.responseData = result;
                loader.dismiss();
                if(this.responseData.userData.users.length > 0){
                     this.allUsers = [];
                    for (let post of this.responseData.userData.users) {
                        this.toUser = {
                              toUserId:post.id,
                              toUserName:post.username
                        }
                        post.nav = this.toUser;

                        this.allUsers.push(post);
                        this.events.publish('usersLists', this.allUsers);
                        document.getElementsByClassName('menu-inner')[0].classList.remove("keyboard-showup");
                        console.log(this.channel);
                        if(typeof this.channel == "undefined"){
                            this.chatService.connectPusher();
                            this.chatService.setChannel(localStorage.getItem("userId"));
                            this.channel = this.chatService.getChannel();
                        }
                        if(typeof this.channel != "undefined")  {

                            this.channel = this.chatService.getChannel();
                            this.channel.unbind('chat-to-'+post.id);

                            this.channel.bind('chat-to-'+post.id, function (data) {
                                console.log("Chat : " + data);
                                console.log(data);
                                console.log(data.message);
                            });
                        }
                    }
                }
                else{
                    this.allUsers = [];
                    this.events.publish('usersLists', this.allUsers);
                }

            }, (err) => {
                loader.dismiss();
            });
    }

    //partial complete confirm
    partialcomplete(){
        if(confirm("Are you want to mark this pull list as partially complete? This Pull will be place in the task list again?")){
            alert("Successfully marked as Partially Completed");
        }
        else{
            return false;
        }
    }

//sample Scans particular location
  scanpalletlocation(){

	  return this.qrScanner.prepare()
            .then((status: QRScannerStatus) => {
                return new Promise((resolve, reject) => {
                    if (status.authorized) {
                        	// camera permission was granted
                           window.document.querySelector('body').classList.add('transparent-body');
                        	const ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];

                        	// start scanning
                        	let scanSub = this.qrScanner.scan().subscribe((text: string) => {
                            	scanSub.unsubscribe(); // stop scanning
                                const canclBtn = <HTMLElement>document.getElementById("qr_cancel_btn");
                                canclBtn.style.display = "none";
                            	this.scannedCode = text;

                            	// hack to hide the app and show the preview
                            	ionApp.style.display = "block";
								              document.getElementsByTagName("ion-app")[0].removeAttribute("style");
                            	resolve(text);


                                if(typeof localStorage.getItem("warehouse_id") == "undefined" || localStorage.getItem("warehouse_id") == null){

                                    var el = document.getElementById(this.scannedCode);
                                    if(el != null){

                                        this.delivery_id = el.getElementsByClassName("ware_delivery_id")[0].innerHTML;

                                        this.userData = {"unique_id":this.scannedCode , "delivery_id" : this.delivery_id};

                                        this.authService.postData(this.userData,'locationCheck').then((result) => {


                                            this.responseData = result;
                                            console.log(this.responseData);
                                            if(this.responseData.success)
                                            {

                                                window.document.querySelector('body').classList.remove('transparent-body');
                                                var elems = document.querySelectorAll(".warehouse"+this.responseData.warehouse_id);
                                                [].forEach.call(elems, function(el) {
                                                    el.classList.add("selected_blue");
                                                });
                                                localStorage.setItem("warehouse_id",this.responseData.warehouse_id);
                                            }
                                            else{
                                                alert("Please select the correct location");

                                            }
                                        }, (err) => {

                                        });
                                    }
                                    else{
                                        alert("Please select the correct location");
                                        window.document.querySelector('body').classList.remove('transparent-body');
                                        return false;
                                    }
                                }
                                else{
                                    var elems = document.getElementsByClassName("code"+this.scannedCode.replace(/\s/g,''));
                                    if(typeof(elems) != "undefined"){
                                        this.mr_id = '';
                                        var sccd = this.scannedCode.replace(/\s/g,'');
                                        var qrselection = document.querySelectorAll(".selected .Qrcodeid");
                                        if(typeof(qrselection[0]) == "undefined"){
                                            alert("Please select the box and then Scan");
                                        }
                                        else{
                                            var qrcodeid = qrselection[0].innerHTML;
                                            localStorage.setItem("qr_code_id",qrcodeid);
                                            document.querySelector(".qrid_"+qrcodeid).classList.add("codescanned");
                                            this.userData = {
                                                "qr_code_text":this.scannedCode,
                                                "stockcode":localStorage.getItem("product_code"),
                                                "mr_id":localStorage.getItem('mr_id'),
                                                "qr_code_id":localStorage.getItem("qr_code_id"),
                                                "warehouse_id":localStorage.getItem("warehouse_id"),
                                                "delivery_id" : localStorage.getItem("delivery_id")
                                            };

                                            this.authService.postData(this.userData,'stockCheck').then((result) => {
                                                this.responseData = result;
                                                console.log(this.responseData);
                                                if(this.responseData.success)
                                                {
                                                    window.document.querySelector('body').classList.remove('transparent-body');

                                                    if(this.responseData.quantity_type != 'Box'){
                                                        if(confirm("Please confirm you have picked the exact amount required?")){

                                                            this.authService.postData(
                                                                {
                                                                    "mr_id":localStorage.getItem('mr_id'),
                                                                    "stockcode":localStorage.getItem("product_code"),
                                                                    "qr_code_id": this.responseData.qr_code_id,
                                                                    "expectedqty":localStorage.getItem("expectedqty"),
                                                                    "user_id":localStorage.getItem("userId")
                                                                },'stockCheckComplete').then((result) => {

                                                                this.responseData = result;
                                                                console.log(this.responseData);
                                                                if(this.responseData.success)
                                                                {
                                                                    var productarr_index = [];
                                                                    var res = JSON.parse(localStorage.getItem(this.parameter1));

                                                                    for(var i=0;i<res.length;i++){
                                                                        if(res[i].product_code == localStorage.getItem("product_code")){
                                                                            res[i].expectedqty = this.responseData.expected_qty;
                                                                        }
                                                                    }
                                                                    localStorage.setItem(this.parameter1,JSON.stringify(res));
                                                                    this.stock_count = this.responseData.location_qty;
                                                                    if(this.stock_count == 0){
                                                                        //localStorage.removeItem("warehouse_id");
                                                                        var data = JSON.parse(localStorage.getItem(this.parameter1));
                                                                        for(var i=0;i<data.length;i++){
                                                                            // if(data[i].warehouseId == this.current_warehouseid){
                                                                            if(this.responseData.individual_box != 0){
                                                                                if(data[i].product_code == localStorage.getItem("product_code") &&
                                                                                data[i].qrCodeId == this.responseData.individual_box){
                                                                                    data.splice(i, 1);
                                                                                    localStorage.removeItem(this.parameter1);
                                                                                    localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                                                }
                                                                            }else
                                                                            if(this.responseData.expected_qty == 0 && this.responseData.location_qty == 0){
                                                                                if(data[i].product_code == localStorage.getItem("product_code")){
                                                                                    productarr_index.push(i);
                                                                                    //data.splice(i, 1);
                                                                                    //localStorage.removeItem(this.parameter1);
                                                                                    //localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                                                }
                                                                            }else
                                                                            if(data[i].warehouseId == this.current_warehouseid &&
                                                                                data[i].product_code == localStorage.getItem("product_code")){
                                                                                if(data[i].warehouseId != localStorage.getItem("warehouse_id")){
                                                                                    localStorage.removeItem("warehouse_id");
                                                                                }
                                                                                data.splice(i, 1);
                                                                                localStorage.removeItem(this.parameter1);
                                                                                localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                                            }
                                                                        }
                                                                        if(data.length == 0 && this.responseData.remaining_qty!=0){
                                                                            localStorage.removeItem(this.parameter1);
                                                                        }
                                                                    }
                                                                    alert("Exact amount of Stock has been pulled and Stock Records updated Successfully");
                                                                    if(productarr_index.length > 0){
                                                                        var remove_productcode = JSON.parse(localStorage.getItem(this.parameter1));
                                                                        remove_productcode = remove_productcode.filter(function(value, index) {
                                                                            return productarr_index.indexOf(index) == -1;
                                                                        })
                                                                        localStorage.removeItem(this.parameter1);
                                                                        localStorage.setItem(this.parameter1,JSON.stringify(remove_productcode));
                                                                    }
                                                                    localStorage.removeItem("expectedqty");

                                                                    localStorage.removeItem("quantity_pulled");
                                                                    localStorage.removeItem("quantity_type");
                                                                    localStorage.removeItem("qr_code_id");
                                                                    localStorage.removeItem("delivery_id");
                                                                    localStorage.removeItem("mr_id");
                                                                    localStorage.setItem("quantity_pulled",this.responseData.quantityPulled);
                                                                    if(this.responseData.pull_list_completed == 1){
                                                                        this.qrScanner.hide();
                                                                        localStorage.removeItem("warehouse_id");
                                                                        //this.loading.present();
                                                                        // this.navCtrl.push(DashboardPage).then(() => {
                                                                        //     this.loading.dismiss();
                                                                        // });
                                                                        localStorage.removeItem(this.parameter1+"remaining_qty_to_be_pulled");
                                                                        localStorage.removeItem(this.parameter1);
                                                                        this.gotohome();
                                                                    }else{
                                                                        localStorage.setItem(this.parameter1+"remaining_qty_to_be_pulled",this.responseData.remaining_qty);
                                                                        this.loadData();
                                                                    }
                                                                }
                                                                else{
                                                                    this.loading.dismiss();
                                                                    //alert("Scanned Item Code was not matched with the system");
                                                                }
                                                            }, (err) => {
                                                            });
                                                        }
                                                        else{

                                                        }
                                                    }
                                                    else{

                                                        this.authService.postData(
                                                            {
                                                                "mr_id":localStorage.getItem('mr_id'),
                                                                "stockcode":localStorage.getItem("product_code"),
                                                                "expectedqty":localStorage.getItem("expectedqty"),
                                                                "qr_code_id": this.responseData.qr_code_id,
                                                                "user_id":localStorage.getItem("userId")
                                                            },'stockCheckComplete').then((result) => {

                                                            this.responseData = result;
                                                            console.log(this.responseData);
                                                            if(this.responseData.success)
                                                            {
                                                                var res = JSON.parse(localStorage.getItem(this.parameter1));
                                                                var productarr_index = [];
                                                                for(var i=0;i<res.length;i++){
                                                                    if(res[i].product_code == localStorage.getItem("product_code")){
                                                                        res[i].expectedqty = this.responseData.expected_qty;
                                                                    }
                                                                }
                                                                localStorage.setItem(this.parameter1,JSON.stringify(res));
                                                                this.stock_count = this.responseData.location_qty;
                                                                if(this.stock_count == 0){
                                                                    var data = JSON.parse(localStorage.getItem(this.parameter1));
                                                                    for(var i=0;i<data.length;i++){
                                                                        if(this.responseData.individual_box != 0){
                                                                            if(data[i].product_code == localStorage.getItem("product_code") &&
                                                                            data[i].qrCodeId == this.responseData.individual_box){
                                                                                data.splice(i, 1);
                                                                                localStorage.removeItem(this.parameter1);
                                                                                localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                                            }
                                                                        }else
                                                                        if(this.responseData.expected_qty == 0 && this.responseData.location_qty == 0){
                                                                            if(data[i].product_code == localStorage.getItem("product_code")){
                                                                                productarr_index.push(i);
                                                                                //data.splice(i, 1);
                                                                                //localStorage.removeItem(this.parameter1);
                                                                                //localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                                            }
                                                                        }else
                                                                        if(data[i].warehouseId == this.current_warehouseid &&
                                                                            data[i].product_code == localStorage.getItem("product_code")){
                                                                            if(data[i].warehouseId != localStorage.getItem("warehouse_id")){
                                                                                localStorage.removeItem("warehouse_id");
                                                                            }
                                                                            data.splice(i, 1);
                                                                            localStorage.removeItem(this.parameter1);
                                                                            localStorage.setItem(this.parameter1,JSON.stringify(data));
                                                                            //localStorage.removeItem("warehouse_id");
                                                                        }
                                                                    }
                                                                    if(data.length == 0 && this.responseData.remaining_qty!=0){
                                                                        localStorage.removeItem(this.parameter1);
                                                                    }
                                                                }
                                                                alert("Stock Records updated Successfully");

                                                                if(productarr_index.length > 0){
                                                                    var remove_productcode = JSON.parse(localStorage.getItem(this.parameter1));
                                                                    remove_productcode = remove_productcode.filter(function(value, index) {
                                                                        return productarr_index.indexOf(index) == -1;
                                                                    })
                                                                    localStorage.removeItem(this.parameter1);
                                                                    localStorage.setItem(this.parameter1,JSON.stringify(remove_productcode));
                                                                }
                                                                localStorage.removeItem("expectedqty");

                                                                localStorage.removeItem("quantity_pulled");
                                                                localStorage.removeItem("qr_code_id");
                                                                localStorage.removeItem("delivery_id");
                                                                localStorage.removeItem("mr_id");
                                                                localStorage.removeItem("quantity_type");
                                                                localStorage.setItem("quantity_pulled",this.responseData.quantityPulled);
                                                                if(this.responseData.pull_list_completed == 1){
                                                                    localStorage.removeItem("warehouse_id");
                                                                    this.qrScanner.hide();
                                                                    localStorage.removeItem(this.parameter1+"remaining_qty_to_be_pulled");
                                                                    localStorage.removeItem(this.parameter1);
                                                                    // this.loading.present();
                                                                    // this.navCtrl.push(DashboardPage).then(() => {
                                                                    //     this.loading.dismiss();
                                                                    // });
                                                                    this.gotohome();
                                                                }else{
                                                                    localStorage.setItem(this.parameter1+"remaining_qty_to_be_pulled",this.responseData.remaining_qty);
                                                                    this.loadData();
                                                                }
                                                            }
                                                            else{
                                                                //this.loading.dismiss();
                                                                //alert("Scanned Item Code was not matched with the system");
                                                            }
                                                        }, (err) => {
                                                        });
                                                    }
                                                }
                                                else{
                                                    alert("Scanned Item Code was not matched with the Location");
                                                    document.querySelector(".qrid_"+qrcodeid).classList.remove("codescanned");
                                                    var elems = document.getElementsByClassName(this.scannedCode);
                                                    this.mr_id = '';
                                                    [].forEach.call(elems, function(el) {
                                                        el.classList.remove("selected_blue");
                                                    });
                                                    //localStorage.removeItem("expectedqty");
                                                    localStorage.removeItem("quantity_pulled");
                                                    localStorage.removeItem("qr_code_id");
                                                    localStorage.removeItem("delivery_id");
                                                    localStorage.removeItem("mr_number");
                                                    localStorage.removeItem("quantity_type");
                                                }
                                            }, (err) => {

                                            });
                                        }

                                    }
                                    else{
                                        alert("Incorrect Qr code");
                                        return false;
                                    }

                                }
                        	});
                        // show camera preview
                        ionApp.style.display = "none";
                        this.qrScanner.show();
                        const canclBtn = <HTMLElement>document.getElementById("qr_cancel_btn");
                        canclBtn.style.display = "block";
                        setTimeout(function(){
                            ionApp.style.display = "block";
                        },500);


                    } else if (status.denied) {
                        // camera permission was permanently denied
                        // you must use QRScanner.openSettings() method to guide the user to the settings page
                        // then they can grant the permission from there
                        this.qrScanner.openSettings();
                        reject(new Error('MESSAGES.QRSCANNER.CHANGE_SETTINGS_ERROR'));
                    } else {
                        // permission was denied, but not permanently. You can ask for permission again at a later time.
                        reject(new Error('MESSAGES.QRSCANNER.PERMISSION_DENIED_ERROR'));
                    }
                })
            })
				  .catch((e: any) => console.log('Error is', e));
	}

}
