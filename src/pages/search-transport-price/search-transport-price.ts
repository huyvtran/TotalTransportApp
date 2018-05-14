import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 运价查询
 */

@IonicPage({
  name: 'search-transport-price',
  segment: 'search-transport-price'
})
@Component({
  selector: 'page-search-transport-price',
  templateUrl: 'search-transport-price.html',
})
export class SearchTransportPricePage {

  private queryParam: any = {
    startPlace: '1',
    endPlace: '2',
    startDate: '',
    endDate: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchTransportPricePage');
    let startTime = new Date();
    let endTime = new Date();
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
    this.navCtrl.push('transport-price');
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
