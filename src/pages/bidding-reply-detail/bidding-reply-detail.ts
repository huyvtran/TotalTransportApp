import {Component} from '@angular/core';
import {
  App,
  ModalController,
  LoadingController,
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {BiddingServiceProvider} from "../../providers/bidding-service/bidding-service";

/**
 * 竞价回复详情
 */

@IonicPage({
  name: 'bidding-reply-detail',
  segment: 'bidding-reply-detail'
})
@Component({
  selector: 'page-bidding-reply-detail',
  templateUrl: 'bidding-reply-detail.html',
  providers: [BiddingServiceProvider]
})
export class BiddingReplyDetailPage {

  private bidding: any = {};

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

  private biddingReplyList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public modalCtrl: ModalController,
              public biddingService: BiddingServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BiddingReplyPage');
    this.bidding = this.navParams.get('bidding');
    this.initBiddingReplyData();
  }

  initBiddingReplyData() {
    this.queryBiddingReplyData(1, this.pageSize, true);
  }

  goToBiddingReply() {
    let modal = this.modalCtrl.create("bidding-reply", null, {
      enableBackdropDismiss: false
    });
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.refresh)) {
        this.initBiddingReplyData();
      }
    });
  }

  doRefresh(refresher) {
    this.biddingReplyList = [];
    this.queryBiddingReplyData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryBiddingReplyData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryBiddingReplyData(page, rows, showLoading?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载竞价回复数据...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }

    this.biddingService.getOrderEnquiryReplyListById(this.bidding.id, page, rows).then(data => {
      console.log(data);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let biddingReplyObj of this.pager.list) {
          this.biddingReplyList.push(biddingReplyObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log(err);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log(err);
      if (Boolean(showLoading)) {
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
