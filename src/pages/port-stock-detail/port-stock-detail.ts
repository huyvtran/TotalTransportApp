import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {StockServiceProvider} from "../../providers/stock-service/stock-service";
import {AppConfig} from "../../app/app.config";

/**
 * 港存详情
 */

@IonicPage({
  name: 'port-stock-detail',
  segment: 'port-stock-detail'
})
@Component({
  selector: 'page-port-stock-detail',
  templateUrl: 'port-stock-detail.html',
})
export class PortStockDetailPage {

  private loginUser: any = {};

  private resultData: any = {};

  private groupId = null;

  private pageSize: number = 10;

  private pager: any = {
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

  private stockInfo: any = {};

  private stockDetailList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public storageService: StorageServiceProvider,
              public stockService: StockServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PortStockDetailPage');
    this.stockInfo = this.navParams.get('stockInfo');
    console.log(this.stockInfo);
    this.groupId = this.navParams.get('groupId');
    this.initLoginUser();
    this.queryStockInfoDetailData(this.loginUser, this.stockInfo.cargoName, 1, this.pageSize, this.groupId, true);
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
  }

  doRefresh(refresher) {
    this.stockDetailList = [];
    this.queryStockInfoDetailData(this.loginUser, this.stockInfo.cargoName, 1, this.pageSize, this.groupId, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryStockInfoDetailData(this.loginUser, this.stockInfo.cargoName, this.pager.currPageNo + 1, this.pageSize, this.groupId, false, infiniteScroll);
    }
  }

  queryStockInfoDetailData(user, cargoName, page, rows, groupId, showLoading?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载港存详情数据中...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }
    this.stockService.getStockInfoDetailListByPage(user, cargoName, page, rows, groupId).then(data => {
      console.log(data);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.groupId = this.resultData.groupId;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let stockDetailObj of this.pager.list) {
          this.stockDetailList.push(stockDetailObj);
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
