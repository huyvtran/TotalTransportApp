import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchCargoPage } from './search-cargo';

@NgModule({
  declarations: [
    SearchCargoPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchCargoPage),
  ],
})
export class SearchCargoPageModule {}
