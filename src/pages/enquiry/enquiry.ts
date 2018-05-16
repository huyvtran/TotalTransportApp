import {Component} from '@angular/core';
import {
  App,
  LoadingController,
  ViewController,
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {EnquiryServiceProvider} from "../../providers/enquiry-service/enquiry-service";
import {AppConfig} from "../../app/app.config";

/**
 * 询价
 */

@IonicPage({
  name: 'enquiry',
  segment: 'enquiry'
})
@Component({
  selector: 'page-enquiry',
  templateUrl: 'enquiry.html',
  providers: [StorageServiceProvider, EnquiryServiceProvider]
})
export class EnquiryPage {

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0
  };

  private enquiry = {
    requestUser: null,
    content: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public storageService: StorageServiceProvider,
              public enquiryService: EnquiryServiceProvider,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnquiryPage');
    this.initLoginUser();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.enquiry.requestUser = this.loginUser.id;
    }
  }

  back() {
    this.viewCtrl.dismiss({refresh: false});
  }

  /*验证*/
  checkSubmit() {
    console.log(this.enquiry);
    if (!Boolean(this.enquiry.requestUser)) {
      this.alertTips('未获取到登录信息,请登录！');
      return false;
    }

    if (!Boolean(this.enquiry.content)) {
      this.alertTips('请填写询价内容！');
      return false;
    }

    return true;
  }

  submit() {
    if (!this.checkSubmit()) {
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "提交中..."
    });
    loader.present();

    this.enquiryService.addEnquiry(this.enquiry).then(data => {
      loader.dismissAll();
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '提交成功!',
        buttons: ['确定']
      });
      alert.present();
      alert.onDidDismiss(() => {
        this.viewCtrl.dismiss({refresh: true});
      });
    }, err => {
      loader.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loader.dismissAll();
      this.alertTips(err);
    });

    // setTimeout(() => {
    //   loader.dismissAll();
    //   let alert = this.alertCtrl.create({
    //     title: '提示',
    //     subTitle: '提交成功!',
    //     buttons: ['确定']
    //   });
    //   alert.present();
    //   alert.onDidDismiss(() => {
    //     this.viewCtrl.dismiss({refresh: true});
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
