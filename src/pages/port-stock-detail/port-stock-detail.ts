import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * 港存详情
 */

@IonicPage({
  name:'port-stock-detail',
  segment:'port-stock-detail'
})
@Component({
  selector: 'page-port-stock-detail',
  templateUrl: 'port-stock-detail.html',
})
export class PortStockDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PortStockDetailPage');
  }

}
