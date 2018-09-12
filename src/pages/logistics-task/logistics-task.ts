import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";
import {TaskHighwayServiceProvider} from "../../providers/task-highway-service/task-highway-service";
import {TaskRailwayServiceProvider} from "../../providers/task-railway-service/task-railway-service";
import {TaskWaterwayServiceProvider} from "../../providers/task-waterway-service/task-waterway-service";
import {TaskWharfServiceProvider} from "../../providers/task-wharf-service/task-wharf-service";

/**
 * 物流任务
 */

@IonicPage({
  name: 'logistics-task',
  segment: 'logistics-task'
})
@Component({
  selector: 'page-logistics-task',
  templateUrl: 'logistics-task.html',
  providers: [StorageServiceProvider, TaskHighwayServiceProvider, TaskRailwayServiceProvider, TaskWaterwayServiceProvider, TaskWharfServiceProvider]
})
export class LogisticsTaskPage {

  //物流任务状态 1未执行 2在途 3已完成 0所有
  private taskState: any = 2;

  private queryParam: any = {
    //运输方式 1水路运输 2铁路运输 3公路运输 4码头运输
    transportType: 1,
    shipName: '',
    //任务状态 1未执行 2在途 3已完成 0所有
    state: 0,
    //货主单位ID
    consignor: ''
  };

  private noExecutePager: any = {
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

  private noExecuteTaskList = [];

  private noExecuteShipCount: number = 0;

  private noExecuteLoadedTonSum: number = 0;

  private onPassagePager: any = {
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

  private onPassageTaskList = [];

  private onPassageShipCount: number = 0;

  private onPassageLoadedTonSum: number = 0;

  private completedPager: any = {
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

  private completedTaskList = [];

  private completedShipCount: number = 0;

  private completedLoadedTonSum: number = 0;

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

  private pageSize: number = 10;

  private allTaskList = [];

  private allShipCount: number = 0;

  private allLoadedTonSum: number = 0;

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

  constructor(public navCtrl: NavController,
              public app: App,
              public storageService: StorageServiceProvider,
              public taskHignwayService: TaskHighwayServiceProvider,
              public taskRailwayService: TaskRailwayServiceProvider,
              public taskWaterwayService: TaskWaterwayServiceProvider,
              public taskWharfService: TaskWharfServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsTaskPage');
    let queryParam = this.navParams.get('queryParam');
    if (Boolean(queryParam)) {
      this.queryParam.transportType = queryParam.transportType;
      this.queryParam.shipName = queryParam.shipName;
    }
    this.initLoginUser();
    this.initTaskData();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.queryParam.consignor = this.loginUser.company;
    }
  }

  setTaskState(state) {
    this.taskState = state;
  }

  goToLogisticsTaskTrack(taskId) {
    this.navCtrl.push('logistics-task-track', {taskId: taskId, taskType: this.queryParam.transportType});
  }

  goToLogisticsTaskAttachment(taskId) {
    this.navCtrl.push('logistics-task-attachment', {taskId: taskId, taskType: this.queryParam.transportType});
  }

  doRefresh(refresher) {
    console.log(this.taskState);

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

    if (this.taskState == 1) {
      this.noExecutePager = pager;
      this.queryParam.state = 1;
      this.noExecuteTaskList = [];
      this.noExecuteShipCount = 0;
      this.noExecuteLoadedTonSum = 0;
    } else if (this.taskState == 2) {
      this.onPassagePager = pager;
      this.queryParam.state = 2;
      this.onPassageTaskList = [];
      this.onPassageShipCount = 0;
      this.onPassageLoadedTonSum = 0;
    } else if (this.taskState == 3) {
      this.completedPager = pager;
      this.queryParam.state = 3;
      this.completedTaskList = [];
      this.completedShipCount = 0;
      this.completedLoadedTonSum = 0;
    } else if (this.taskState == 0) {
      this.allPager = pager;
      this.queryParam.state = 0;
      this.allTaskList = [];
      this.allShipCount = 0;
      this.allLoadedTonSum = 0;
    }
    this.queryTaskData(this.queryParam, 1, this.pageSize, false, refresher);
  }

  initTaskData() {
    this.initNoExecuteTaskData();
    this.initOnPassageTaskData();
    this.initCompletedTaskData();
    this.initAllTaskData();
  }

  initNoExecuteTaskData() {
    let queryParamObj: any = {
      //运输方式 1水路运输 2铁路运输 3公路运输 4码头运输
      transportType: this.queryParam.transportType,
      shipName: this.queryParam.shipName,
      //任务状态 1未执行 2在途 3已完成 0所有
      state: 1,
      consignor: this.queryParam.consignor
    };
    this.noExecuteTaskList = [];
    this.queryTaskData(queryParamObj, 1, this.pageSize, true);
  }

  initOnPassageTaskData() {
    let queryParamObj: any = {
      //运输方式 1水路运输 2铁路运输 3公路运输 4码头运输
      transportType: this.queryParam.transportType,
      shipName: this.queryParam.shipName,
      //任务状态 1未执行 2在途 3已完成 0所有
      state: 2,
      consignor: this.queryParam.consignor
    };
    this.onPassageTaskList = [];
    this.queryTaskData(queryParamObj, 1, this.pageSize, false);
  }

  initCompletedTaskData() {
    let queryParamObj: any = {
      //运输方式 1水路运输 2铁路运输 3公路运输 4码头运输
      transportType: this.queryParam.transportType,
      shipName: this.queryParam.shipName,
      //任务状态 1未执行 2在途 3已完成 0所有
      state: 3,
      consignor: this.queryParam.consignor
    };
    this.completedTaskList = [];
    this.queryTaskData(queryParamObj, 1, this.pageSize, false);
  }

  initAllTaskData() {
    let queryParamObj: any = {
      //运输方式 1水路运输 2铁路运输 3公路运输 4码头运输
      transportType: this.queryParam.transportType,
      shipName: this.queryParam.shipName,
      //任务状态 1未执行 2在途 3已完成 0所有
      state: 0,
      consignor: this.queryParam.consignor
    };
    this.allTaskList = [];
    this.queryTaskData(queryParamObj, 1, this.pageSize, false);
  }

  doInfinite(infiniteScroll?) {
    console.log(this.taskState);
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

    if (this.taskState == 1) {
      this.queryParam.state = 1;
      pager = this.noExecutePager;
    } else if (this.taskState == 2) {
      this.queryParam.state = 2;
      pager = this.onPassagePager;
    } else if (this.taskState == 3) {
      this.queryParam.state = 3;
      pager = this.completedPager;
    } else if (this.taskState == 0) {
      this.queryParam.state = 0;
      pager = this.allPager;
    }

    if (pager.currPageNo >= pager.totalPageCount) {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    } else {
      this.queryTaskData(this.queryParam, pager.currPageNo + 1, this.pageSize, true, infiniteScroll);
    }
  }

  queryTaskData(queryParam, page, rows, showLoading?, infiniteScroll?) {
    if (!Boolean(this.queryParam.consignor)) {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      return;
    }
    let loading = this.loadingCtrl.create({
      content: '加载物流任务数据中...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }

    if (this.queryParam.transportType == 1) {
      this.taskWaterwayService.getTaskListByPage(queryParam, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        let pager = this.resultData.pager;
        if (queryParam.state == 1) {
          this.noExecuteShipCount = this.resultData.shipCount;
          this.noExecuteLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 2) {
          this.onPassageShipCount = this.resultData.shipCount;
          this.onPassageLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 3) {
          this.completedShipCount = this.resultData.shipCount;
          this.completedLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 0) {
          this.allShipCount = this.resultData.shipCount;
          this.allLoadedTonSum = this.resultData.loadedTonSum;
        }

        if (Boolean(pager.list) && pager.list.length > 0) {
          for (let taskObj of pager.list) {
            if (queryParam.state == 1) {
              this.noExecutePager = pager;
              this.noExecuteTaskList.push(taskObj);
            } else if (queryParam.state == 2) {
              this.onPassagePager = pager;
              this.onPassageTaskList.push(taskObj);
            } else if (queryParam.state == 3) {
              this.completedPager = pager;
              this.completedTaskList.push(taskObj);
            } else if (queryParam.state == 0) {
              this.allPager = pager;
              this.allTaskList.push(taskObj);
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
    } else if (this.queryParam.transportType == 2) {
      this.taskRailwayService.getTaskListByPage(queryParam, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        let pager = this.resultData.pager;
        if (queryParam.state == 1) {
          this.noExecuteShipCount = this.resultData.shipCount;
          this.noExecuteLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 2) {
          this.onPassageShipCount = this.resultData.shipCount;
          this.onPassageLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 3) {
          this.completedShipCount = this.resultData.shipCount;
          this.completedLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 0) {
          this.allShipCount = this.resultData.shipCount;
          this.allLoadedTonSum = this.resultData.loadedTonSum;
        }

        if (Boolean(pager.list) && pager.list.length > 0) {
          for (let taskObj of pager.list) {
            if (queryParam.state == 1) {
              this.noExecutePager = pager;
              this.noExecuteTaskList.push(taskObj);
            } else if (queryParam.state == 2) {
              this.onPassagePager = pager;
              this.onPassageTaskList.push(taskObj);
            } else if (queryParam.state == 3) {
              this.completedPager = pager;
              this.completedTaskList.push(taskObj);
            } else if (queryParam.state == 0) {
              this.allPager = pager;
              this.allTaskList.push(taskObj);
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
    } else if (this.queryParam.transportType == 3) {
      this.taskHignwayService.getTaskListByPage(queryParam, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        let pager = this.resultData.pager;
        if (queryParam.state == 1) {
          this.noExecuteShipCount = this.resultData.shipCount;
          this.noExecuteLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 2) {
          this.onPassageShipCount = this.resultData.shipCount;
          this.onPassageLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 3) {
          this.completedShipCount = this.resultData.shipCount;
          this.completedLoadedTonSum = this.resultData.loadedTonSum;
        } else if (queryParam.state == 0) {
          this.allShipCount = this.resultData.shipCount;
          this.allLoadedTonSum = this.resultData.loadedTonSum;
        }

        if (Boolean(pager.list) && pager.list.length > 0) {
          for (let taskObj of pager.list) {
            if (queryParam.state == 1) {
              this.noExecutePager = pager;
              this.noExecuteTaskList.push(taskObj);
            } else if (queryParam.state == 2) {
              this.onPassagePager = pager;
              this.onPassageTaskList.push(taskObj);
            } else if (queryParam.state == 3) {
              this.completedPager = pager;
              this.completedTaskList.push(taskObj);
            } else if (queryParam.state == 0) {
              this.allPager = pager;
              this.allTaskList.push(taskObj);
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
    } else if (this.queryParam.transportType == 4) {
      this.taskWharfService.getTaskListByPage(queryParam, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        let pager = this.resultData.pager;

        if (Boolean(pager.list) && pager.list.length > 0) {
          for (let taskObj of pager.list) {
            if (queryParam.state == 1) {
              this.noExecutePager = pager;
              this.noExecuteTaskList.push(taskObj);
            } else if (queryParam.state == 2) {
              this.onPassagePager = pager;
              this.onPassageTaskList.push(taskObj);
            } else if (queryParam.state == 3) {
              this.completedPager = pager;
              this.completedTaskList.push(taskObj);
            } else if (queryParam.state == 0) {
              this.allPager = pager;
              this.allTaskList.push(taskObj);
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

  }

  goToContractDetail(contractId) {
    this.navCtrl.push('contract-detail', {contractId: contractId});
  }

  goToOrderDetail(orderId) {
    this.navCtrl.push('order-detail', {orderId: orderId});
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
