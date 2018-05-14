import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {ShipServiceProvider} from "../../providers/ship-service/ship-service";

/**
 * 船盘信息
 */

@IonicPage({
  name: 'ship',
  segment: 'ship'
})
@Component({
  selector: 'page-ship',
  templateUrl: 'ship.html',
  providers: [ShipServiceProvider]
})
export class ShipPage {

  private resultData: any = {};

  private pageSize: number = 10;

  private pager = {
    // 总页数
    totalPageCount: 0,
    // 页面大小，即每页显示记录数
    pageSize: 10,
    // 记录总数
    totalCount: 0,
    // 当前页号
    currPageNo: 1,
    // 每页数据
    list: []
  };

  private shipList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public shipService: ShipServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShipPage');
    this.queryShipData(1, this.pageSize, true);
  }

  doRefresh(refresher) {
    this.shipList = [];
    this.queryShipData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryShipData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryShipData(page, rows, isFirstLoad?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载船盘数据中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }
    this.shipService.getShipInfoListByPage(null, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let shipObj of this.pager.list) {
          this.shipList.push(shipObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getShipInfoListByPage fail');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getShipInfoListByPage error');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips('服务器访问超时，请稍后尝试！');
    });

  }

  goToShipDetail() {
    console.log('into ship detail');
    // this.navCtrl.push('ship-detail');
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
