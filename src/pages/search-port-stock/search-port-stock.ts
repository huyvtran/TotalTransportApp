import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 港存查询
 */

@IonicPage({
  name: 'search-port-stock',
  segment: 'search-port-stock'
})
@Component({
  selector: 'page-search-port-stock',
  templateUrl: 'search-port-stock.html',
})
export class SearchPortStockPage {

  private queryParam: any = {
    port: 1,
    wharf: 0,
    cargoName: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPortStockPage');
  }

  search() {
    console.log(this.queryParam);
    if (!Boolean(this.queryParam.port)) {
      this.alertTips('请选择港口！');
      return;
    }
    // if (!Boolean(this.queryParam.wharf)) {
    //   this.alertTips('请选择码头！');
    //   return;
    // }
    this.navCtrl.push('port-stock');
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
