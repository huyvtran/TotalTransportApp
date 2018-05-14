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

/**
 * 发起委托
 */

@IonicPage({
  name: 'create-commission',
  segment: 'create-commission'
})
@Component({
  selector: 'page-create-commission',
  templateUrl: 'create-commission.html',
})
export class CreateCommissionPage {

  private commission: any = {
    cargoType: '1',
    cargoName: '',
    amount: '',
    unit: '1',
    startDate: this.formatDate(new Date()),
    floatDay: '',
    startPlace: '1',
    endPlace: '3',
    linkMan: '',
    linkPhone: '',
    creator: '',
    content: '',
    clientId: '',
    state: ''
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCommissionPage');
  }

  back() {
    this.viewCtrl.dismiss({refresh: false});
  }

  /*验证*/
  checkSubmit() {
    console.log(this.commission);
    if (!Boolean(this.commission.cargoType)) {
      this.alertTips('请选择货类！');
      return false;
    }

    if (!Boolean(this.commission.cargoName)) {
      this.alertTips('请输入货名！');
      return false;
    }

    if (!Boolean(this.commission.amount)) {
      this.alertTips('请输入数量！');
      return false;
    }

    const numReg1 = /^[-\+]?\d+$/;
    const numReg2 = /^[-\+]?\d+(\.\d+)?$/;
    if (!numReg1.test(this.commission.amount) && !numReg2.test(this.commission.amount)) {
      this.alertTips('请输入正确的数量！');
      return false;
    }

    if (!Boolean(this.commission.unit)) {
      this.alertTips('请选择单位！');
      return false;
    }

    if (!Boolean(this.commission.startDate)) {
      this.alertTips('请选择受载日期！');
      return false;
    }

    if (!Boolean(this.commission.floatDay)) {
      this.alertTips('请填写浮动天数！');
      return false;
    }

    const dayReg = /^[1-9]*[1-9][0-9]*$/;
    if (!dayReg.test(this.commission.floatDay)) {
      this.alertTips('请填写正确的浮动天数！');
      return false;
    }

    this.commission.startDate = new Date(this.commission.startDate);

    if (!Boolean(this.commission.startPlace)) {
      this.alertTips('请选择始发地！');
      return false;
    }

    if (!Boolean(this.commission.endPlace)) {
      this.alertTips('请选择目的地！');
      return false;
    }

    if (this.commission.startPlace == this.commission.endPlace) {
      this.alertTips('始发地和目的地不能相同！');
      return false;
    }

    if (!Boolean(this.commission.linkMan)) {
      this.alertTips('请填写联系人！');
      return false;
    }

    if (!Boolean(this.commission.linkPhone)) {
      this.alertTips('请输入联系电话！');
      return false;
    }

    let truePhone = /^(13|15|18|17|14)\d{9}$/i;
    if (!truePhone.test(this.commission.linkPhone)) {
      this.alertTips('联系电话格式不正确！');
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
