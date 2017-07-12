import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import * as firebase from 'firebase';
import {CreateProfilePage} from '../pages/create-profile/create-profile';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDZJ3TIR0MS8zlGuJticWGl3FeFuc7_BUk",
    authDomain: "myapp-6212a.firebaseapp.com",
    databaseURL: "https://myapp-6212a.firebaseio.com",
    projectId: "myapp-6212a",
    storageBucket: "myapp-6212a.appspot.com",
    messagingSenderId: "111702413635"
  };
  firebase.initializeApp(config);
  //check logged in status
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.rootPage = TabsPage;
      }else {
       this.rootPage = LoginPage;
      
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
