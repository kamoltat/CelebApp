import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AngularFireAuth]
})


export class HomePage {
  profileData : FirebaseObjectObservable<CreateProfilePage>
  storageRef = firebase.storage().ref();
  


  image: any;
  file: any;

  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  // public af: AngularFire,
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, public zone: NgZone) {
    this.storageRef.child("image/default_profile_pic.jpg").getDownloadURL().then((url) => 
  {
    this.zone.run(()=>{
      // this.image = url;
    })
  });
  

}

selectfile(e){
   this.file = e.target.files[0]
   this.readPhoto(this.file);
}
startUpload(){
  this.storageRef.child("image/"+this.file.name).put(this.file).
  then((snapshot) =>{
    alert("upload " + this.file.name+" success!");
  });
}
readPhoto(file){
  let reader = new FileReader();
  reader.onload = (e) =>{
    this.zone.run(() => {
    let path:any = e.target;
    this.image = path.result;
    });
    
  }
  reader.readAsDataURL(file);
}

PostPhoto(){
  this.storageRef.child("image/"+this.file.name).getDownloadURL().then((url) => {
  this.zone.run(() => {
  this.image = url;
  })
  })

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
