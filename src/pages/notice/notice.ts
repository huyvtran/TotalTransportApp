import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {NoticeServiceProvider} from "../../providers/notice-service/notice-service";

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
  providers: [NoticeServiceProvider]
})
export class NoticePage {

  private resultData: any = {};

  private pageSize: number = 10;

  private pager = {
    // 总页数
    totalPageCount: 0,
    // 页面大小，即每页显示记录数
    pageSize: 5,
    // 记录总数
    totalCount: 0,
    // 当前页号
    currPageNo: 1,
    // 每页数据
    list: []
  };

  private noticeList = [];

  private noticeType: any = '新闻';

  constructor(public navCtrl: NavController,
              public app: App,
              public noticeService: NoticeServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // this.noticeType = this.navParams.get('noticeType');
    this.noticeType = '新闻公告';
    console.log('ionViewDidLoad NoticePage');
    this.queryNoticeData(1, this.pageSize, true);
  }

  goToNoticeDetail(noticeId) {
    this.navCtrl.push('notice-detail', {noticeId: noticeId});
  }

  doRefresh(refresher) {
    this.noticeList = [];
    this.queryNoticeData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryNoticeData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryNoticeData(page, rows, isFirstLoad?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载公告数据中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }
    this.noticeService.getSysNoticeListByPage(null, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let noticeObj of this.pager.list) {
          this.noticeList.push(noticeObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getSysNoticeListByPage fail');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getSysNoticeListByPage error');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips('服务器访问超时，请稍后尝试!');
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
