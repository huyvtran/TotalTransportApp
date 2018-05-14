import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 新闻公告列表
 */

@IonicPage({
  name: 'notice-list',
  segment: 'notice-list'
})
@Component({
  selector: 'page-notice-list',
  templateUrl: 'notice-list.html',
})
export class NoticeListPage {

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoticeListPage');
  }

  goToNotice(type) {
    this.navCtrl.push('notice', {noticeType: type});
  }

  goToNoticeDetail() {
    this.navCtrl.push('notice-detail');
  }

}
