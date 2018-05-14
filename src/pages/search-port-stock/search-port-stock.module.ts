import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPortStockPage } from './search-port-stock';

@NgModule({
  declarations: [
    SearchPortStockPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPortStockPage),
  ],
})
export class SearchPortStockPageModule {}
