import { Component } from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 物流询价详情
 */

@IonicPage({
  name:'logistics-enquiry-detail',
  segment:'logistics-enquiry-detail'
})
@Component({
  selector: 'page-logistics-enquiry-detail',
  templateUrl: 'logistics-enquiry-detail.html',
})
export class LogisticsEnquiryDetailPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsEnquiryDetailPage');
  }

}
