import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BiddingReplyListPage } from './bidding-reply-list';

@NgModule({
  declarations: [
    BiddingReplyListPage,
  ],
  imports: [
    IonicPageModule.forChild(BiddingReplyListPage),
  ],
})
export class BiddingReplyListPageModule {}
