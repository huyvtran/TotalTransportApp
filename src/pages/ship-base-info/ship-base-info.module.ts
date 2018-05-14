import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShipBaseInfoPage } from './ship-base-info';

@NgModule({
  declarations: [
    ShipBaseInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ShipBaseInfoPage),
  ],
})
export class ShipBaseInfoPageModule {}
