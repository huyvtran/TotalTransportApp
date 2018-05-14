import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 订单详情
 */

@IonicPage({
  name: 'order-detail',
  segment: 'order-detail'
})
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  //运输方式 waterway水路 railway铁路 highway公路
  private transportType: any = 'waterway';

  //仅供演示 订单状态 1执行中 2待收货 3待评价 4已完成
  private orderState: any = 1;

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.orderState = this.navParams.get('orderState');
  }

  setTransportType(type) {
    this.transportType = type;
  }

  goToLogisticsTaskTrack() {
    this.navCtrl.push('logistics-task-track');
  }

  goToLogisticsTaskAttachment(){
    this.navCtrl.push('logistics-task-attachment');
  }

  goToShipBaseInfo() {
    this.navCtrl.push('ship-base-info');
  }

  confirmReceiving() {
    let confirm = this.alertCtrl.create({
      title: '提示',
      message: '确认收货吗?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('Agree clicked');
            this.orderState = 3;
          }
        }
      ]
    });
    confirm.present();
  }

  goToOrderEvaluate() {
    this.navCtrl.push('order-evaluate');
  }

}
