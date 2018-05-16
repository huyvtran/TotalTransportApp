import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {TransportPriceServiceProvider} from "../../providers/transport-price-service/transport-price-service";

/**
 * 运价
 */

@IonicPage({
  name: 'transport-price',
  segment: 'transport-price'
})
@Component({
  selector: 'page-transport-price',
  templateUrl: 'transport-price.html',
  providers: [TransportPriceServiceProvider]
})
export class TransportPricePage {

  private resultData: any = {};

  private pageSize: number = 10;

  private pager = {
    // 总页数
    totalPageCount: 0,
    // 页面大小，即每页显示记录数
    pageSize: 10,
    // 记录总数
    totalCount: 0,
    // 当前页号
    currPageNo: 1,
    // 每页数据
    list: []
  };

  private transportPriceList = [];

  private queryParam: any = {
    startPlace: '',
    endPlace: '',
    startDate: '',
    endDate: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public transportPriceService: TransportPriceServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransportPricePage');
    this.queryParam = this.navParams.get('queryParam');
    this.queryTransportPriceData(1, this.pageSize, true);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryTransportPriceData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  doRefresh(refresher) {
    this.transportPriceList = [];
    this.queryTransportPriceData(1, this.pageSize, false, refresher);
  }

  queryTransportPriceData(page, rows, isFirstLoad?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载运价数据中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }
    this.transportPriceService.getTransportPriceListByPage(this.queryParam, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let transportPriceObj of this.pager.list) {
          this.transportPriceList.push(transportPriceObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getShipInfoListByPage fail');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getShipInfoListByPage error');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips('服务器访问超时，请稍后尝试!');
    });

  }

  goToTransportPriceDetail() {
    console.log('into detail');
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
