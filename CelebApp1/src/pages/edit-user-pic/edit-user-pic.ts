import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController, ViewController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';
/**
 * Generated class for the PostPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-edit-user-pic',
  templateUrl: 'edit-user-pic.html',
})

export class EditUserPicPage {
  storageRef = firebase.storage().ref();
  image: any;
  file: any;


  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, public zone: NgZone, public ViewCtrl: ViewController) {
  
}
  closeEditPicPage(){
    this.ViewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditUserPicPage');
  }

  selectfile(e){
   this.file = e.target.files[0]
   this.readPhoto(this.file);
}

startUpload(){
  this.storageRef.child("image/user_profile/"+this.file.name).put(this.file).
  then((snapshot) =>{
    alert("upload " + this.file.name+" success!");
    var user = firebase.auth().currentUser;
  firebase.database().ref('users/' + user.uid +'/profile_pic_url').set("image/user_profile/"+this.file.name);
  
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
  this.storageRef.child("image/user_profile/"+this.file.name).getDownloadURL().then((url) => {
  this.zone.run(() => {
  this.image = url;
  })
  })

}

}

