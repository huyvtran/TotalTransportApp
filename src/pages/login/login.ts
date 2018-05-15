import {Component} from '@angular/core';
import {App, AlertController, IonicPage, NavController, LoadingController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";
import {UserServiceProvider} from "../../providers/user-service/user-service";

/**
 * 登录
 */

@IonicPage({
  name: 'login',
  segment: 'login'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [StorageServiceProvider, UserServiceProvider]
})
export class LoginPage {

  private userInfo: any = {
    account: '',
    password: ''
  };

  private resultData: any = {};

  private isRemember: Boolean = false;

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public userService: UserServiceProvider,
              public storageService: StorageServiceProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.initSaveUserInfo();
  }

  login() {
    //记住密码
    this.rememberPassword();
    console.log('account:' + this.userInfo.account);
    console.log('password:' + this.userInfo.password);
    if (!Boolean(this.userInfo.account)) {
      this.alertTips('请输入账户！');
      return;
    }

    if (!Boolean(this.userInfo.password)) {
      this.alertTips('请输入密码！');
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "登录中..."
    });
    loader.present();

    // setTimeout(() => {
    //   this.storageService.write(AppConfig.LOGIN_USER_NAME, {
    //     username: 'admin',
    //     password: '123456'
    //   });
    //   loader.dismissAll();
    //   this.app.getRootNav().setRoot('tabs');
    //   // this.navCtrl.push('tabs');
    // }, 1500);

    this.userService.login(this.userInfo.account, this.userInfo.password).then(data => {
      console.log(data);
      loader.dismissAll();
      this.resultData = data;
      this.storageService.write(AppConfig.LOGIN_USER_NAME, this.resultData.sysUser);
      this.app.getRootNav().setRoot('tabs');
    }, err => {
      loader.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loader.dismissAll();
      this.alertTips(err);
    });

  }

  initSaveUserInfo() {
    let saveUserInfo = this.storageService.read(AppConfig.SAVE_USER_INFO);
    if (Boolean(saveUserInfo)) {
      this.userInfo = saveUserInfo;
      if (Boolean(this.userInfo.password)) {
        this.isRemember = true;
      }
    }
  }

  /*验证提醒*/
  alertTips(tips, timeout?) {
    let alert = this.alertCtrl.create({
      title: '提示',
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

  rememberPassword() {
    console.log(this.isRemember);
    //若选择记住密码,记住账户和密码 若未选择,仅记住账户
    if (this.isRemember) {
      this.storageService.write(AppConfig.SAVE_USER_INFO, this.userInfo);
    } else {
      let saveUserInfo: any = {
        account: this.userInfo.account,
        password: ''
      };
      this.storageService.write(AppConfig.SAVE_USER_INFO, saveUserInfo);
    }
  }

  forgetPassword() {
    this.navCtrl.push('forget-password');
  }

  goToRegistPage() {
    this.navCtrl.push('regist');
  }

}
