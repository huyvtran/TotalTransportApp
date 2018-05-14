import {Component} from '@angular/core';
import {
  App,
  LoadingController,
  ModalController,
  AlertController,
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

/**
 * 物流询价
 */

@IonicPage({
  name: 'logistics-enquiry',
  segment: 'logistics-enquiry'
})
@Component({
  selector: 'page-logistics-enquiry',
  templateUrl: 'logistics-enquiry.html',
})
export class LogisticsEnquiryPage {

  private enquiryList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsEnquiryPage');
    this.enquiryList.push({content: '宁波运输1000吨铁矿石到上海钢厂需要多少费用？', createTime: new Date()});
    this.enquiryList.push({content: '海南运输1000吨铁矿石到上海钢厂需要多少费用？', createTime: new Date()});
  }

  refresh() {
    console.log('into refresh');
    this.enquiryList.push({content: '青岛运输1000吨铁矿石到上海钢厂需要多少费用？', createTime: new Date()});
  }

  goToEnquiry() {
    let modal = this.modalCtrl.create("enquiry");
    modal.present();
    modal.onDidDismiss(data => {
      console.log(data);
      if (Boolean(data.refresh)) {
        this.refresh();
      }
    });
  }

  goToLogisticsEnquiryDetail() {
    this.navCtrl.push('logistics-enquiry-detail');
  }

}
