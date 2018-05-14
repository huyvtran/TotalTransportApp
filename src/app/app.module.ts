import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HttpModule} from "@angular/http";
import {IonJPushModule} from 'ionic2-jpush';
import {Keyboard} from '@ionic-native/keyboard';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    HttpModule,
    IonJPushModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true', //ionic3隐藏全部子页面tabs
      mode: 'ios', //把所有平台设置为iOS风格
      backButtonText: '', //返回按钮文本
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      // swipeBackEnabled: false,//禁用ios滑动返回
      tabsPlacement: 'bottom', //Tab位置
      pageTransition: 'ios-transition' //使用ios页面动画
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    Keyboard,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {
}
