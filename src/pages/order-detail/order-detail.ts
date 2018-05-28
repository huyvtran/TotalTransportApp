import {Component} from '@angular/core';
import {
  App, LoadingController, AlertController, IonicPage, NavController, NavParams,
  ModalController
} from 'ionic-angular';
import {OrderServiceProvider} from "../../providers/order-service/order-service";
import {AppConfig} from "../../app/app.config";
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";

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
  providers: [OrderServiceProvider, StorageServiceProvider]
})
export class OrderDetailPage {

  //运输方式 waterway水路 railway铁路 highway公路 wharf码头
  private transportType: any = 'waterway';

  private resultData: any = {};

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0,
    //认证单位ID
    company: ''
  };

  private order: any = {};

  private orderId: any = null;

  //水路运输信息
  private taskWaterwayList = [];
  //码头运输信息
  private taskWharfList = [];
  //铁路运输信息
  private taskRailwayList = [];
  //公路运输信息
  private taskHighwayList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public modalCtrl: ModalController,
              public storageService: StorageServiceProvider,
              public orderService: OrderServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.orderId = this.navParams.get('orderId');
    this.initLoginUser();
    this.initOrderDetail();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
  }

  setTransportType(type) {
    this.transportType = type;
  }

  goToLogisticsTaskTrack(taskId) {
    //物流任务类型 1：水路运输 2：铁路运输 3：公路运输 4：码头服务
    let taskType = 1;
    if (this.transportType == 'waterway') {
      taskType = 1;
    } else if (this.transportType == 'railway') {
      taskType = 2;
    } else if (this.transportType == 'highway') {
      taskType = 3;
    } else if (this.transportType == 'wharf') {
      taskType = 4;
    }
    this.navCtrl.push('logistics-task-track', {taskId: taskId, taskType: taskType});
  }

  goToLogisticsTaskAttachment(taskId) {
    //物流任务类型 1：水路运输 2：铁路运输 3：公路运输 4：码头服务
    let taskType = 1;
    if (this.transportType == 'waterway') {
      taskType = 1;
    } else if (this.transportType == 'railway') {
      taskType = 2;
    } else if (this.transportType == 'highway') {
      taskType = 3;
    } else if (this.transportType == 'wharf') {
      taskType = 4;
    }
    this.navCtrl.push('logistics-task-attachment', {taskId: taskId, taskType: taskType});
  }

  goToShipBaseInfo(vesselId) {
    this.navCtrl.push('ship-base-info', {vesselId: vesselId});
  }

  confirm() {
    let confirm = this.alertCtrl.create({
      title: '提示',
      message: '确认订单?',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确认',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: '确认中...'
            });
            loading.present();

            this.orderService.confirmOrder(this.orderId, this.loginUser.id).then(data => {
              loading.dismissAll();
              let alert = this.alertCtrl.create({
                title: '提示',
                subTitle: '恭喜你，确认订单成功!',
                buttons: ['确定']
              });
              alert.present();
              alert.onDidDismiss(() => {
                this.initOrderDetail();
              });
            }, err => {
              loading.dismissAll();
              this.alertTips(err);
            }).catch(err => {
              loading.dismissAll();
              this.alertTips(err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  confirmReceiving() {
    let confirm = this.alertCtrl.create({
      title: '提示',
      message: '确认收货?',
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
          text: '确认',
          handler: () => {
            console.log('Agree clicked');
            let loading = this.loadingCtrl.create({
              content: '确认中...'
            });
            loading.present();

            this.orderService.confirmRecive(this.orderId, this.loginUser.id).then(data => {
              loading.dismissAll();
              let alert = this.alertCtrl.create({
                title: '提示',
                subTitle: '恭喜你，确认收货成功!',
                buttons: ['确定']
              });
              alert.present();
              alert.onDidDismiss(() => {
                this.initOrderDetail();
              });
            }, err => {
              console.log(err);
              loading.dismissAll();
              this.alertTips(err);
            }).catch(err => {
              console.log(err);
              loading.dismissAll();
              this.alertTips(err);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  goToOrderEvaluate() {
    let modal = this.modalCtrl.create("order-evaluate", {orderId: this.orderId});
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.refresh)) {
        this.initOrderDetail();
      }
    });
  }

  goToOrderEvaluateView() {
    this.navCtrl.push('order-evaluate-view', {orderId: this.orderId})
  }

  initOrderDetail() {
    let loading = this.loadingCtrl.create({
      content: '加载订单详情数据中...'
    });
    loading.present();
    this.orderService.getOrderDetail(this.orderId).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.order = this.resultData.order;
      this.taskWaterwayList = this.resultData.taskWaterwayList;
      this.taskRailwayList = this.resultData.taskRailwayList;
      this.taskHighwayList = this.resultData.taskHighwayList;
      this.taskWharfList = this.resultData.taskWharfList;
    }, err => {
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
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
