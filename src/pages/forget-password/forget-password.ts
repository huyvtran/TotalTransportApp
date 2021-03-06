import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BaseServiceProvider} from "../../providers/base-service/base-service";
import {UserServiceProvider} from "../../providers/user-service/user-service";

/**
 * 忘记密码
 */

@IonicPage({
  name: 'forget-password',
  segment: 'forget-password'
})
@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
  providers: [BaseServiceProvider, UserServiceProvider]
})
export class ForgetPasswordPage {

  private resultData: any = {};

  //手机号码
  private phone: any = '';

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

  constructor(public navCtrl: NavController,
              public app: App,
              public baseService: BaseServiceProvider,
              public userService: UserServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
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

  checkPhone() {
    console.log("phone:" + this.phone + "authCode:" + this.authCode);
    /*手机号不能为空*/
    if (!Boolean(this.phone)) {
      this.alertTips('请输入手机号！');
      return;
    }

    let truePhone = /^(13|15|18|17|14)\d{9}$/i;
    if (!truePhone.test(this.phone)) {
      this.alertTips('手机号格式不正确！');
      return;
    }
    console.log('execute checkPhone method');
    this.baseService.checkPhone(this.phone).then(data => {
      console.log(data);
      this.resultData = data;
      if (Boolean(this.resultData.isExist)) {
        this.getPhoneAuthCode();
      } else {
        this.alertTips('手机号不存在！');
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

    this.baseService.sendAuthCode(this.phone).then(data => {
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
      this.alertTips('服务器访问超时，请稍后尝试!');
    });
  }

  /*验证*/
  checkSubmit() {

    if (!Boolean(this.phone)) {
      this.alertTips('请输入手机号！');
      return false;
    }

    let truePhone = /^(13|15|18|17|14)\d{9}$/i;
    if (!truePhone.test(this.phone)) {
      this.alertTips('手机号格式不正确！');
      return false;
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
      content: "验证中..."
    });
    loader.present();

    this.userService.getUserByMobile(this.phone).then(data => {
      console.log(data);
      loader.dismissAll();
      this.resultData = data;
      let user = this.resultData.user;
      if (user && user.id) {
        this.navCtrl.push('reset-password', {userId: user.id});
      } else {
        this.alertTips('未找到手机号关联的用户！');
      }
    }, err => {
      console.log(err);
      loader.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loader.dismissAll();
      this.alertTips(err);
    });

    // setTimeout(() => {
    //   loader.dismissAll();
    //   this.navCtrl.push('reset-password');
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
