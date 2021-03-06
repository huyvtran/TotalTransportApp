import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BaseServiceProvider} from "../../providers/base-service/base-service";
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";
import {UserServiceProvider} from "../../providers/user-service/user-service";


/**
 * 修改手机号
 */

@IonicPage({
  name: 'modify-phone',
  segment: 'modify-phone'
})
@Component({
  selector: 'page-modify-phone',
  templateUrl: 'modify-phone.html',
  providers: [BaseServiceProvider, StorageServiceProvider, UserServiceProvider]
})
export class ModifyPhonePage {

  private resultData: any = {};

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0
  };

  //验证码
  private authCode: any = '';

  /* 存放服务端传过来的手机号和验证码*/
  private userPhoneNum: any;
  private serverAuthCode: any = '';

  // 验证码倒计时
  private verifyCode: any = {
    verifyCodeTips: "获取验证码",
    countdown: 60,
    disable: true
  };

  private userInfo: any = {
    phone: ''
  };

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
    console.log('ionViewDidLoad ModifyPhonePage');
    this.initLoginUser();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
  }

  // 验证码倒计时
  setVerifyCodeTime() {
    if (this.verifyCode.countdown == 1) {
      this.verifyCode.countdown = 60;
      this.verifyCode.verifyCodeTips = "获取验证码";
      this.verifyCode.disable = true;
      return;
    } else {
      this.verifyCode.disable = false;
      this.verifyCode.countdown--;
    }

    this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
    setTimeout(() => {
      // this.verifyCode.verifyCodeTips = "重新获取(" + this.verifyCode.countdown + ")";
      this.setVerifyCodeTime();
    }, 1000);
  }

  /**
   * 验证手机号
   */
  checkPhone() {
    console.log("phone:" + this.userInfo.phone + "authCode:" + this.authCode);
    /*手机号不能为空*/
    if (!Boolean(this.userInfo.phone)) {
      this.alertTips('请输入手机号！');
      return;
    }

    let truePhone = /^(13|15|18|17|14)\d{9}$/i;
    if (!truePhone.test(this.userInfo.phone)) {
      this.alertTips('手机号格式不正确！');
      return;
    }

    console.log('execute checkAccount method');
    this.baseService.checkPhone(this.userInfo.phone).then(data => {
      console.log(data);
      this.resultData = data;
      if (Boolean(this.resultData.isExist)) {
        this.alertTips('手机号已存在！');
      } else {
        this.getPhoneAuthCode();
      }
    }, err => {
      this.alertTips(err);
    }).catch(err => {
      this.alertTips(err);
    });
  }

  /*发送短信，获取验证码*/
  getPhoneAuthCode() {
    let loader = this.loadingCtrl.create({
      content: "发送中..."
    });
    loader.present();

    // setTimeout(() => {
    //   loader.dismissAll();
    //   this.setVerifyCodeTime();
    // }, 1000);

    this.baseService.sendAuthCode(this.userInfo.phone).then(data => {
      //发送验证码成功后开始倒计时
      this.verifyCode.disable = false;
      this.setVerifyCodeTime();

      loader.dismissAll();
      this.resultData = data;
      this.userPhoneNum = this.resultData.phone;
      this.serverAuthCode = this.resultData.authCode;
    }, err => {
      loader.dismissAll();
      console.log(err);
      this.alertTips(err);
    }).catch(err => {
      console.log(err);
      loader.dismissAll();
      this.alertTips('服务器访问超时，请稍后尝试！');
    });
  }

  /*验证*/
  checkSubmit() {

    if (!Boolean(this.loginUser.id)) {
      this.alertTips('未获取到登录用户,请登录！');
      return;
    }

    if (!Boolean(this.serverAuthCode)) {
      this.alertTips('请获取验证码！');
      return;
    }

    if (!Boolean(this.authCode)) {
      this.alertTips('请输入验证码！');
      return false;
    }

    if (this.authCode != this.serverAuthCode) {
      this.alertTips('验证码不正确！');
      return false;
    }

    return true;
  }

  submit() {
    if (!this.checkSubmit()) {
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "修改中..."
    });
    loader.present();

    this.userService.updatePhone(this.loginUser.id, this.userInfo.phone).then(data => {
      console.log(data);
      loader.dismissAll();
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '恭喜你，修改成功，请重新登录！',
        buttons: ['确定']
      });
      alert.present();
      alert.onDidDismiss(() => {
        // this.navCtrl.push('login');
        this.app.getRootNav().setRoot('login');
      });
    }, err => {
      console.log(err);
      loader.dismissAll();
    }).catch(err => {
      console.log(err);
      loader.dismissAll();
    });

    // setTimeout(() => {
    //   loader.dismissAll();
    //   let alert = this.alertCtrl.create({
    //     title: '提示',
    //     subTitle: '恭喜你，修改成功，请重新登录！',
    //     buttons: ['确定']
    //   });
    //   alert.present();
    //   alert.onDidDismiss(() => {
    //     // this.navCtrl.push('login');
    //     this.app.getRootNav().setRoot('login');
    //   });
    //
    // }, 1000);

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
