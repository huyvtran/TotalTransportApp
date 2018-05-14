import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 船盘详情
 */

@IonicPage({
  name: 'ship-detail',
  segment: 'ship-detail'
})
@Component({
  selector: 'page-ship-detail',
  templateUrl: 'ship-detail.html',
})
export class ShipDetailPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShipDetailPage');
  }

}
