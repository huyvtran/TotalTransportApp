import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 新闻公告
 */

@IonicPage({
  name: 'notice',
  segment: 'notice'
})
@Component({
  selector: 'page-notice',
  templateUrl: 'notice.html',
})
export class NoticePage {

  private noticeType: any = '新闻';

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.noticeType = this.navParams.get('noticeType');
    console.log('ionViewDidLoad NoticePage');
  }

  goToNoticeDetail() {
    this.navCtrl.push('notice-detail');
  }

}
