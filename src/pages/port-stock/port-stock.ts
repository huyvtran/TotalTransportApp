import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 港存
 */

@IonicPage({
  name: 'port-stock',
  segment: 'port-stock'
})
@Component({
  selector: 'page-port-stock',
  templateUrl: 'port-stock.html',
})
export class PortStockPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PortStockPage');
  }

  goToPortStockDetail(){
    this.navCtrl.push('port-stock-detail');
  }

}
