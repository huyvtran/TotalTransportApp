import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 物流任务查询
 */

@IonicPage({
  name: 'search-logistics-task',
  segment: 'search-logistics-task'
})
@Component({
  selector: 'page-search-logistics-task',
  templateUrl: 'search-logistics-task.html',
})
export class SearchLogisticsTaskPage {

  private queryParam: any = {
    transportType: 1,
    shipName: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchLogisticsTaskPage');
  }

  search() {
    console.log(this.queryParam);
    if (!Boolean(this.queryParam.transportType)) {
      this.alertTips('请选择运输方式！');
      return;
    }
    this.navCtrl.push('logistics-task');
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
