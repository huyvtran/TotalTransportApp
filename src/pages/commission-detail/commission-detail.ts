import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 委托详情
 */

@IonicPage({
  name: 'commission-detail',
  segment: 'commission-detail'
})
@Component({
  selector: 'page-commission-detail',
  templateUrl: 'commission-detail.html',
})
export class CommissionDetailPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommissionDetailPage');
  }

}
