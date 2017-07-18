import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController, App } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {ProfilePage} from '../profile/profile';
import {AngularFireDatabase} from 'angularfire2/database';
import {HomePage} from '../home/home';
import {TabsPage} from '../tabs/tabs';

@Component({
  selector: 'page-create-profile',
  templateUrl: 'create-profile.html',
  providers: [UserServiceProvider]
})
export class CreateProfilePage {
  profile = {} as ProfilePage;
  username:string;
  firstname:string;
  lastname:string;
  profile_pic:any;
  profile_pic_url:any;
  
  constructor(public navCtrl: NavController,public zone: NgZone,
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, 
  private toastCtrl: ToastController, private afDatabase: AngularFireDatabase, private appCtrl: App) {
}
cancelEdit(){
  this.navCtrl.setRoot(ProfilePage);
}
updateProfile(){
  var user = firebase.auth().currentUser;
  firebase.database().ref('users/' + user.uid +'/username').set(this.username);
  firebase.database().ref('users/' + user.uid +'/firstname').set(this.firstname);
  firebase.database().ref('users/' + user.uid +'/lastname').set(this.lastname);
  firebase.database().ref('users/' + user.uid +'/profile_pic_url').set(this.profile_pic_url);
  this.navCtrl.setRoot(TabsPage);
}

ionViewDidEnter(){
var user = firebase.auth().currentUser;
firebase.database().ref('users/' + user.uid).on('value', snapshot => {
this.username = snapshot.val().username;
this.firstname = snapshot.val().firstname;
this.lastname = snapshot.val().lastname;
this.profile_pic_url = snapshot.val().profile_pic_url
firebase.storage().ref().child(this.profile_pic_url).getDownloadURL().then((url) => 
  {
    this.zone.run(()=>{
      this.profile_pic = url;
    })
  });
console.log("profile: ",this.username, this.firstname, this.lastname, this.profile_pic)
});
}
}
