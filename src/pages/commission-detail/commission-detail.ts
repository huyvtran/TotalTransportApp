import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommissionServiceProvider} from "../../providers/commission-service/commission-service";

/**
 * 委托详情
 */

@IonicPage({
  name: 'commission-detail',
  segment: 'commission-detail'
})
@Component({
  selector: 'page-commission-detail',
  templateUrl: 'commission-detail.html',
  providers: [CommissionServiceProvider]
})
export class CommissionDetailPage {

  private resultData: any = {};

  private commission: any = {};

  constructor(public navCtrl: NavController,
              public app: App,
              public commissionService: CommissionServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommissionDetailPage');
    let commissionId = this.navParams.get('commissionId');
    this.initCommissionDetail(commissionId);
  }

  initCommissionDetail(commissionId) {
    let loading = this.loadingCtrl.create({
      content: '加载委托详情数据中...'
    });
    loading.present();
    this.commissionService.getBusinessDelegationById(commissionId).then(data => {
      loading.dismissAll();
      console.log(data);
      this.resultData = data;
      this.commission = this.resultData.businessDelegation;
    }, err => {
      loading.dismissAll();
      this.alertTips(err);
    }).catch(err => {
      loading.dismissAll();
      this.alertTips(err);
    });
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
