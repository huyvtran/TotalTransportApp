import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 物流任务(服务商)查询
 */

@IonicPage({
  name: 'search-logistics-task-provider',
  segment: 'search-logistics-task-provider'
})
@Component({
  selector: 'page-search-logistics-task-provider',
  templateUrl: 'search-logistics-task-provider.html',
})
export class SearchLogisticsTaskProviderPage {

  private queryParam: any = {
    //运输方式 1水路运输 2铁路运输 3公路运输 4码头运输
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
    console.log('ionViewDidLoad SearchLogisticsTaskProviderPage');
  }

  search() {
    console.log(this.queryParam);
    if (!Boolean(this.queryParam.transportType)) {
      this.alertTips('请选择运输方式！');
      return;
    }
    this.navCtrl.push('logistics-task-provider', {queryParam: this.queryParam});
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
