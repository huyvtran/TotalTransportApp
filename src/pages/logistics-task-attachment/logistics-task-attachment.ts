import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppConfig} from "../../app/app.config";
import {PhotoViewer} from '@ionic-native/photo-viewer';
import {TaskHighwayServiceProvider} from "../../providers/task-highway-service/task-highway-service";
import {TaskRailwayServiceProvider} from "../../providers/task-railway-service/task-railway-service";
import {TaskWaterwayServiceProvider} from "../../providers/task-waterway-service/task-waterway-service";
import {TaskWharfServiceProvider} from "../../providers/task-wharf-service/task-wharf-service";

/**
 * 物流任务附件信息
 */

@IonicPage({
  name: 'logistics-task-attachment',
  segment: 'logistics-task-attachment'
})
@Component({
  selector: 'page-logistics-task-attachment',
  templateUrl: 'logistics-task-attachment.html',
  providers: [PhotoViewer, TaskHighwayServiceProvider, TaskRailwayServiceProvider, TaskWaterwayServiceProvider, TaskWharfServiceProvider]
})
export class LogisticsTaskAttachmentPage {

  private resultData: any = {};

  //物流任务类型 1水路运输 2铁路运输 3公路运输 4码头运输
  private taskType: any = 1;

  private taskId: any;

  private pageSize: number = 12;

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

  private attachmentList = [];

  // private attachmentPhotos = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public taskHignwayService: TaskHighwayServiceProvider,
              public taskRailwayService: TaskRailwayServiceProvider,
              public taskWaterwayService: TaskWaterwayServiceProvider,
              public taskWharfService: TaskWharfServiceProvider,
              public photoViewer: PhotoViewer,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsTaskAttachmentPage');
    this.taskType = this.navParams.get('taskType');
    this.taskId = this.navParams.get('taskId');
    this.queryAttachmentData(1, this.pageSize, true);
  }

  // initAttachmentPhotos() {
  //   this.attachmentPhotos.push({
  //     src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
  //     name: 'test'
  //   });
  //   this.attachmentPhotos.push({
  //     src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
  //     name: 'test'
  //   });
  //   this.attachmentPhotos.push({
  //     src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
  //     name: 'test'
  //   });
  //   this.attachmentPhotos.push({
  //     src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
  //     name: 'test'
  //   });
  //   this.attachmentPhotos.push({
  //     src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
  //     name: 'test'
  //   });
  //   this.attachmentPhotos.push({
  //     src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
  //     name: 'test'
  //   });
  // }

  setAttachmentPhotoStyle() {
    let classImgWidth = (AppConfig.getWindowWidth() - 40) / 3;
    let classImgHeight = classImgWidth / 0.75;
    let style = {
      'width': classImgWidth + 'px',
      'height': classImgHeight + 'px'
    };
    return style;
  }

  setAttachmentPhotoGalleryStyle() {
    let style = {
      'width': AppConfig.getWindowWidth()
    };
    return style;
  }

  showAttachmentPhoto(src) {
    this.photoViewer.show(src, '物流任务附件信息', {share: false});
  }

  doRefresh(refresher) {
    this.attachmentList = [];
    this.queryAttachmentData(1, this.pageSize, false, refresher);
  }

  doInfinite(infiniteScroll) {
    if (this.pager.currPageNo >= this.pager.totalPageCount) {
      infiniteScroll.complete();
    } else {
      this.queryAttachmentData(this.pager.currPageNo + 1, this.pageSize, false, infiniteScroll);
    }
  }

  queryAttachmentData(page, rows, showLoading?, infiniteScroll?) {
    let loading = this.loadingCtrl.create({
      content: '加载附件数据中...'
    });
    if (Boolean(showLoading)) {
      loading.present();
    }

    if (this.taskType == 1) {
      this.taskWaterwayService.getAttachmentFileListByPage(this.taskId, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        this.pager = this.resultData.pager;
        if (Boolean(this.pager.list) && this.pager.list.length > 0) {
          for (let attachmentObj of this.pager.list) {
            this.attachmentList.push(attachmentObj);
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
    } else if (this.taskType == 2) {
      this.taskRailwayService.getAttachmentFileListByPage(this.taskId, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        this.pager = this.resultData.pager;
        if (Boolean(this.pager.list) && this.pager.list.length > 0) {
          for (let attachmentObj of this.pager.list) {
            this.attachmentList.push(attachmentObj);
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
    } else if (this.taskType == 3) {
      this.taskHignwayService.getAttachmentFileListByPage(this.taskId, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        this.pager = this.resultData.pager;
        if (Boolean(this.pager.list) && this.pager.list.length > 0) {
          for (let attachmentObj of this.pager.list) {
            this.attachmentList.push(attachmentObj);
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
    } else if (this.taskType == 4) {
      this.taskWharfService.getAttachmentFileListByPage(this.taskId, page, rows).then(data => {
        console.log(data);
        if (Boolean(showLoading)) {
          loading.dismissAll();
        }
        this.resultData = data;
        this.pager = this.resultData.pager;
        if (Boolean(this.pager.list) && this.pager.list.length > 0) {
          for (let attachmentObj of this.pager.list) {
            this.attachmentList.push(attachmentObj);
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
