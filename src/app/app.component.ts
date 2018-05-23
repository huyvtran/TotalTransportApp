import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Keyboard} from "@ionic-native/keyboard";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = 'login';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, keyboard: Keyboard) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //使用下一个，上一个和完成按钮隐藏键盘附件栏
      keyboard.hideKeyboardAccessoryBar(false);
      //当输入焦点时，防止本机UIScrollView移动
      keyboard.disableScroll(false);
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
