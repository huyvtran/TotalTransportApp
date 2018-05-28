import {Component} from '@angular/core';
import {
  App, LoadingController, AlertController, IonicPage, NavController, NavParams,
  ViewController
} from 'ionic-angular';
import {AppConfig} from "../../app/app.config";
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {OrderServiceProvider} from "../../providers/order-service/order-service";

/**
 * 订单评价
 */

@IonicPage({
  name: 'order-evaluate',
  segment: 'order-evaluate'
})
@Component({
  selector: 'page-order-evaluate',
  templateUrl: 'order-evaluate.html',
  providers: [StorageServiceProvider, OrderServiceProvider]
})
export class OrderEvaluatePage {

  private resultData: any = {};

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0,
    //认证单位ID
    company: ''
  };

  private orderId: any = null;

  private itemList = [];

  private itemResult: any = {
    itemStars: [],
    content: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public viewCtrl: ViewController,
              public orderService: OrderServiceProvider,
              public storageService: StorageServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderEvaluatePage');
    this.orderId = this.navParams.get('orderId');
    this.initLoginUser();
    this.initServiceEvaItem();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
  }

  chooseItemScoreStar(index, e) {
    console.log(index);
    let star = parseInt(e.target.dataset.index);
    this.itemResult.itemStars[index].star = star;
  }

  initServiceEvaItem() {
    let loading = this.loadingCtrl.create({
      content: '加载评价项目中...'
    });
    loading.present();

    // setTimeout(() => {
    //   loading.dismissAll();
    //   this.itemList.push({
    //     itemNo: 1,
    //     itemName: '描述相符'
    //   });
    //   this.itemList.push({
    //     itemNo: 2,
    //     itemName: '物流服务'
    //   });
    //   this.itemList.push({
    //     itemNo: 3,
    //     itemName: '服务态度'
    //   });
    //   this.initItemScores();
    // }, 1000);

    this.orderService.getServiceEvaItem().then(data => {
      console.log(data);
      loading.dismissAll();
      this.resultData = data;
      this.itemList = this.resultData.itemList;
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

  back() {
    this.viewCtrl.dismiss({refresh: false});
  }

  initItemScores() {
    this.itemResult.itemStars = [];
    if (Boolean(this.itemList) && this.itemList.length > 0) {
      for (let item of this.itemList) {
        let scoreItem = {
          itemNo: item.itemNo,
          itemName: item.itemName,
          star: 0,
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

  submit() {
    if (Boolean(this.itemResult.itemStars) && this.itemResult.itemStars.length > 0) {
      let itemNos = [];
      let stars = [];
      for (let itemScore of this.itemResult.itemStars) {
        if (itemScore.star == 0) {
          this.alertTips('请选择服务评价星级！');
          return;
        }
        itemNos.push(itemScore.itemNo);
        stars.push(itemScore.star);
      }
      if (!Boolean(this.itemResult.content)) {
        this.alertTips('请填写服务评价描述！');
        return;
      }
      console.log('success');
      console.log(JSON.stringify(itemNos));
      console.log(JSON.stringify(stars));

      let loading = this.loadingCtrl.create({
        content: '提交中...'
      });
      loading.present();

      this.orderService.submitServiceEva(this.loginUser.id, this.orderId, JSON.stringify(itemNos), JSON.stringify(stars), this.itemResult.content).then(data => {
        console.log(data);
        loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '评价成功！',
          buttons: ['确定']
        });
        alert.present();
        alert.onDidDismiss(() => {
          this.viewCtrl.dismiss({refresh: true});
        });
      }, err => {
        console.log(err);
        loading.dismissAll();
        this.alertTips(err);
      }).catch(err => {
        console.log(err);
        loading.dismissAll();
        this.alertTips(err);
      });

      // setTimeout(() => {
      //   loading.dismissAll();
      //   let alert = this.alertCtrl.create({
      //     title: '提示',
      //     subTitle: '评价成功！',
      //     buttons: ['确定']
      //   });
      //   alert.present();
      //   alert.onDidDismiss(() => {
      //     this.viewCtrl.dismiss({refresh: true});
      //   });
      //
      // }, 1000);
    } else {
      this.alertTips('请选择评价内容！');
      return;
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
