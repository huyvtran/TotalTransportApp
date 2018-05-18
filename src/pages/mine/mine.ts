import {Component} from '@angular/core';
import {App, Platform, AlertController, IonicPage, NavController, LoadingController, NavParams} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppVersion} from '@ionic-native/app-version';
import {JpushUtilProvider} from "../../providers/jpush-util/jpush-util";
import {AppConfig} from "../../app/app.config";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {BaseServiceProvider} from "../../providers/base-service/base-service";

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
  providers: [AppVersion, StorageServiceProvider, JpushUtilProvider, InAppBrowser, BaseServiceProvider]
})
export class MinePage {
  private appVersionNo: any = '1.0.1';

  private resultData: any = {};

  constructor(public app: App,
              public platform: Platform,
              public alertCtrl: AlertController,
              public appVersion: AppVersion,
              public navCtrl: NavController,
              public inAppBrowser: InAppBrowser,
              public baseService: BaseServiceProvider,
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

  goToPersonInfo() {
    this.navCtrl.push('person-info');
  }

  goToModifyPhone() {
    this.navCtrl.push('modify-phone');
  }

  goToModifyPassword() {
    this.navCtrl.push('modify-password');
  }

  goToAboutApprove() {
    this.navCtrl.push('about-approve');
  }

  checkVersionUpdate() {
    this.baseService.getLastestVersion().then(data => {
      this.resultData = data;
      let serverVersionNo = this.resultData.appVersionHistory.versionNo;
      if (this.appVersionNo >= serverVersionNo) {
        // this.noticeService.presentToastNew('当前版本是最新的', 2000, 'middle');
        let alert = this.alertCtrl.create({
          title: '提示',
          subTitle: '已是最新版！',
          buttons: ['确定']
        });
        alert.present();
      } else {
        this.confirmUpdateVersion();
      }
    }, err => {
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: err,
        buttons: ['确定']
      });
      alert.present();
    });
  }

  confirmUpdateVersion() {
    let confirm = this.alertCtrl.create({
      title: '提示',
      message: '有新的版本,是否更新?',
      buttons: [
        {
          text: '确认',
          handler: () => {
            console.log('Agree clicked');
            //根据不同平台跳往不同的页面下载更新
            if (this.platform.is("android")) {
              const browser = this.inAppBrowser.create(AppConfig.getAndroidUpdateUrl(), '_system');
              browser.show();
            } else if (this.platform.is("ios")) {
              const browser = this.inAppBrowser.create(AppConfig.getIosUpdateUrl(), '_system');
              browser.show();
            }
          }
        },
        {
          text: '取消',
          handler: () => {
            console.log('Disagree clicked');
          }
        }
      ]
    });
    confirm.present();
  }


}
