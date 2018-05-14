import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateCommissionPage } from './create-commission';

@NgModule({
  declarations: [
    CreateCommissionPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateCommissionPage),
  ],
})
export class CreateCommissionPageModule {}
