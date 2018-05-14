import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {CargoServiceProvider} from "../../providers/cargo-service/cargo-service";

/**
 * 货盘
 */

@IonicPage({
  name: 'cargo',
  segment: 'cargo'
})
@Component({
  selector: 'page-cargo',
  templateUrl: 'cargo.html',
  providers: [CargoServiceProvider]
})
export class CargoPage {

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

  private cargoList = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public cargoService: CargoServiceProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CargoPage');
    this.queryCargoData(1, this.pageSize, true);
  }

  doRefresh(refresher) {
    this.cargoList = [];
    this.queryCargoData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryCargoData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryCargoData(page, rows, isFirstLoad?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载货盘数据中...'
    });
    if (Boolean(isFirstLoad)) {
      loading.present();
    }

    this.cargoService.getCargoInfoListByPage(null, page, rows).then(data => {
      console.log(data);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let cargoObj of this.pager.list) {
          this.cargoList.push(cargoObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getCargoInfoListByPage fail');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log('getCargoInfoListByPage error');
      console.log(err);
      if (Boolean(isFirstLoad)) {
        loading.dismissAll();
      }
      this.alertTips('服务器访问超时，请稍后尝试！');
    });

  }

  goToCargoDetail(cargoId) {
    this.navCtrl.push('cargo-detail', {cargoId: cargoId})
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
