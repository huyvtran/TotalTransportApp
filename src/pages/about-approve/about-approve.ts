import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 关于认证
 */

@IonicPage({
  name: 'about-approve',
  segment: 'about-approve'
})
@Component({
  selector: 'page-about-approve',
  templateUrl: 'about-approve.html',
})
export class AboutApprovePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutApprovePage');
  }

}
