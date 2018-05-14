import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 重置密码
 */

@IonicPage({
  name: 'reset-password',
  segment: 'reset-password'
})
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {

  private confirmPwd: any = '';

  private userInfo: any = {
    account: 'admin',
    password: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ResetPasswordPage');
  }

  /*验证*/
  checkSubmit() {

    if (!Boolean(this.userInfo.password)) {
      this.alertTips('请输入密码！');
      return false;
    }

    let truePwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
    if (!truePwd.test(this.userInfo.password)) {
      this.alertTips('密码须包含字母和数字，长度6-12位！');
      return false;
    }

    if (!Boolean(this.confirmPwd)) {
      this.alertTips('请输入确认密码！');
      return false;
    }

    if (this.userInfo.password != this.confirmPwd) {
      this.alertTips('两次密码输入不一致！');
      return false;
    }

    return true;
  }

  submit() {
    if (!this.checkSubmit()) {
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "设置中..."
    });
    loader.present();

    setTimeout(() => {
      loader.dismissAll();
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '恭喜你，密码设置成功,请重新登录！',
        buttons: ['确定']
      });
      alert.present();
      alert.onDidDismiss(() => {
        // this.navCtrl.push('login');
        this.app.getRootNav().setRoot('login');
      });

    }, 1000);

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
