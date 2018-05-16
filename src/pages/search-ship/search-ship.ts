import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BaseServiceProvider} from "../../providers/base-service/base-service";

/**
 * 船盘查询
 */

@IonicPage({
  name: 'search-ship',
  segment: 'search-ship'
})
@Component({
  selector: 'page-search-ship',
  templateUrl: 'search-ship.html',
  providers: [BaseServiceProvider]
})
export class SearchShipPage {

  private resultData: any = {};

  private queryParam: any = {
    port: '',
    startDate: '',
    endDate: ''
  };

  private portList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public baseService: BaseServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchShipPage');
    this.initPort();
    let startTime = new Date();
    let endTime = new Date();
    startTime.setDate(1);
    endTime.setMonth(endTime.getMonth() + 1);
    endTime.setDate(1);
    endTime.setTime(endTime.getTime() - 24 * 60 * 60 * 1000);
    this.queryParam.startDate = this.formatDate(startTime);
    this.queryParam.endDate = this.formatDate(endTime);
  }

  initPort() {
    this.baseService.getBasePortList().then(data => {
      console.log(data);
      this.resultData = data;
      this.portList = this.resultData.basePortList;
    });
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
