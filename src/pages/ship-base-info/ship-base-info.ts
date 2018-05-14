import { Component } from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 船舶基础信息
 */

@IonicPage({
  name:'ship-base-info',
  segment:'ship-base-info'
})
@Component({
  selector: 'page-ship-base-info',
  templateUrl: 'ship-base-info.html',
})
export class ShipBaseInfoPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShipBaseInfoPage');
  }

}
