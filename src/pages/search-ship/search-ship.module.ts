import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchShipPage } from './search-ship';

@NgModule({
  declarations: [
    SearchShipPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchShipPage),
  ],
})
export class SearchShipPageModule {}
