import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 物流任务
 */

@IonicPage({
  name: 'logistics-task',
  segment: 'logistics-task'
})
@Component({
  selector: 'page-logistics-task',
  templateUrl: 'logistics-task.html',
})
export class LogisticsTaskPage {

  //物流任务状态 0未执行 1在途 2已完成 3所有
  private taskState: any = 1;

  constructor(public navCtrl: NavController,
              public app: App,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsTaskPage');
  }

  setTaskState(state) {
    this.taskState = state;
  }

  goToLogisticsTaskTrack() {
    this.navCtrl.push('logistics-task-track');
  }

  goToLogisticsTaskAttachment() {
    this.navCtrl.push('logistics-task-attachment');
  }

}
