import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BiddingServiceProvider} from "../../providers/bidding-service/bidding-service";
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";

/**
 * 竞价回复列表
 */

@IonicPage({
  name: 'bidding-reply-list',
  segment: 'bidding-reply-list'
})
@Component({
  selector: 'page-bidding-reply-list',
  templateUrl: 'bidding-reply-list.html',
  providers: [BiddingServiceProvider, StorageServiceProvider]
})
export class BiddingReplyListPage {

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

  private queryParam: any = {
    startDate: '',
    endDate: '',
    company: ''
  };

  private biddingList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public storageService: StorageServiceProvider,
              public biddingService: BiddingServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BiddingReplyListPage');
    this.queryParam.startDate = this.navParams.get('startDate');
    this.queryParam.endDate = this.navParams.get('endDate');
    this.initLoginUser();
    this.queryBiddingData(1, this.pageSize, true);
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.queryParam.company = this.loginUser.company;
    }
  }

  doRefresh(refresher) {
    this.biddingList = [];
    this.queryBiddingData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryBiddingData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryBiddingData(page, rows, showLoading?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载竞价数据中...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }

    this.biddingService.getOrderEnquiryListByPage(this.queryParam, page, rows).then(data => {
      console.log(data);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let biddingObj of this.pager.list) {
          this.biddingList.push(biddingObj);
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

  goToBiddingReplyDetail(bidding) {
    console.log(bidding);
    this.navCtrl.push('bidding-reply-detail', {bidding: bidding})
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
