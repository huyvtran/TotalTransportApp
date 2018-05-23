import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";
import {TodoTaskServiceProvider} from "../../providers/todo-task-service/todo-task-service";
import {JpushUtilProvider} from "../../providers/jpush-util/jpush-util";

/**
 * Tab
 */

@IonicPage({
  name: 'tabs',
  segment: 'tabs'
})
@Component({
  templateUrl: 'tabs.html',
  providers: [StorageServiceProvider, JpushUtilProvider, TodoTaskServiceProvider]
})
export class TabsPage {

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0
  };

  tab1Root = 'home';
  tab2Root = 'message';
  tab3Root = 'mine';

  private resultData: any = {};

  private todoTaskCount: any = 0;

  constructor(public navCtrl: NavController,
              public app: App,
              public jpushUtil: JpushUtilProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams,
              public todoTaskService: TodoTaskServiceProvider,
              public storageService: StorageServiceProvider) {
    this.initLoginUser();
    this.initTodoTaskCount();
    this.refreshTaskCount();

  }

  refreshTaskCount() {
    setInterval(() => {
      this.initTodoTaskCount();
    }, 5000);
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
  }

  initTodoTaskCount() {
    let loading = this.loadingCtrl.create({
      content: '加载消息中...'
    });
    this.todoTaskService.getTodoTaskListCount(this.loginUser.id).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.todoTaskCount = this.resultData.totalCount;
      this.jpushUtil.setBadge(this.todoTaskCount);
    }, err => {
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loading.dismissAll();
      this.alertTips(err);
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
