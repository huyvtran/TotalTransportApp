import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {EnquiryServiceProvider} from "../../providers/enquiry-service/enquiry-service";

/**
 * 物流询价详情
 */

@IonicPage({
  name: 'logistics-enquiry-detail',
  segment: 'logistics-enquiry-detail'
})
@Component({
  selector: 'page-logistics-enquiry-detail',
  templateUrl: 'logistics-enquiry-detail.html',
  providers: [EnquiryServiceProvider]
})
export class LogisticsEnquiryDetailPage {

  private resultData: any = {};

  private enquiryId: any;

  private enquiry: any = {};

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

  private enquiryReplyList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public enquiryService: EnquiryServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsEnquiryDetailPage');
    this.enquiryId = this.navParams.get('enquiryId');
    this.initEnquiryDetail();
    this.initEnquiryReplyList();
  }

  initEnquiryDetail() {
    let loading = this.loadingCtrl.create({
      content: '加载询价详情中...'
    });
    loading.present();
    this.enquiryService.getEnquiryById(this.enquiryId).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.enquiry = this.resultData.enquiry;
    }, err => {
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loading.dismissAll();
      this.alertTips(err);
    });
  }

  initEnquiryReplyList() {
    this.queryEnquiryData(1, this.pageSize, false);
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
      content: '加载回复列表中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }
    this.enquiryService.getEnquiryReplyListByPage(this.enquiryId, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let enquiryReplyObj of this.pager.list) {
          this.enquiryReplyList.push(enquiryReplyObj);
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
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
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
