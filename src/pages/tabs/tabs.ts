import {Component} from '@angular/core';

import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * 我的
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

  constructor() {

  }
}
