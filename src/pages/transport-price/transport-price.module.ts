import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransportPricePage } from './transport-price';

@NgModule({
  declarations: [
    TransportPricePage,
  ],
  imports: [
    IonicPageModule.forChild(TransportPricePage),
  ],
})
export class TransportPricePageModule {}
