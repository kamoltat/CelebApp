import { Component,NgZone } from '@angular/core';
import {App, NavController, ToastController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service';
import{LoginPage} from '../login/login';
import{CreateProfilePage} from '../create-profile/create-profile';
import {AngularFireDatabase, FirebaseObjectObservable} from 'angularfire2/database'
import {AngularFireAuth} from 'angularfire2/auth';
import firebase from 'firebase';
@Component({
  selector: 'page-contact',
  templateUrl: 'profile.html',
  providers:[UserServiceProvider]
})

export class ProfilePage {
  
 username:string;
 firstname:string;
 lastname:string;
 profile_pic:any;  
 profile_pic_url:any;  


 constructor(public navCtrl: NavController, public userService:UserServiceProvider,public zone:NgZone,
 public appCtrl: App, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, private toastCtrl:ToastController) {

  }

  logUserOut(){
    this.userService.logoutUser().then(() => {
    this.appCtrl.getRootNav().setRoot(LoginPage);
    //call user service
  }); 
}
  goToCreateProfile(){
    //when click on edit button, this trigers
    this.navCtrl.push(CreateProfilePage);
  }
  ionViewWillLoad(){
//load user's data
var user = firebase.auth().currentUser;
if(user&&user.email&&user.uid){
firebase.database().ref('users/' + user.uid).on('value', snapshot => {
this.username = snapshot.val().username;
this.firstname = snapshot.val().firstname;
this.lastname = snapshot.val().lastname;
this.profile_pic_url = snapshot.val().profile_pic_url;  
firebase.storage().ref().child(this.profile_pic_url).getDownloadURL().then((url) => 
  {
    this.zone.run(()=>{
      this.profile_pic = url;
    })
  });
});
}

else{
  this.navCtrl.setRoot(LoginPage);
  console.log("no user signed in")
}
  }

}

