import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BaseServiceProvider} from "../../providers/base-service/base-service";

/**
 * 船舶基础信息
 */

@IonicPage({
  name: 'ship-base-info',
  segment: 'ship-base-info'
})
@Component({
  selector: 'page-ship-base-info',
  templateUrl: 'ship-base-info.html',
  providers: [BaseServiceProvider]
})
export class ShipBaseInfoPage {

  private vesselId: any = '';

  private resultData: any = {};

  private vesselInfo: any = {};

  constructor(public navCtrl: NavController,
              public app: App,
              public baseService: BaseServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShipBaseInfoPage');
    this.vesselId = this.navParams.get('vesselId');
    this.initVesselInfo();
  }

  initVesselInfo() {
    let loading = this.loadingCtrl.create({
      content: '加载船舶详情数据中...'
    });
    loading.present();
    this.baseService.queryVesselInfo(this.vesselId).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.vesselInfo = this.resultData.baseVessel;
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
