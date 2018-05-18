import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {OrderServiceProvider} from "../../providers/order-service/order-service";

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
  providers: [OrderServiceProvider]
})
export class LogisticsTaskTrackPage {

  private taskId: any = null;

  private taskType: any = null;

  private resultData: any = {};

  private trackList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public orderService: OrderServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsTaskTrackPage');
    this.taskId = this.navParams.get('taskId');
    this.taskType = this.navParams.get('taskType');
    this.initTaskDetail();
  }

  initTaskDetail() {
    console.log('taskId:' + this.taskId);
    console.log('taskType:' + this.taskType);
    let loading = this.loadingCtrl.create({
      content: '加载物流任务详情中...'
    });
    loading.present();

    this.orderService.getTrackInfo(this.taskType, this.taskId).then(data => {
      console.log(data);
      loading.dismissAll();
      this.resultData = data;
      this.trackList = this.resultData.trackList;
    }, err => {
      console.log('getTrackInfo fail');
      console.log(err);
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      console.log('getTrackInfo error');
      console.log(err);
      loading.dismissAll();
      this.alertTips(err);
    });
  }

  /*验证提醒*/
  alertTips(tips, title?, timeout?) {
    let titleTip = '提示';
    if (title) {
      titleTip = title;
    }
    let alert = this.alertCtrl.create({
      title: titleTip,
      subTitle: tips,
      buttons: ['确定']
    });
    alert.present();
    if (timeout) {
      setTimeout(() => {
        alert.dismiss();
      }, timeout);
    }

  }

}
