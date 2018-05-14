import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 运价详情
 */

@IonicPage({
  name: 'transport-price-detail',
  segment: 'transport-price-detail'
})
@Component({
  selector: 'page-transport-price-detail',
  templateUrl: 'transport-price-detail.html',
})
export class TransportPriceDetailPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransportPriceDetailPage');
  }

}
