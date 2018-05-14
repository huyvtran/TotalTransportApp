import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 物流任务跟踪
 */

@IonicPage({
  name: 'logistics-task-track',
  segment: 'logistics-task-track'
})
@Component({
  selector: 'page-logistics-task-track',
  templateUrl: 'logistics-task-track.html',
})
export class LogisticsTaskTrackPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsTaskTrackPage');
  }

}
