import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyPhonePage } from './modify-phone';

@NgModule({
  declarations: [
    ModifyPhonePage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyPhonePage),
  ],
})
export class ModifyPhonePageModule {}
