import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PortStockDetailPage } from './port-stock-detail';

@NgModule({
  declarations: [
    PortStockDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PortStockDetailPage),
  ],
})
export class PortStockDetailPageModule {}
