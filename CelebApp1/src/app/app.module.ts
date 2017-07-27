import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SearchPage } from '../pages/search/search';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RegisterPage } from '../pages/register/register';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { HttpModule } from '@angular/http';

import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireDatabaseModule} from 'angularfire2/database';
import {FIREBASE_CONFIG} from "./app.firebase.config";
import {PostPage} from "../pages/post/post";
import {CreateProfilePage} from "../pages/create-profile/create-profile";
import {CommentPage} from "../pages/comment/comment";
import * as firebase from 'firebase';
import { SignupIdolPage } from '../pages/signup-idol/signup-idol';
import { IdolServiceProvider } from '../providers/idol-service/idol-service';

@NgModule({
  declarations: [
    MyApp,
    SearchPage,
    ProfilePage,
    HomePage,
    TabsPage,
    ResetPasswordPage,
    RegisterPage,
    LoginPage,
    CreateProfilePage,
    SignupIdolPage,
    PostPage,
    CommentPage
 
    

  ],

  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages: true}),
    HttpModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,

    
    

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SearchPage,
    ProfilePage,
    HomePage,
    LoginPage,
    ResetPasswordPage,
    TabsPage,
    RegisterPage,
    CreateProfilePage,
    SignupIdolPage,
    PostPage,
    CommentPage
    

    
   
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserServiceProvider,
    IdolServiceProvider

   
    

  ]
})
export class AppModule {}
