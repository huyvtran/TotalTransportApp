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
import {AppConfig} from "../../app/app.config";

/**
 * 选择港口模态框
 */

@IonicPage({
  name: 'select-base-port-model',
  segment: 'select-base-port-model'
})
@Component({
  selector: 'page-select-base-port-model',
  templateUrl: 'select-base-port-model.html',
  providers: [BaseServiceProvider]
})
export class SelectBasePortModelPage {

  private resultData: any = {};

  //page对象
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

  private selectModel: any = {
    portId: ''
  };

  //港口列表信息
  private basePortList = [];

  private pageSize: number = 10;//每页条数

  /*查询参数对象*/
  private queryParam = {
    portName: null
  };

  constructor(public navCtrl: NavController,
              public app: App,
              public baseService: BaseServiceProvider,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectBasePortModelPage');
    this.selectModel.portId = this.navParams.get('portId');
    this.queryBasePortData(1, this.pageSize, true);
  }

  back() {
    this.viewCtrl.dismiss({selected: false});
  }

  save() {
    this.viewCtrl.dismiss({selected: true, portId: this.selectModel.portId, portName: this.getSelectPortName()});
  }

  doRefresh(refresher) {
    this.basePortList = [];
    this.queryBasePortData(1, this.pageSize, false, refresher);
  }

  onInput() {
    this.basePortList = [];
    this.queryBasePortData(1, this.pageSize, false);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryBasePortData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryBasePortData(page, rows, showLoading?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载港口数据中...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }

    this.baseService.getBasePortListByPage(this.queryParam, page, rows).then(data => {
      console.log(data);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.resultData = data;
      this.pager = this.resultData.pager;
      if (Boolean(this.pager.list) && this.pager.list.length > 0) {
        for (let portObj of this.pager.list) {
          this.basePortList.push(portObj);
        }
      }
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
    }, err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log(err);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.alertTips(err);
    }).catch(err => {
      if (Boolean(infiniteScroll)) {
        infiniteScroll.complete();
      }
      console.log(err);
      if (Boolean(showLoading)) {
        loading.dismissAll();
      }
      this.alertTips('服务器访问超时，请稍后尝试！');
    });

  }

  getSelectPortName() {
    if (Boolean(this.selectModel.portId)) {
      if (this.basePortList && this.basePortList.length > 0) {
        for (let port of this.basePortList) {
          if (port.portId == this.selectModel.portId) {
            return port.portName;
          }
        }
      } else {
        return '全部';
      }
    } else {
      return '全部';
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
