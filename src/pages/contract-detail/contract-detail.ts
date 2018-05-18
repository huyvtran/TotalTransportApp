import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ContractServiceProvider} from "../../providers/contract-service/contract-service";
import {OrderServiceProvider} from "../../providers/order-service/order-service";

/**
 * 合同详情
 */

@IonicPage({
  name: 'contract-detail',
  segment: 'contract-detail'
})
@Component({
  selector: 'page-contract-detail',
  templateUrl: 'contract-detail.html',
  providers: [ContractServiceProvider, OrderServiceProvider]
})
export class ContractDetailPage {

  private contractId: any = '';

  private resultData: any = {};

  private contract: any = {};

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

  private pageSize: number = 10;

  private orderList = [];

  private queryParam: any = {
    contractId: '',
    cargoOwner: '',
    auditStatus: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public orderService: OrderServiceProvider,
              public contractService: ContractServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractDetailPage');
    this.contractId = this.navParams.get('contractId');
    this.queryParam.contractId = this.contractId;
    this.initContractDetail();
    this.doRefresh();
  }

  initContractDetail() {
    let loading = this.loadingCtrl.create({
      content: '加载合同详情数据中...'
    });
    loading.present();
    this.contractService.getShipperContractById(this.contractId).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.contract = this.resultData.shipperContract;
    }, err => {
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loading.dismissAll();
      this.alertTips(err);
    });
  }

  doRefresh(refresher?) {
    this.orderList = [];
    this.queryOrderData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll?) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    } else {
      this.queryOrderData(this.pager.currPageNo + 1, this.pageSize, true, infiniteScroll);
    }
  }

  queryOrderData(page, rows, showLoading?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载订单数据中...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }

    this.orderService.getOrderList(this.queryParam, page, rows).then(data => {
      console.log(data);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let orderObj of this.pager.list) {
          this.orderList.push(orderObj);
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
      this.alertTips('服务器访问超时，请稍后尝试！');
    });

  }

  goToOrderDetail(orderId) {
    this.navCtrl.push('order-detail', {orderId: orderId});
  }

  goToShipBaseInfo(vesselId) {
    this.navCtrl.push('ship-base-info', {vesselId: vesselId});
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
