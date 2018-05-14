import {Component} from '@angular/core';
import {App, LoadingController, AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppConfig} from "../../app/app.config";
import {PhotoViewer} from '@ionic-native/photo-viewer';

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
  providers: [PhotoViewer]
})
export class LogisticsTaskAttachmentPage {

  private attachmentPhotos = [];

  constructor(public navCtrl: NavController,
              public app: App,
              public photoViewer: PhotoViewer,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsTaskAttachmentPage');
    this.attachmentPhotos.push({
      src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
      name: 'test'
    });
    this.attachmentPhotos.push({
      src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
      name: 'test'
    });
    this.attachmentPhotos.push({
      src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
      name: 'test'
    });
    this.attachmentPhotos.push({
      src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
      name: 'test'
    });
    this.attachmentPhotos.push({
      src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
      name: 'test'
    });
    this.attachmentPhotos.push({
      src: 'https://images2015.cnblogs.com/news/24442/201705/24442-20170502163240086-1545306933.jpg',
      name: 'test'
    });
  }

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

}
