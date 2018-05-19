import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogisticsTaskUpdatePage } from './logistics-task-update';

@NgModule({
  declarations: [
    LogisticsTaskUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(LogisticsTaskUpdatePage),
  ],
})
export class LogisticsTaskUpdatePageModule {}
