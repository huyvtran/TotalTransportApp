import {Component} from '@angular/core';
import {
  App, LoadingController, AlertController, IonicPage, NavController, NavParams
} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {OrderServiceProvider} from "../../providers/order-service/order-service";

/**
 * 查看评价
 */

@IonicPage({
  name: 'order-evaluate-view',
  segment: 'order-evaluate-view'
})
@Component({
  selector: 'page-order-evaluate-view',
  templateUrl: 'order-evaluate-view.html',
  providers: [StorageServiceProvider, OrderServiceProvider]
})
export class OrderEvaluateViewPage {

  private resultData: any = {};

  private orderId: any = null;

  private order: any = {};

  private rateList = [];

  private itemResult: any = {
    itemStars: [],
    content: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public orderService: OrderServiceProvider,
              public storageService: StorageServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderEvaluateViewPage');
    this.orderId = this.navParams.get('orderId');
    this.initServiceEvaItem();
  }

  initServiceEvaItem() {
    let loading = this.loadingCtrl.create({
      content: '加载评价详情中...'
    });
    loading.present();

    this.orderService.getRateByOrderId(this.orderId).then(data => {
      console.log(data);
      loading.dismissAll();
      this.resultData = data;
      this.order = this.resultData.order;
      if (Boolean(this.order.estimateContent)) {
        this.itemResult.content = this.order.estimateContent;
      }
      this.rateList = this.resultData.rateList;
      this.initItemScores();
    }, err => {
      console.log(err);
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      console.log(err);
      loading.dismissAll();
      this.alertTips('服务器访问超时，请稍后尝试！');
    });

  }

  initItemScores() {
    this.itemResult.itemStars = [];
    if (Boolean(this.rateList) && this.rateList.length > 0) {
      for (let rate of this.rateList) {
        let scoreItem = {
          itemNo: rate.itemNo,
          itemName: rate.itemName,
          star: rate.reply,
          starMap: [
            '非常不满意',
            '不满意',
            '一般',
            '满意',
            '非常满意'
          ]
        };
        this.itemResult.itemStars.push(scoreItem);
      }
    }
  }

  /*验证提醒*/
  alertTips(tips, title?, timeout?) {
    let titleTip = '提示';
    if (title) {
      titleTip = title;
    }
    let alert = this.alertCtrl.create({
      title: titleTip,
      subTitle: tips,
      buttons: ['确定']
    });
    alert.present();
    if (timeout) {
      setTimeout(() => {
        alert.dismiss();
      }, timeout);
    }

  }

}
