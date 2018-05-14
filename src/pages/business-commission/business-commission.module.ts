import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BusinessCommissionPage } from './business-commission';

@NgModule({
  declarations: [
    BusinessCommissionPage,
  ],
  imports: [
    IonicPageModule.forChild(BusinessCommissionPage),
  ],
})
export class BusinessCommissionPageModule {}
