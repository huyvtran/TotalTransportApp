import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {UserServiceProvider} from "../../providers/user-service/user-service";
import {BaseServiceProvider} from "../../providers/base-service/base-service";
import {AppConfig} from "../../app/app.config";

/**
 * 个人信息
 */

@IonicPage({
  name: 'person-info',
  segment: 'person-info'
})
@Component({
  selector: 'page-person-info',
  templateUrl: 'person-info.html',
  providers: [StorageServiceProvider, UserServiceProvider, BaseServiceProvider]
})
export class PersonInfoPage {

  private resultData: any = {};

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0
  };

  private sysDeptList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public storageService: StorageServiceProvider,
              public userService: UserServiceProvider,
              public baseService: BaseServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PersonInfoPage');
    this.initLoginUser();
    this.initSysDeptList();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
  }

  initSysDeptList() {
    this.baseService.getSysDeptList().then(data => {
      console.log(data);
      this.resultData = data;
      this.sysDeptList = this.resultData.sysDeptList;
    }, err => {
      console.log(err);
    });
  }

  checkSubmit() {
    if (!Boolean(this.loginUser.id)) {
      this.alertTips('登录用户不能为空!');
      return;
    }

    if (!Boolean(this.loginUser.userName)) {
      this.alertTips('请输入用户昵称!');
      return;
    }

    if (!Boolean(this.loginUser.sex)) {
      this.alertTips('请选择性别!');
      return;
    }

    if (!Boolean(this.loginUser.deptId)) {
      this.alertTips('请选择部门!');
      return;
    }
    this.submit();
  }

  submit() {
    let loading = this.loadingCtrl.create({
      content: '保存中...'
    });
    loading.present();

    this.userService.saveUser(this.loginUser).then(data => {
      loading.dismissAll();
      this.resultData = data;
      this.loginUser = this.resultData.user;
      this.storageService.write(AppConfig.LOGIN_USER_NAME, this.loginUser);

      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '恭喜你，保存成功！',
        buttons: ['确定']
      });
      alert.present();
      alert.onDidDismiss(() => {
        this.navCtrl.pop();
      });
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
