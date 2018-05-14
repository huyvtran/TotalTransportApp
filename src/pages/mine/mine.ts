import {Component} from '@angular/core';
import {App, AlertController, IonicPage, NavController, LoadingController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppVersion} from '@ionic-native/app-version';
import {JpushUtilProvider} from "../../providers/jpush-util/jpush-util";
import {AppConfig} from "../../app/app.config";

/**
 * 我的
 */

@IonicPage({
  name: 'mine',
  segment: 'mine'
})
@Component({
  selector: 'page-mine',
  templateUrl: 'mine.html',
  providers: [AppVersion, StorageServiceProvider, JpushUtilProvider]
})
export class MinePage {
  private appVersionNo: any = '1.0.1';

  constructor(public app: App,
              public alertCtrl: AlertController,
              public appVersion: AppVersion,
              public navCtrl: NavController,
              public storageService: StorageServiceProvider,
              public jPushUtil: JpushUtilProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MinePage');
    this.initVersionNo();
  }

  initVersionNo() {
    this.appVersion.getVersionNumber().then(version => {
      console.log('当前版本:' + version);
      this.appVersionNo = version;
    }, err => {
      console.log(err);
    });
  }

  exit() {

    let confirm = this.alertCtrl.create({
      title: '提示',
      message: '确定退出登录?',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: '确定',
          handler: () => {
            console.log('Agree clicked');
            this.storageService.remove(AppConfig.LOGIN_USER_NAME);

            //清空应用角标
            this.jPushUtil.clearBadge();

            //清空推送ID
            // if (Boolean(this.loginTeacher.teacherId)) {
            //   this.userService.clearJpushRegistrationId(this.loginTeacher.teacherId).then(data => {
            //     console.log(data);
            //   }, err => {
            //     console.log(err);
            //   }).catch(err => {
            //     console.log(err);
            //   });
            // }

            //跳转登录页面后，不能让用户通过物理返回按键返回到之前的页面栈中
            this.app.getRootNav().setRoot('login');
            // this.navCtrl.push('login');
          }
        }
      ]
    });
    confirm.present();

  }

  goToModifyPhone(){
    this.navCtrl.push('modify-phone');
  }

  goToModifyPassword(){
    this.navCtrl.push('modify-password');
  }


}
