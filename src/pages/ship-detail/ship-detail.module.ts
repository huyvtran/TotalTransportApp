import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShipDetailPage } from './ship-detail';

@NgModule({
  declarations: [
    ShipDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ShipDetailPage),
  ],
})
export class ShipDetailPageModule {}
