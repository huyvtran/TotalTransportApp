import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractDetailPage } from './contract-detail';

@NgModule({
  declarations: [
    ContractDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractDetailPage),
  ],
})
export class ContractDetailPageModule {}
