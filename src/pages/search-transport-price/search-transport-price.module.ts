import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchTransportPricePage } from './search-transport-price';

@NgModule({
  declarations: [
    SearchTransportPricePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchTransportPricePage),
  ],
})
export class SearchTransportPricePageModule {}
