import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignupIdolPage } from './signup-idol';

@NgModule({
  declarations: [
    SignupIdolPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupIdolPage),
  ],
  exports: [
    SignupIdolPage
  ]
})
export class SignupIdolPageModule {}
