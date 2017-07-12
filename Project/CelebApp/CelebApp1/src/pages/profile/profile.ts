import { Component } from '@angular/core';
import {App, NavController, ToastController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service';
import{LoginPage} from '../login/login';
import{CreateProfilePage} from '../create-profile/create-profile';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database'
import {AngularFireAuth} from 'angularfire2/auth';
@Component({
  selector: 'page-contact',
  templateUrl: 'profile.html',
  providers:[UserServiceProvider]
})
export class ProfilePage {
  profileData : FirebaseObjectObservable<CreateProfilePage>
  constructor(public navCtrl: NavController, public userService:UserServiceProvider,
 public appCtrl: App, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, private toastCtrl:ToastController) {

  }

  logUserOut(){
    this.userService.logoutUser().then(() => {
    this.appCtrl.getRootNav().setRoot(LoginPage);
    //call user service
  }); 
}
  goToCreateProfile(){
    this.appCtrl.getRootNav().setRoot(CreateProfilePage);
  }
  ionViewWillLoad(){
  this.afAuth.authState.subscribe(data => {
  if(data && data.email && data.uid){
  this.profileData = this.afDatabase.object("profile/"+data.uid)
}
  })

}
}
