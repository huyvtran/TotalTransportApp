import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogisticsTaskPage } from './logistics-task';

@NgModule({
  declarations: [
    LogisticsTaskPage,
  ],
  imports: [
    IonicPageModule.forChild(LogisticsTaskPage),
  ],
})
export class LogisticsTaskPageModule {}
