import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditUserPicPage } from './edit-user-pic';

@NgModule({
  declarations: [
    EditUserPicPage,
  ],
  imports: [
    IonicPageModule.forChild(EditUserPicPage),
  ],
  exports: [
    EditUserPicPage
  ]
})
export class EditUserPicPageModule {}
