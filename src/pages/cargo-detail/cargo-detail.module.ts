import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CargoDetailPage } from './cargo-detail';

@NgModule({
  declarations: [
    CargoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CargoDetailPage),
  ],
})
export class CargoDetailPageModule {}
