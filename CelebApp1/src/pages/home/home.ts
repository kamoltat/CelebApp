import { Component, NgZone, OnInit } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController,ModalController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';
import {PostPage} from '../post/post';
import {LoginPage} from "../login/login";
import firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [UserServiceProvider]
})


export class HomePage implements OnInit {
  public is_celeb:any;
  public list_following = new Array();
  public following_id = new Array();
  public list_posts = new Array();
  public image:any;
  public authorImage:any;
  public postImage:any;


  
  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, private zone: NgZone, public modalCtrl:ModalController) {
  
}
setIsCeleb(e){
  this.is_celeb = e;
}

isCurrentUserCeleb(){    //Check if current is idol or follower
var user = firebase.auth().currentUser;
if(user){
firebase.database().ref().child("idols").on('value', snapshot =>{
  this.setIsCeleb(snapshot.hasChild(user.uid));
  console.log("I'm inside");
})  
}
else{
  this.navCtrl.setRoot(LoginPage);
}

}


getFollowingId(){
  var user = firebase.auth().currentUser;
  firebase.database().ref("following/"+user.uid).once('value').then(snapshot => {
    snapshot.forEach(childSnapshot =>{
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    this.getPost(childKey);
    
    });
  });
}




getPost(e){
// var user = firebase.auth().currentUser;
firebase.database().ref("posts/"+e).orderByKey().once('value').then(snapshot => {
    snapshot.forEach(childSnapshot =>{
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    console.log("hiiiii",childData);
    console.log(childData['post_pic_url']);
    
    firebase.storage().ref().child(childData['authorPicUrl'].toString()).getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    childData['authorPicUrl']= url;
    }).catch(e => {
    console.log(e);
  });
  }).catch(e => {
    console.log(e);
  });
  if(childData['post_pic_url'] != ""){
  firebase.storage().ref().child(childData['post_pic_url'].toString()).getDownloadURL().then((data) => 
  {
    this.zone.run(()=>{
    childData['post_pic_url'] = data;
    }).catch(e => {
    console.log(e);
  });
  }).catch(e => {
    console.log(e);
  });
  }
  this.list_posts.push(childData);
  console.log("child dataL: ",childData);
  console.log("list_posts:", this.list_posts);
    }); 
  }).catch(e => {
    console.log(e);
  });
}

goToPost(){
  let PostModal = this.modalCtrl.create(PostPage);
    PostModal.present();
}

ngOnInit(){

this.isCurrentUserCeleb();
this.getFollowingId();

}


ionViewWillLoad(){


}





}
