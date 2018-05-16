import {Component} from '@angular/core';
import {
  App,
  LoadingController,
  AlertController,
  ModalController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {CommissionServiceProvider} from "../../providers/commission-service/commission-service";
import {AppConfig} from "../../app/app.config";

/**
 * 业务委托
 */

@IonicPage({
  name: 'business-commission',
  segment: 'business-commission'
})
@Component({
  selector: 'page-business-commission',
  templateUrl: 'business-commission.html',
  providers: [StorageServiceProvider, CommissionServiceProvider]
})
export class BusinessCommissionPage {

  //委托状态 1待受理 2已受理 3退回 4已发布 5已生成订单 0所有
  private commissionState: any = 2;

  private resultData: any = {};

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

  private acceptPager: any = {
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

  private backPager: any = {
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

  private releasePager: any = {
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

  private pageSize: number = 10;

  //已受理委托列表
  private acceptCommissionList = [];

  //退回委托列表
  private backCommissionList = [];

  //已发布委托列表
  private releaseCommissionList = [];

  //所有委托列表
  private allCommissionList = [];

  private businessDelegation: any = {
    creator: null,
    //委托状态 1待受理 2已受理 3退回 4已发布 5已生成订单 0所有
    state: 0
  };

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
              public commissionService: CommissionServiceProvider,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessCommissionPage');
    this.initLoginUser();
    this.initCommissionData();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.businessDelegation.creator = this.loginUser.id;
    }
  }

  setCommissionState(state) {
    this.commissionState = state;
  }

  goToCreateCommission() {
    let modal = this.modalCtrl.create("create-commission");
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.refresh)) {
        this.initCommissionData();
      }
    });
  }

  goToCommissionDetail(commissionId) {
    this.navCtrl.push('commission-detail', {commissionId: commissionId});
  }

  doRefresh(refresher) {
    console.log(this.commissionState);

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

    if (this.commissionState == 0) {
      this.allPager = pager;
      this.businessDelegation.state = null;
      this.allCommissionList = [];
    } else if (this.commissionState == 2) {
      this.acceptPager = pager;
      this.businessDelegation.state = 2;
      this.acceptCommissionList = [];
    } else if (this.commissionState == 3) {
      this.backPager = pager;
      this.businessDelegation.state = 3;
      this.backCommissionList = [];
    } else if (this.commissionState == 4) {
      this.releasePager = pager;
      this.businessDelegation.state = 4;
      this.releaseCommissionList = [];
    }
    this.queryCommissionData(this.businessDelegation, 1, this.pageSize, false, refresher);
  }

  initCommissionData() {
    this.initAllCommissionData();
    this.initAcceptCommissionData();
    this.initBackCommissionData();
    this.initReleaseCommissionData();
  }

  initAllCommissionData() {
    let businessDelegationObj: any = {
      creator: this.businessDelegation.creator,
      state: null
    };
    this.allCommissionList = [];
    this.queryCommissionData(businessDelegationObj, 1, this.pageSize, true);
  }

  initAcceptCommissionData() {
    let businessDelegationObj: any = {
      creator: this.businessDelegation.creator,
      state: 2
    };
    this.acceptCommissionList = [];
    this.queryCommissionData(businessDelegationObj, 1, this.pageSize, false);
  }

  initBackCommissionData() {
    let businessDelegationObj: any = {
      creator: this.businessDelegation.creator,
      state: 3
    };
    this.backCommissionList = [];
    this.queryCommissionData(businessDelegationObj, 1, this.pageSize, false);
  }

  initReleaseCommissionData() {
    let businessDelegationObj: any = {
      creator: this.businessDelegation.creator,
      state: 4
    };
    this.releaseCommissionList = [];
    this.queryCommissionData(businessDelegationObj, 1, this.pageSize, false);
  }

  doInfinite(infiniteScroll) {
    console.log(this.commissionState);
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
    if (this.commissionState == 'all') {
      this.businessDelegation.state = null;
      pager = this.allPager;
    } else if (this.commissionState == 'accept') {
      this.businessDelegation.state = 2;
      pager = this.acceptPager;
    } else if (this.commissionState == 'back') {
      this.businessDelegation.state = 3;
      pager = this.backPager;
    } else if (this.commissionState == 'release') {
      this.businessDelegation.state = 4;
      pager = this.releasePager;
    }

    if (pager.currPageNo >= pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryCommissionData(this.businessDelegation, pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryCommissionData(businessDelegation, page, rows, isFirstLoad?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载委托数据中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }

    this.commissionService.getBusinessDelegationListByPage(businessDelegation, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      let pager = this.resultData.pager;

      if (Boolean(pager.list) && pager.list.length > 0) {
        for (let commissionObj of pager.list) {
          if (businessDelegation.state == null) {
            this.allPager = pager;
            this.allCommissionList.push(commissionObj);
          } else if (businessDelegation.state == 2) {
            this.acceptPager = pager;
            this.acceptCommissionList.push(commissionObj);
          } else if (businessDelegation.state == 3) {
            this.backPager = pager;
            this.backCommissionList.push(commissionObj);
          } else if (businessDelegation.state == 4) {
            this.releasePager = pager;
            this.releaseCommissionList.push(commissionObj);
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
      console.log('getBusinessDelegationListByPage fail');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getBusinessDelegationListByPage error');
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
