import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Tab
 */

@IonicPage({
  name: 'tabs',
  segment: 'tabs'
})
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'home';
  tab2Root = 'message';
  tab3Root = 'mine';

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

}
