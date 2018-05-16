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
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {EnquiryServiceProvider} from "../../providers/enquiry-service/enquiry-service";
import {AppConfig} from "../../app/app.config";


/**
 * 物流询价
 */

@IonicPage({
  name: 'logistics-enquiry',
  segment: 'logistics-enquiry'
})
@Component({
  selector: 'page-logistics-enquiry',
  templateUrl: 'logistics-enquiry.html',
  providers: [StorageServiceProvider, EnquiryServiceProvider]
})
export class LogisticsEnquiryPage {

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

  private enquiry = {
    requestUser: null
  };

  private enquiryList = [];

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public storageService: StorageServiceProvider,
              public enquiryService: EnquiryServiceProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsEnquiryPage');
    this.initLoginUser();
    this.initEnquiryData();
  }

  refresh() {
    console.log('into refresh');
    this.initEnquiryData();
  }

  goToEnquiry() {
    let modal = this.modalCtrl.create("enquiry");
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.refresh)) {
        this.refresh();
      }
    });
  }

  goToLogisticsEnquiryDetail(enquiryId) {
    this.navCtrl.push('logistics-enquiry-detail', {enquiryId: enquiryId});
  }

  initEnquiryData() {
    this.enquiryList = [];
    this.queryEnquiryData(1, this.pageSize, true);
  }

  doRefresh(refresher) {
    this.enquiryList = [];
    this.queryEnquiryData(1, this.pageSize, false, refresher);
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.enquiry.requestUser = this.loginUser.id;
    }
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryEnquiryData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryEnquiryData(page, rows, isFirstLoad?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载询价数据中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }
    this.enquiryService.getEnquiryListByPage(this.enquiry, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let enquiryObj of this.pager.list) {
          this.enquiryList.push(enquiryObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getEnquiryListByPage fail');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getEnquiryListByPage error');
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
