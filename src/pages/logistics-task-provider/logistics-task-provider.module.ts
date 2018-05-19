import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LogisticsTaskProviderPage } from './logistics-task-provider';

@NgModule({
  declarations: [
    LogisticsTaskProviderPage,
  ],
  imports: [
    IonicPageModule.forChild(LogisticsTaskProviderPage),
  ],
})
export class LogisticsTaskProviderPageModule {}
