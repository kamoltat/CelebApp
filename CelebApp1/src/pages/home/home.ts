import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database'
import {CreateProfilePage} from '../create-profile/create-profile'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AngularFireAuth]
})

export class HomePage {
  profileData : FirebaseObjectObservable<CreateProfilePage>
  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, private afDatabase: AngularFireDatabase) {

}

ionViewWillLoad(){
  this.afAuth.authState.subscribe(data => {
  if(data && data.email && data.uid){
  // this.toastCtrl.create({
  //   message: 'Welcome to myApp, '+ String(data.email),
  //   duration: 3000
  // }).present();
  this.profileData = this.afDatabase.object("profile/"+data.uid)
}


  // else{
  //   this.toastCtrl.create({
  //   message: 'Could not find authentication detail',
  //   duration: 3000
  // }).present();
  // }
  })

}

}
