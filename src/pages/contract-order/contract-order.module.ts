import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContractOrderPage } from './contract-order';

@NgModule({
  declarations: [
    ContractOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ContractOrderPage),
  ],
})
export class ContractOrderPageModule {}
