import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchLogisticsTaskPage } from './search-logistics-task';

@NgModule({
  declarations: [
    SearchLogisticsTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchLogisticsTaskPage),
  ],
})
export class SearchLogisticsTaskPageModule {}
