import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 合同详情
 */

@IonicPage({
  name: 'contract-detail',
  segment: 'contract-detail'
})
@Component({
  selector: 'page-contract-detail',
  templateUrl: 'contract-detail.html',
})
export class ContractDetailPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractDetailPage');
  }

  goToOrderDetail(orderState) {
    this.navCtrl.push('order-detail', {'orderState': orderState});
  }

  goToShipBaseInfo() {
    this.navCtrl.push('ship-base-info');
  }

}
