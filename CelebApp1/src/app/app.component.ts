import { Component, ViewChild } from '@angular/core';
import { Platform,Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import * as firebase from 'firebase';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav; 
  rootPage:any 

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    // Initialize Firebase
    
  let self = this;
  var config = {
    apiKey: "AIzaSyDZJ3TIR0MS8zlGuJticWGl3FeFuc7_BUk",
    authDomain: "myapp-6212a.firebaseapp.com",
    databaseURL: "https://myapp-6212a.firebaseio.com",
    projectId: "myapp-6212a",
    storageBucket: "myapp-6212a.appspot.com",
    messagingSenderId: "111702413635"
  };
  firebase.initializeApp(config);
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      var user = firebase.auth().currentUser;
      if(user){
            
            self.nav.setRoot(TabsPage);
            self.nav.popToRoot;
           }else{
            self.nav.setRoot(LoginPage);
            self.nav.popToRoot;
          }
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

}
