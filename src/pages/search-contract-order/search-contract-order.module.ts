import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchContractOrderPage } from './search-contract-order';

@NgModule({
  declarations: [
    SearchContractOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchContractOrderPage),
  ],
})
export class SearchContractOrderPageModule {}
