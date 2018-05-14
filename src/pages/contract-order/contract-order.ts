import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 合同订单
 */

@IonicPage({
  name: 'contract-order',
  segment: 'contract-order'
})
@Component({
  selector: 'page-contract-order',
  templateUrl: 'contract-order.html',
})
export class ContractOrderPage {

  //合同状态 execute执行中 close已关闭 all所有
  private contractState: any = 'execute';

  constructor(public navCtrl: NavController,
              public app: App,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractOrderPage');
  }

  setContractState(state) {
    this.contractState = state;
  }

  goToContractDetail() {
    this.navCtrl.push('contract-detail');
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
