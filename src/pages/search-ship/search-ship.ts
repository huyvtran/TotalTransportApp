import {Component} from '@angular/core';
import {
  App,
  LoadingController,
  ModalController,
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

/**
 * 船盘查询
 */

@IonicPage({
  name: 'search-ship',
  segment: 'search-ship'
})
@Component({
  selector: 'page-search-ship',
  templateUrl: 'search-ship.html'
})
export class SearchShipPage {

  private resultData: any = {};

  private queryParam: any = {
    port: '',
    startDate: '',
    endDate: ''
  };

  private portNameTips = '请选择';

  constructor(public navCtrl: NavController,
              public app: App,
              public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchShipPage');
    let startTime = new Date();
    let endTime = new Date();
    startTime.setFullYear(startTime.getFullYear() - 1);
    startTime.setDate(1);
    endTime.setMonth(endTime.getMonth() + 1);
    endTime.setDate(1);
    endTime.setTime(endTime.getTime() - 24 * 60 * 60 * 1000);
    this.queryParam.startDate = this.formatDate(startTime);
    this.queryParam.endDate = this.formatDate(endTime);
  }

  search() {
    console.log(this.queryParam.startDate);
    console.log(this.queryParam.endDate);
    if (new Date(this.queryParam.startDate).getTime() > new Date(this.queryParam.endDate).getTime()) {
      this.alertTips('起始时间不能大于截止时间！');
      return;
    }
    this.navCtrl.push('ship', {queryParam: this.queryParam});
  }

  goToSelectBasePortModel() {
    let modal = this.modalCtrl.create('select-base-port-model', {portId: this.queryParam.port}, {
      enableBackdropDismiss: false
    });
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.selected)) {
        this.queryParam.port = data.portId;
        this.portNameTips = data.portName;
      }
    });
  }

  formatDate(date) {
    if (date) {
      let year = date.getFullYear().toString();
      let month = (date.getMonth() + 1).toString();
      if (Number(date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1).toString();
      }
      let day = date.getDate().toString();
      if (Number(date.getDate()) < 10) {
        day = '0' + date.getDate().toString();
      }
      return year + '-' + month + '-' + day;
    } else {
      return '';
    }
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
