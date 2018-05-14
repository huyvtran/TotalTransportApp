import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommissionDetailPage } from './commission-detail';

@NgModule({
  declarations: [
    CommissionDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CommissionDetailPage),
  ],
})
export class CommissionDetailPageModule {}
