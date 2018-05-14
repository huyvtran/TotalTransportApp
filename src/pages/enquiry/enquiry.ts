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
})
export class EnquiryPage {

  private enquiry = {
    requestUser: '',
    content: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnquiryPage');
  }

  back() {
    this.viewCtrl.dismiss({refresh: false});
  }

  /*验证*/
  checkSubmit() {
    console.log(this.enquiry);
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

    setTimeout(() => {
      loader.dismissAll();
      let alert = this.alertCtrl.create({
        title: '提示',
        subTitle: '恭喜你，提交成功!',
        buttons: ['确定']
      });
      alert.present();
      alert.onDidDismiss(() => {
        this.viewCtrl.dismiss({refresh: true});
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
