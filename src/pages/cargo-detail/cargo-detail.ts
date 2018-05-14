import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CargoServiceProvider} from "../../providers/cargo-service/cargo-service";

/**
 * 货盘详情
 */

@IonicPage({
  name: 'cargo-detail',
  segment: 'cargo-detail'
})
@Component({
  selector: 'page-cargo-detail',
  templateUrl: 'cargo-detail.html',
  providers: [CargoServiceProvider]
})
export class CargoDetailPage {

  private resultData: any = {};

  private cargoInfo: any = {};

  constructor(public navCtrl: NavController,
              public app: App,
              public cargoService: CargoServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CargoDetailPage');
    let cargoId = this.navParams.get('cargoId');
    console.log(cargoId);
    this.initCargoDetail(cargoId);
  }

  initCargoDetail(cargoId) {
    let loading = this.loadingCtrl.create({
      content: '加载货盘详情数据中...'
    });
    loading.present();
    this.cargoService.getCargoInfoById(cargoId).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.cargoInfo = this.resultData.cargoInfo;
    }, err => {
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loading.dismissAll();
      this.alertTips(err);
    });
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
