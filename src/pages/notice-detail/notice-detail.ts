import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NoticeServiceProvider} from "../../providers/notice-service/notice-service";

/**
 * 新闻公告详情
 */

@IonicPage({
  name: 'notice-detail',
  segment: 'notice-detail'
})
@Component({
  selector: 'page-notice-detail',
  templateUrl: 'notice-detail.html',
  providers: [NoticeServiceProvider]
})
export class NoticeDetailPage {

  private resultData: any = {};

  private notice: any = {};

  constructor(public navCtrl: NavController,
              public app: App,
              public noticeService: NoticeServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewsDetailPage');
    let noticeId = this.navParams.get('noticeId');
    this.initNoticeDetail(noticeId);
  }

  initNoticeDetail(noticeId) {
    let loading = this.loadingCtrl.create({
      content: '加载公告数据中...'
    });
    loading.present();
    this.noticeService.getSysNoticeById(noticeId).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.notice = this.resultData.sysNotice;
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
