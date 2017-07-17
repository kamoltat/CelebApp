import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';
import {PostPage} from "../post/post";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UserServiceProvider]
})


export class HomePage {
  profileData : FirebaseObjectObservable<CreateProfilePage>
  database:any
  celeb1 :any
  
  
  
  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  // public af: AngularFire,
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, public zone: NgZone) {
  
}


status = this.getCelebStatus();



  

getCelebStatus(){
  var user = firebase.auth().currentUser;
  if(user){
  return firebase.database().ref('profile/' + user.uid + '/is_celeb').once('value').then(function(snapshot) {
  var celeb = snapshot.val(); 
  console.log(user.email)
  console.log(celeb)
  console.log("user signed in")
  })
  }
  else {
  console.log("No user signed in")
}
}




ionViewWillLoad(){
  this.afAuth.authState.subscribe(data => {
  if(data && data.email && data.uid){
    
    
  }




  // else{
  //   this.toastCtrl.create({
  //   message: 'Could not find authentication detail',
  //   duration: 3000
  // }).present();
  // }
  })
}


goToPost(){
  this.navCtrl.push(PostPage);
}



}
