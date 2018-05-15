import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {BaseServiceProvider} from "../../providers/base-service/base-service";
import {UserServiceProvider} from "../../providers/user-service/user-service";


/**
 * 注册
 */

@IonicPage({
  name: 'regist',
  segment: 'regist'
})
@Component({
  selector: 'page-regist',
  templateUrl: 'regist.html',
  providers: [BaseServiceProvider, UserServiceProvider]
})
export class RegistPage {

  private resultData: any = {};

  //验证码
  private authCode: any = '';

  //确认密码
  private confirmPwd: any = '';

  /* 存放服务端传过来的手机号和验证码*/
  private userPhoneNum: any;
  private serverAuthCode: any = '';

  private userInfo: any = {
    account: '',
    nickname: '',
    phone: '',
    password: ''
  };

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
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegistPage');
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
      this.alertTips('服务器访问超时，请稍后尝试!');
    });
  }

  checkAccount() {
    if (!Boolean(this.userInfo.account)) {
      this.alertTips('请输入账户！');
      return;
    }

    let trueAccount = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (trueAccount.test(this.userInfo.account)) {
      this.alertTips('账户不能包含中文！');
      return;
    }
    console.log('execute checkAccount method');
    this.userService.checkAccount(this.userInfo.account).then(data => {
      console.log(data);
      this.resultData = data;
      if (Boolean(this.resultData.isExist)) {
        this.alertTips('账户名已存在！');
      } else {
        this.checkPhone('regist');
      }
    }, err => {
      this.alertTips(err);
    }).catch(err => {
      this.alertTips(err);
    });
  }

  /**
   * 验证手机号
   * @param type regist注册的验证 authCode获取验证码的验证
   */
  checkPhone(type) {
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
        if (type == 'regist') {
          this.checkRegist();
        } else if (type == 'authCode') {
          this.getPhoneAuthCode();
        }
      }
    }, err => {
      this.alertTips(err);
    }).catch(err => {
      this.alertTips(err);
    });
  }


  /*注册验证*/
  checkRegist() {
    console.log(this.userInfo);

    if (!Boolean(this.serverAuthCode)) {
      this.alertTips('请获取验证码！');
      return;
    }

    if (!Boolean(this.authCode)) {
      this.alertTips('请输入验证码！');
      return;
    }

    if (this.authCode != this.serverAuthCode) {
      this.alertTips('验证码不正确！');
      return;
    }

    if (!Boolean(this.userInfo.nickname)) {
      this.alertTips('请输入昵称！');
      return;
    }

    if (!Boolean(this.userInfo.password)) {
      this.alertTips('请输入密码！');
      return;
    }

    let truePwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    if (!truePwd.test(this.userInfo.password)) {
      this.alertTips('密码须包含字母和数字，长度6-12位！');
      return;
    }

    if (!Boolean(this.confirmPwd)) {
      this.alertTips('请输入确认密码！');
      return;
    }

    if (this.userInfo.password != this.confirmPwd) {
      this.alertTips('两次密码输入不一致！');
      return;
    }
    this.regist();
  }

  regist() {
    let loader = this.loadingCtrl.create({
      content: "注册中..."
    });
    loader.present();

    this.userService.userRegist(this.userInfo).then(data => {
      console.log(data);
      loader.dismissAll();
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '恭喜你，注册成功!',
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
    //     subTitle: '恭喜你，注册成功!',
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
