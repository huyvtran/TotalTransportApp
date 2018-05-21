import {Component} from '@angular/core';
import {
  App,
  LoadingController,
  AlertController,
  ActionSheetController,
  IonicPage,
  ViewController,
  NavController,
  NavParams
} from 'ionic-angular';
import {StorageServiceProvider} from "../../providers/storage-service/storage-service";
import {AppConfig} from "../../app/app.config";
import {File} from '@ionic-native/file';
import {FileTransfer, FileTransferObject, FileUploadOptions} from '@ionic-native/file-transfer';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {ImagePicker} from '@ionic-native/image-picker';
import {LogisticsTaskServiceProvider} from "../../providers/logistics-task-service/logistics-task-service";
import {PhotoViewer} from '@ionic-native/photo-viewer';

/**
 * 物流任务更新
 */

@IonicPage({
  name: 'logistics-task-update',
  segment: 'logistics-task-update'
})
@Component({
  selector: 'page-logistics-task-update',
  templateUrl: 'logistics-task-update.html',
  providers: [StorageServiceProvider, File, FileTransfer, PhotoViewer, Camera, ImagePicker, LogisticsTaskServiceProvider]
})
export class LogisticsTaskUpdatePage {

  private loginUser: any = {
    id: null,
    userName: '管理员',
    //认证用户类型userType：1：客户端用户 2：货主用户 3：船方用户 4：船货代用户
    userType: 2,
    //是否认证isApproved: 0:未认证 1:已认证
    isApproved: 0,
    //认证单位ID
    company: ''
  };

  private taskTrack = {
    taskId: '',
    logisticsProvider: '',
    //状态 1:已确认 2：在途 3：已收货
    state: '',
    //物流更新信息描述
    taskDesc: '',
    providerName: '',
    linkMan: '',
    linkTel: '',
    creator: ''
  };

  private chooseAttachmentPhoto = [];

  constructor(public navCtrl: NavController,
              public app: App,
              private transfer: FileTransfer,
              private file: File,
              public camera: Camera,
              public photoViewer: PhotoViewer,
              public imagePicker: ImagePicker,
              public viewCtrl: ViewController,
              public storageService: StorageServiceProvider,
              public actionSheetCtrl: ActionSheetController,
              public logisticsTaskService: LogisticsTaskServiceProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogisticsTaskUpdatePage');
    this.taskTrack.taskId = this.navParams.get('taskId');
  }

  initLoginUser() {
    this.loginUser = this.storageService.read(AppConfig.LOGIN_USER_NAME);
    console.log(this.loginUser);
    if (Boolean(this.loginUser)) {
      this.taskTrack.logisticsProvider = this.loginUser.company;
      this.taskTrack.providerName = this.loginUser.companyName;
      this.taskTrack.linkMan = this.loginUser.userName;
      this.taskTrack.linkTel = this.loginUser.mobil;
      this.taskTrack.creator = this.loginUser.id;
    }
  }

  back() {
    this.viewCtrl.dismiss({refresh: false});
  }

  updateTaskTrack() {
    if (!Boolean(this.taskTrack.state)) {
      this.alertTips('请选择物流状态!');
      return;
    }
    if (!Boolean(this.taskTrack.taskDesc)) {
      this.alertTips('请填写物流更新信息!');
      return;
    }

    let loader = this.loadingCtrl.create({
      content: "提交中..."
    });
    loader.present();

    this.logisticsTaskService.saveTaskTrack(this.taskTrack).then(data => {
      console.log(data);
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
      console.log(err);
      this.alertTips(err);
    }).catch(err => {
      loader.dismissAll();
      this.alertTips(err);
    });

  }

  updateLogisticsAttachment() {
    let actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: '从相册选择',
          handler: () => {
            const options = {//options表示选取的图片参数
              maximumImagesCount: 1,//一次性最多只能选5张，ios系统无效，android上面有效
              width: 500,//图片的宽度
              height: 500,//图片的高度
              quality: 99,//图片的质量0-100之间选择
              outputType: 1 // default .FILE_URI返回影像档的，0表示FILE_URI返回影像档的也是默认的，1表示返回base64格式的图片
            };

            this.imagePicker.getPictures(options).then((results) => {
              if (results && results.length > 0) {
                // let alert = this.alertCtrl.create({
                //   title: '提示',
                //   subTitle: '选择的图片URI：' + results[0],
                //   buttons: ['确定']
                // });
                // alert.present();

                // If it's base64:
                let base64Image = 'data:image/jpeg;base64,' + results[0];

                //If it's file URI
                // this.path = imageData;

                this.uploadAttachmentToServer(base64Image);
              } else {
                this.alertTips('请选择一张图片!');
              }
            }, (err) => {
              this.alertTips('打开相册异常：' + err);
            });
          }
        }, {
          text: '拍照',
          handler: () => {
            const options: CameraOptions = {
              quality: 99,////相片质量
              sourceType: this.camera.PictureSourceType.CAMERA,//从哪里选择图片，PHOTOLIBRARY=0(相册选择)，PHOTOLIBRARY=1(相机拍照)，PHOTOLIBRARY=2(相册选择)
              destinationType: this.camera.DestinationType.DATA_URL,//返回类型，DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
              // allowEdit: true,//在选择之前允许修改截图
              encodingType: this.camera.EncodingType.JPEG,//保存的图片格式： JPEG = 0, PNG = 1
              targetWidth: 900,//照片的宽度
              targetHeight: 900,//照片的高度
              mediaType: this.camera.MediaType.PICTURE,//可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
              // saveToPhotoAlbum: true,//保存到相册
              cameraDirection: 0,//摄像头类型Back= 0,Front-facing = 1
              // popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, this.camera.PopoverArrowDirection.ARROW_ANY)
            };

            this.camera.getPicture(options).then((imageData) => {
              // arry.push("data:image/jpeg;base64," + imageData);
              // let alert = this.alertCtrl.create({
              //   title: '提示',
              //   subTitle: '拍照的图片URI：' + imageData,
              //   buttons: ['确定']
              // });
              // alert.present();

              // If it's base64:
              let base64Image = 'data:image/jpeg;base64,' + imageData;
              //If it's file URI
              // this.path = imageData;

              this.uploadAttachmentToServer(base64Image);
            }, (err) => {
              this.alertTips('拍照异常：' + err);
            });
          }
        }, {
          text: '取消',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    actionSheet.present();
  }

  //上传图片附件到服务器
  uploadAttachmentToServer(uri) {
    //定义传输对象
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.png',  // 文件类型
      mimeType: 'image/png',
      headers: {},
      params: {
        taskId: this.taskTrack.taskId,
        userId: this.loginUser.id
      }    // 如果要传参数，写这里
    };

    let uploadUrl = AppConfig.getUrl() + '/app/logisticsTask/saveUpload.do';

    fileTransfer.upload(uri, uploadUrl, options)
      .then((data) => {
        console.log(data);
        if (Boolean(data) && data.responseCode == 200) {
          this.alertTips('上传成功!');
          this.chooseAttachmentPhoto.push(uri);
        } else {
          this.alertTips('服务器未响应,请重试!');
        }
      }, (err) => {
        this.alertTips('上传失败:' + err);
      });

    let loader = this.loadingCtrl.create({
      content: "已上传:0%"
    });
    loader.present();

    // 进度
    fileTransfer.onProgress(progressEvent => {
      if (progressEvent.lengthComputable) {
        // 下载过程会一直打印，完成的时候会显示 1
        var uploadProgress = (progressEvent.loaded / progressEvent.total) * 100;
        console.log('进度:' + uploadProgress + '%');
        loader.setContent("已上传：" + Math.floor(uploadProgress) + "%");
        if (uploadProgress > 99) {
          loader.dismissAll();
        }
      } else {
        console.log('finish');
      }
    });
  }

  setAttachmentPhotoStyle() {
    //每个图片所占屏幕宽度
    let classImgWidth = (AppConfig.getWindowWidth() - 40) / 3;
    let classImgHeight = classImgWidth * 0.75;
    let styles = {
      'width': classImgWidth + 'px',
      'height': classImgHeight + 'px'
    };
    return styles;
  }

  setAttachmentPhotoGalleryStyle() {
    //每个图片所占宽度+左边距10px
    let classImgWidth = (AppConfig.getWindowWidth() - 40) / 3 + 10;
    if (Boolean(this.chooseAttachmentPhoto) && this.chooseAttachmentPhoto.length > 0) {
      let styles = {
        'width': this.chooseAttachmentPhoto.length * classImgWidth + 10 + 'px'
      };
      return styles;
    } else {
      return '';
    }
  }

  showAttachmentPhoto(src) {
    this.photoViewer.show(src, '物流任务附件信息', {share: false});
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
