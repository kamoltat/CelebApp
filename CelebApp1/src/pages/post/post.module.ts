import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PostPage} from '../post/post';

@NgModule({
  declarations: [
    PostPage,
  ],
  imports: [
    IonicPageModule.forChild(PostPage),
  ],
  exports: [
    PostPage
  ]
})
export class EditUserPicPageModule {}