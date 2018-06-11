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
import {BaseServiceProvider} from "../../providers/base-service/base-service";
import {CommissionServiceProvider} from "../../providers/commission-service/commission-service";
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";

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
  providers: [BaseServiceProvider, CommissionServiceProvider, StorageServiceProvider]
})
export class CreateCommissionPage {

  private commission: any = {
    cargoType: '',
    cargoName: '',
    amount: '',
    unit: '',
    startDate: this.formatDate(new Date()),
    floatDay: '',
    startPlace: '',
    endPlace: '',
    linkMan: '',
    linkPhone: '',
    creator: '',
    content: '',
    clientId: '',
    state: ''
  };

  private loginUser: any = {};

  private resultData: any = {};

  private baseCargoTypeList = [];

  private basePlaceList = [];

  private baseItemUnitList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public storageService: StorageServiceProvider,
              public baseService: BaseServiceProvider,
              public commissionService: CommissionServiceProvider,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateCommissionPage');
    this.initLoginUser();
    this.initBaseCargoTypeList();
    this.initBaseItemUnitList();
    this.initBasePlaceList();
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.commission.creator = this.loginUser.id;
      this.commission.linkMan = this.loginUser.userName;
      this.commission.linkPhone = this.loginUser.mobil;
      this.commission.clientId = this.loginUser.company;
    }
  }


  initBasePlaceList() {
    this.baseService.getBasePlaceList().then(data => {
      console.log(data);
      this.resultData = data;
      this.basePlaceList = this.resultData.basePlaceList;
    }, err => {
      console.log(err);
    });
  }

  initBaseItemUnitList() {
    this.baseService.getBaseItemListByUnit().then(data => {
      console.log(data);
      this.resultData = data;
      this.baseItemUnitList = this.resultData.baseItemList;
      if (this.baseItemUnitList && this.baseItemUnitList.length > 0) {
        for (let item of this.baseItemUnitList) {
          if (item && item.itemName == '吨') {
            this.commission.unit = item.itemNo;
          }
        }
      }
    }, err => {
      console.log(err);
    });
  }

  initBaseCargoTypeList() {
    this.baseService.getBaseCargoTypeList().then(data => {
      console.log(data);
      this.resultData = data;
      this.baseCargoTypeList = this.resultData.baseCargoTypeList;
    }, err => {
      console.log(err);
    });
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

    this.commissionService.addBusinessDelegation(this.commission).then(data => {
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
