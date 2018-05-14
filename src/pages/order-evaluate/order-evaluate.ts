import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

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
})
export class OrderEvaluatePage {

  private itemList = [];

  private itemResult: any = {
    itemStars: [],
    content: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderEvaluatePage');
    this.initServiceEvaItem();
  }

  chooseItemScoreStar(index, e) {
    console.log(index);
    let star = parseInt(e.target.dataset.index);
    this.itemResult.itemStars[index].star = star;
  }

  initServiceEvaItem() {
    let loading = this.loadingCtrl.create({
      content: '加载评价项数据中...'
    });
    loading.present();

    setTimeout(() => {
      loading.dismissAll();
      this.itemList.push({
        itemNo: 1,
        itemName: '描述相符'
      });
      this.itemList.push({
        itemNo: 2,
        itemName: '物流服务'
      });
      this.itemList.push({
        itemNo: 3,
        itemName: '服务态度'
      });
      this.initItemScores();
    }, 1000);


    // this.orderService.getServiceEvaItem().then(data => {
    //   console.log(data);
    //   loading.dismiss();
    //   this.resultData = data;
    //   this.itemList = this.resultData.itemList;
    //   this.initItemScores();
    // }, err => {
    //   console.log(err);
    //   loading.dismiss();
    //   this.alertTips(err);
    // }).catch(err => {
    //   console.log(err);
    //   loading.dismiss();
    //   this.alertTips('服务器访问超时，请稍后尝试！');
    // });

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
      let contents = [];
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
      console.log(JSON.stringify(contents));

      let loading = this.loadingCtrl.create({
        content: '提交中...'
      });
      loading.present();

      setTimeout(() => {
        loading.dismissAll();
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '评价成功！',
          buttons: ['确定']
        });
        alert.present();
        alert.onDidDismiss(() => {
          // this.navCtrl.push('login');
          this.navCtrl.popAll();
        });

      }, 1000);

      // this.orderService.submitServiceEva(this.loginUser.id, this.orderId, JSON.stringify(itemNos), JSON.stringify(stars), JSON.stringify(contents)).then(data => {
      //   loading.dismiss();
      //   this.toastService.presentToast('评价成功！');
      //   this.goToBack();
      // }, err => {
      //   loading.dismiss();
      //   this.alertTips(err);
      // }).catch(err => {
      //   loading.dismiss();
      //   this.alertTips(err);
      // });

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
