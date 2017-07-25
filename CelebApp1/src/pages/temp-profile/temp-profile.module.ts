import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TempProfilePage } from './temp-profile';

@NgModule({
  declarations: [
    TempProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(TempProfilePage),
  ],
  exports: [
    TempProfilePage
  ]
})
export class TempProfilePageModule {}
