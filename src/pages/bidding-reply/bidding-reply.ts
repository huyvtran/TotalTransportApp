import {Component} from '@angular/core';
import {
  App,
  ViewController,
  LoadingController,
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';
import {BiddingServiceProvider} from "../../providers/bidding-service/bidding-service";
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";


/**
 * 竞价回复
 */

@IonicPage({
  name: 'bidding-reply',
  segment: 'bidding-reply'
})
@Component({
  selector: 'page-bidding-reply',
  templateUrl: 'bidding-reply.html',
  providers: [StorageServiceProvider, BiddingServiceProvider]
})
export class BiddingReplyPage {

  private loginUser: any = {};

  private orderEnquiryReply: any = {
    enquiryId: '',//关联的询价单
    toolMemo: '',//运输工具
    quote: '',//报价
    validityPeriod: this.formatDate(new Date()),//有效期
    memo: '',//备注
    replySource: '',
    logisticsProvider: '',
    providerName: '',
    creator: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public viewCtrl: ViewController,
              public biddingService: BiddingServiceProvider,
              public storageService: StorageServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BiddingReplyPage');
    this.orderEnquiryReply.enquiryId = this.navParams.get('enquiryId');
    this.initLoginUser();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.orderEnquiryReply.replySource = this.loginUser.id;
      this.orderEnquiryReply.logisticsProvider = this.loginUser.company;
      this.orderEnquiryReply.providerName = this.loginUser.companyName;
      this.orderEnquiryReply.creator = this.loginUser.id;
    }
  }

  back() {
    this.viewCtrl.dismiss({refresh: false});
  }

  /*验证*/
  checkSubmit() {

    if (!Boolean(this.orderEnquiryReply.replySource)) {
      this.alertTips('请登录!');
      return false;
    }

    if (!Boolean(this.orderEnquiryReply.logisticsProvider)) {
      this.alertTips('请认证单位!');
      return false;
    }

    if (!Boolean(this.orderEnquiryReply.providerName)) {
      this.alertTips('请认证单位!');
      return false;
    }

    if (!Boolean(this.orderEnquiryReply.creator)) {
      this.alertTips('请登录!');
      return false;
    }

    if (!Boolean(this.orderEnquiryReply.toolMemo)) {
      this.alertTips('请输入运输工具!');
      return false;
    }

    if (!Boolean(this.orderEnquiryReply.quote)) {
      this.alertTips('请输入报价!');
      return false;
    }

    const numReg1 = /^[-\+]?\d+$/;
    const numReg2 = /^[-\+]?\d+(\.\d+)?$/;
    if (!numReg1.test(this.orderEnquiryReply.quote) && !numReg2.test(this.orderEnquiryReply.quote)) {
      this.alertTips('请输入正确的报价!');
      return false;
    }

    if (!Boolean(this.orderEnquiryReply.validityPeriod)) {
      this.alertTips('请选择有效期!');
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

    this.biddingService.addBiddingReply(this.orderEnquiryReply).then(data => {
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
    //     subTitle: '恭喜你，提交成功!',
    //     buttons: ['确定']
    //   });
    //   alert.present();
    //   alert.onDidDismiss(() => {
    //     this.viewCtrl.dismiss({refresh: true});
    //   });
    //
    // }, 1000);

  }


  formatDate(date) {
    if (date) {
      let year = date.getFullYear().toString();
      let month = (date.getMonth() + 1).toString();
      if (Number(date.getMonth() + 1) < 10) {
        month = '0' + (date.getMonth() + 1).toString();
      }
      let day = date.getDate().toString();
      if (Number(date.getDate()) < 10) {
        day = '0' + date.getDate().toString();
      }
      return year + '-' + month + '-' + day;
    } else {
      return '';
    }
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
