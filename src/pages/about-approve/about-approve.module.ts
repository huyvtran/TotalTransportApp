import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutApprovePage } from './about-approve';

@NgModule({
  declarations: [
    AboutApprovePage,
  ],
  imports: [
    IonicPageModule.forChild(AboutApprovePage),
  ],
})
export class AboutApprovePageModule {}
