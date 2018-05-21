import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";

/**
 * Tab
 */

@IonicPage({
  name: 'tabs',
  segment: 'tabs'
})
@Component({
  templateUrl: 'tabs.html',
  providers: [StorageServiceProvider]
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

  private todoTaskCount: any = 0;

  constructor(public storageService: StorageServiceProvider) {
    this.initLoginUser();
    this.initTodoTaskCount();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
  }

  initTodoTaskCount() {
    this.todoTaskCount = 1;
  }
}
