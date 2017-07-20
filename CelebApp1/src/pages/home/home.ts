import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';

import {LoginPage} from "../login/login";
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UserServiceProvider]
})


export class HomePage {
  database:any;
  public is_celeb = false;
  
  
  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, public zone: NgZone) {
    
}






ionViewDidEnter(){
var user = firebase.auth().currentUser;
if(user){
this.is_celeb = this.userProvider.isCurrentUserCeleb();
}
else{
  this.navCtrl.setRoot(LoginPage);
}
}


// if(user && user.uid && user.email){

// firebase.database().ref('profile/' + user.uid).on('value', snapshot => {
// this.userProfile = snapshot.val();
// });
// }

// else{
//   this.navCtrl.setRoot(LoginPage);
// }
// console.log(this.userProfile);




goToPost(){
  null;
  // this.navCtrl.push(PostPage);
}



}
