import { Component, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController,LoadingController, App,
ViewController  ,ModalController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {ProfilePage} from '../profile/profile';
import {AngularFireDatabase} from 'angularfire2/database';
import {HomePage} from '../home/home';
import {TabsPage} from '../tabs/tabs';
import {EditUserPicPage} from '../edit-user-pic/edit-user-pic';
import { ActionSheetController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

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
  storageRef = firebase.storage().ref();
  image: any;
  file: any;
  about:string;
  public browse = false
  public hide = false;
  
  constructor(public navCtrl: NavController,public zone: NgZone,
  public userProvider: UserServiceProvider, public loadingCtrl: LoadingController,public alertCtrl: AlertController,
  public afAuth: AngularFireAuth,public actionSheetCtrl: ActionSheetController, 
  private toastCtrl: ToastController, public viewCtrl: ViewController, private appCtrl: App, public modalCtrl: ModalController) {
}
cancelEdit(){
  this.navCtrl.setRoot(ProfilePage);
}

selectfile(e){
   this.file = e.target.files[0]
   this.readPhoto(this.file);
}
  presentToast() {
  let toast = this.toastCtrl.create({
    message: 'Profile change successful',
    duration: 3000,
    position: 'top'
  });

  toast.onDidDismiss(() => {
    console.log('Dismissed toast');
  });

  toast.present();
}

startUpload(){
  var user = firebase.auth().currentUser;
  console.log(this.file);
  if(this.file != null){
  this.storageRef.child("image/user_profile/"+user.uid+'/'+"profile_pic").put(this.file).
  then((snapshot) =>{
    this.presentToast();
  firebase.database().ref('users/' + user.uid +'/profile_pic_url').set("image/user_profile/"+user.uid+'/'+"profile_pic").
  then(this.appCtrl.getRootNav().setRoot(TabsPage));
  });
  }
else{
  this.appCtrl.getRootNav().setRoot(TabsPage)
  let loader = this.loadingCtrl.create({
      dismissOnPageChange:true,
    });
    loader.present();
    this.presentToast();
}
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

showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Delete Profile Picture?',
      message: 'Do you want to delete your current profile picture and use the default?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            var user = firebase.auth().currentUser;
            firebase.database().ref('users/' + user.uid +'/profile_pic_url').set("image/default_profile/default_profile_pic.jpg");
            this.storageRef.child("image/user_profile/"+user.uid+'/'+"profile_pic").delete();
            console.log('Yes clicked');
          }
        }
      ]
    });
    confirm.present();
  }



editPhoto(){
  let actionSheet = this.actionSheetCtrl.create({
      title: 'Profile Picture',
      buttons: [
        {
          text: 'Browse',
          handler: () => {
            this.browse = true
            console.log('Browse clicked');
          }
        },{
          text: 'Delete',
          handler: () => {
          actionSheet.onDidDismiss((()=>{
          this.showConfirm();
        }));
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.browse = false;
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

updateProfile(){
  var user = firebase.auth().currentUser;
  firebase.database().ref('users/' + user.uid +'/username').set(this.username);
  console.log("update username");
  firebase.database().ref('users/' + user.uid +'/firstname').set(this.firstname);
  console.log("update firstname");
  firebase.database().ref('users/' + user.uid +'/lastname').set(this.lastname);
  console.log("update lastname");
  firebase.database().ref('users/' + user.uid +'/about').set(this.about);
  console.log("update about");
  this.startUpload()
  console.log("startupload()");
}


ionViewDidEnter(){
var user = firebase.auth().currentUser;
firebase.database().ref('users/' + user.uid).on('value', snapshot => {
this.username = snapshot.val().username;
this.firstname = snapshot.val().firstname;
this.lastname = snapshot.val().lastname;
this.about = snapshot.val().about;
this.profile_pic_url = snapshot.val().profile_pic_url;
firebase.storage().ref().child(this.profile_pic_url).getDownloadURL().then((url) => 
  {
    this.zone.run(()=>{
      this.profile_pic = url;
    })
  });
console.log("profile: ",this.username, this.firstname, this.lastname, this.profile_pic, this.about)
});
}
}
