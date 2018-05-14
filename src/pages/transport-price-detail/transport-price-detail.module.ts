import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransportPriceDetailPage } from './transport-price-detail';

@NgModule({
  declarations: [
    TransportPriceDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(TransportPriceDetailPage),
  ],
})
export class TransportPriceDetailPageModule {}
