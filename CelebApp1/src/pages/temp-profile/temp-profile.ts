import { Component,NgZone,OnInit,Injectable } from '@angular/core';
import { App,ToastController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FirebaseListObservable } from 'angularfire2/database';
import firebase from 'firebase';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database'
import { AngularFireAuth } from 'angularfire2/auth';
import { SearchPage } from '../search/search';
import { SubjectProvider } from '../../providers/subject-service/subject-service';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';




@IonicPage()
@Component({
  selector: 'page-temp-profile',
  templateUrl: 'temp-profile.html',
})
@Injectable()


export class TempProfilePage {
  email:string;
  username:string;
  firstname:string;
  lastname:string;
  about:string;
  profile_pic:any;  
  profile_pic_url:any;  
  is_celeb:any;
  subjUID:any;
  public following= new Array();
  public data:any={};
  
  constructor(public navCtrl: NavController, private _subjectProvider:SubjectProvider,public zone:NgZone,
              public appCtrl: App, private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth,
              private toastCtrl:ToastController) {
  }

  //Adding function to follow button
  followButtonFunc(){
    var user = firebase.auth().currentUser;
    firebase.database().ref("following/").child(user.uid).child(this.subjUID).set(this.data);
  }
  
  //combine data to put into following database
  combineData(){
    this.data.about=this.about;
    this.data.email=this.email;
    this.data.firstname=this.firstname;
    this.data.lastname=this.lastname;
    this.data.profile_pic_url=this.profile_pic_url;
    this.data.username=this.username;
  }

  getFollowing(){
    //get who the user is following and the data in there.
    //then put in array
  }

  setIsCeleb(e){
    this.is_celeb = e;
  }

  isCurrentUserCeleb(){    //Check if current is idol or follower
    if(this.subjUID){
    firebase.database().ref().child("idols").on('value', snapshot =>{
      this.setIsCeleb(snapshot.hasChild(this.subjUID));
      })  
    }
    else{
      this.navCtrl.setRoot(LoginPage);
    }

  }

  loadProfile(){
    var root = 'users/';

    if(this.is_celeb){
      root = 'idols/';
    }
    console.log("temp-profile's subjUID:", this.subjUID)
    firebase.database().ref(root + this.subjUID).on('value', snapshot => {
    this.username = snapshot.val().username;
    this.firstname = snapshot.val().firstname;
    this.lastname = snapshot.val().lastname;
    this.about = snapshot.val().about;
    this.email = snapshot.val().email;
    this.profile_pic_url = snapshot.val().profile_pic_url;  
    firebase.storage().ref().child(this.profile_pic_url).getDownloadURL().then((url) => 
      {
        this.zone.run(()=>{
          this.profile_pic = url;
        })
      });
    });
  }

  ngOnInit(){
    this.subjUID = this.getSubjUID();
    this.isCurrentUserCeleb();
    this.loadProfile();
    this.combineData();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad TempProfilePage');
  }

  getSubjUID():string{
    var temp = this._subjectProvider.getsubjUID();
    console.log("getSubjUID in temp-profile", temp);
    return this._subjectProvider.getsubjUID();
  }

}
