import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";
import {ContractServiceProvider} from "../../providers/contract-service/contract-service";

/**
 * 合同订单
 */

@IonicPage({
  name: 'contract-order',
  segment: 'contract-order'
})
@Component({
  selector: 'page-contract-order',
  templateUrl: 'contract-order.html',
  providers: [StorageServiceProvider, ContractServiceProvider]
})
export class ContractOrderPage {

  //合同状态 execute执行中 close已关闭 all所有
  private contractState: any = 'execute';

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

  private resultData: any = {};

  private executePager: any = {
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

  private closePager: any = {
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

  private allPager: any = {
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

  //执行中合同列表
  private executeContractList = [];

  //已关闭合同列表
  private closeContractList = [];

  //所有合同列表
  private allContractList = [];

  private pageSize: number = 10;

  private queryParam: any = {
    //甲方 货主所在的单位
    partyA: '',
    //合同执行状态 1执行中 0 已关闭
    excuteStatus: '',
    //起始生效日期
    startDate: '',
    //截止生效日期
    endDate: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public contractService: ContractServiceProvider,
              public storageService: StorageServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContractOrderPage');
    this.queryParam.startDate = this.navParams.get('startDate');
    this.queryParam.endDate = this.navParams.get('endDate');
    this.initLoginUser();
    this.initContractData();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.queryParam.partyA = this.loginUser.company;
    }
  }

  setContractState(state) {
    this.contractState = state;
  }

  goToContractDetail(contractId) {
    this.navCtrl.push('contract-detail', {contractId: contractId});
  }

  doRefresh(refresher) {
    console.log(this.contractState);

    let pager = {
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

    if (this.contractState == 'execute') {
      this.executePager = pager;
      this.queryParam.excuteStatus = 1;
      this.executeContractList = [];
    } else if (this.contractState == 'close') {
      this.closePager = pager;
      this.queryParam.excuteStatus = 0;
      this.closeContractList = [];
    } else if (this.contractState == 'all') {
      this.allPager = pager;
      this.queryParam.excuteStatus = null;
      this.allContractList = [];
    }
    this.queryContractData(this.queryParam, 1, this.pageSize, false, refresher);
  }

  initContractData() {
    this.initExecuteContractData();
    this.initCloseContractData();
    this.initAllContractData();
  }

  initExecuteContractData() {
    let queryParamObj: any = {
      partyA: this.queryParam.partyA,
      excuteStatus: 1,
      //起始生效日期
      startDate: this.queryParam.startDate,
      //截止生效日期
      endDate: this.queryParam.endDate
    };
    this.executeContractList = [];
    this.queryContractData(queryParamObj, 1, this.pageSize, true);
  }

  initCloseContractData() {
    let queryParamObj: any = {
      partyA: this.queryParam.partyA,
      excuteStatus: 0,
      //起始生效日期
      startDate: this.queryParam.startDate,
      //截止生效日期
      endDate: this.queryParam.endDate
    };
    this.closeContractList = [];
    this.queryContractData(queryParamObj, 1, this.pageSize, false);
  }

  initAllContractData() {
    let queryParamObj: any = {
      partyA: this.queryParam.partyA,
      excuteStatus: null,
      //起始生效日期
      startDate: this.queryParam.startDate,
      //截止生效日期
      endDate: this.queryParam.endDate
    };
    this.allContractList = [];
    this.queryContractData(queryParamObj, 1, this.pageSize, false);
  }

  doInfinite(infiniteScroll?) {
    console.log(this.contractState);
    let pager = {
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

    if (this.contractState == 'execute') {
      this.queryParam.excuteStatus = 1;
      pager = this.executePager;
    } else if (this.contractState == 'close') {
      this.queryParam.excuteStatus = 0;
      pager = this.closePager;
    } else if (this.contractState == 'all') {
      this.queryParam.excuteStatus = null;
      pager = this.allPager;
    }

    if (pager.currPageNo >= pager.totalPageCount) {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    } else {
      this.queryContractData(this.queryParam, pager.currPageNo + 1, this.pageSize, true, infiniteScroll);
    }
  }

  queryContractData(queryParam, page, rows, showLoading?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载合同数据中...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }

    this.contractService.getShipperContractListByPage(queryParam, page, rows).then(data => {
      console.log(data);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.resultData = data;
      let pager = this.resultData.pager;

      if (Boolean(pager.list) && pager.list.length > 0) {
        for (let contractObj of pager.list) {
          if (queryParam.excuteStatus == 1) {
            this.executePager = pager;
            this.executeContractList.push(contractObj);
          } else if (queryParam.excuteStatus == 0) {
            this.closePager = pager;
            this.closeContractList.push(contractObj);
          } else if (queryParam.excuteStatus == null) {
            this.allPager = pager;
            this.allContractList.push(contractObj);
          }
        }
      }
      if (Boolean(infiniteScroll)) {
        console.log('into complete');
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getqueryParamListByPage fail');
      console.log(err);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getqueryParamListByPage error');
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
