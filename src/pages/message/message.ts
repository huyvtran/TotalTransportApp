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
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {TodoTaskServiceProvider} from "../../providers/todo-task-service/todo-task-service";
import {AppConfig} from "../../app/app.config";


/**
 * 我的消息
 */

@IonicPage({
  name: 'message',
  segment: 'message'
})
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
  providers: [StorageServiceProvider, TodoTaskServiceProvider]
})
export class MessagePage {

  private resultData: any = {};

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0,
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

  private todoTaskList = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public todoTaskService: TodoTaskServiceProvider,
              public storageService: StorageServiceProvider) {
  }

  ionViewDidEnter() {
    this.initLoginUser();
    this.initTodoTaskList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
  }

  initTodoTaskList() {
    this.todoTaskList = [];
    this.queryTodoTaskData(1, this.pageSize, true);
  }

  doRefresh(refresher) {
    this.todoTaskList = [];
    this.queryTodoTaskData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryTodoTaskData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryTodoTaskData(page, rows, isFirstLoad?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载代办消息中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }
    this.todoTaskService.getTodoTaskListByPage(this.loginUser.company, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let noticeObj of this.pager.list) {
          this.todoTaskList.push(noticeObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getSystodoTaskListByPage fail');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getSystodoTaskListByPage error');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips('服务器访问超时，请稍后尝试!');
    });

  }

  doTask(task) {
    console.log(task);
    if (task) {
      let taskType = task.taskType;
      //判断任务类型是否货主确认订单
      if (Boolean(taskType) && taskType == AppConfig.CONSIGNOR_ORDER_CONFIRM) {
        // console.log('into method');
        // let updateTask = {
        //   taskId: task.taskId,
        //   //调整为已完成
        //   handleState: '3'
        // };
        let orderId = task.remark;
        this.goToOrderDetail(orderId);
        // this.todoTaskService.updateTodoTask(updateTask).then(data => {
        //   let contractId = task.remark;
        //   //前往订单详情页面
        //   this.navCtrl.push('contract-approve-income', {contractId: contractId});
        // });

      }

      //判断任务类型是否货主确认收货
      if (Boolean(taskType) && taskType == AppConfig.CONSIGNOR_ORDER_RECEIVE) {
        // console.log('into method');
        // let updateTask = {
        //   taskId: task.taskId,
        //   //调整为已完成
        //   handleState: '3'
        // };
        let orderId = task.remark;
        this.goToOrderDetail(orderId);
        // this.todoTaskService.updateTodoTask(updateTask).then(data => {
        //   let contractId = task.remark;
        //   //前往订单详情页面
        //   this.navCtrl.push('contract-approve-income', {contractId: contractId});
        // });

      }

      //判断任务类型是否货主订单评价
      if (Boolean(taskType) && taskType == AppConfig.CONSIGNOR_ORDER_EVALUATE) {
        // console.log('into method');
        // let updateTask = {
        //   taskId: task.taskId,
        //   //调整为已完成
        //   handleState: '3'
        // };
        let orderId = task.remark;
        this.goToOrderDetail(orderId);
        // this.todoTaskService.updateTodoTask(updateTask).then(data => {
        //   let contractId = task.remark;
        //   //前往订单详情页面
        //   this.navCtrl.push('contract-approve-income', {contractId: contractId});
        // });

      }

      //判断任务类型是否服务商物流任务更新
      if (Boolean(taskType) && taskType == AppConfig.CARRIER_LOGISTICS_TASK_UPDATE) {
        // console.log('into method');
        // let updateTask = {
        //   taskId: task.taskId,
        //   //调整为已完成
        //   handleState: '3'
        // };
        let taskId = task.remark;
        this.goToLogisticsTrackUpdate(taskId);
        // this.todoTaskService.updateTodoTask(updateTask).then(data => {
        //   let contractId = task.remark;
        //   //前往订单详情页面
        //   this.navCtrl.push('contract-approve-income', {contractId: contractId});
        // });

      }
    }
  }

  goToLogisticsTrackUpdate(taskId) {
    let modal = this.modalCtrl.create("logistics-task-update", {'taskId': taskId});
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.refresh)) {
      }
    });
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
