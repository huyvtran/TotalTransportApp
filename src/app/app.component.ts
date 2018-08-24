import {Component} from '@angular/core';
import {Platform, AlertController} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from "@ionic-native/keyboard";
import {AppVersion} from '@ionic-native/app-version';
import {AppConfig} from "../app/app.config";
import {InAppBrowser} from '@ionic-native/in-app-browser';
import {BaseServiceProvider} from "../providers/base-service/base-service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'login';
  private resultData: any = {};

  constructor(public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public keyboard: Keyboard,
              public platform: Platform,
              public alertCtrl: AlertController,
              public appVersion: AppVersion,
              public inAppBrowser: InAppBrowser,
              public baseService: BaseServiceProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //使用下一个，上一个和完成按钮隐藏键盘附件栏
      keyboard.hideKeyboardAccessoryBar(false);
      //当输入焦点时，防止本机UIScrollView移动
      keyboard.disableScroll(false);
      statusBar.styleDefault();
      splashScreen.hide();
      //检测版本更新
      this.checkVersionUpdate();
    });
  }

  checkVersionUpdate() {
    this.appVersion.getVersionNumber().then(version => {
      console.log('当前版本:' + version);
      let appVersionNo = version;
      this.baseService.getLastestVersion().then(data => {
        this.resultData = data;
        let serverVersionNo = this.resultData.appVersionHistory.versionNo;
        if (appVersionNo < serverVersionNo) {
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
    }, err => {
      console.log(err);
    });
  }

  confirmUpdateVersion() {
    let confirm = this.alertCtrl.create({
      title: '提示',
      message: '有新的版本,是否更新?',
      enableBackdropDismiss: false,
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
