import {Component} from '@angular/core';
import {
  App,
  LoadingController,
  AlertController,
  ModalController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

/**
 * 业务委托
 */

@IonicPage({
  name: 'business-commission',
  segment: 'business-commission'
})
@Component({
  selector: 'page-business-commission',
  templateUrl: 'business-commission.html',
})
export class BusinessCommissionPage {

  //委托状态 1待受理 2已受理 3退回 4已发布 5已生成订单 0所有
  private commissionState: any = 2;

  constructor(public navCtrl: NavController,
              public app: App,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessCommissionPage');
  }

  setCommissionState(state) {
    this.commissionState = state;
  }

  goToCreateCommission() {
    let modal = this.modalCtrl.create("create-commission");
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.refresh)) {
        this.refresh();
      }
    });
  }

  refresh() {
    console.log('into refresh');
  }

  goToCommissionDetail() {
    this.navCtrl.push('commission-detail');
  }

}
