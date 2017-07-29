import { Component, NgZone, OnInit } from '@angular/core';
import {IonicPage, NavController, NavParams,ToastController,ModalController } from 'ionic-angular';
import {UserServiceProvider} from '../../providers/user-service/user-service'
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFireDatabase, FirebaseObjectObservable,FirebaseListObservable} from 'angularfire2/database';
import {CreateProfilePage} from '../create-profile/create-profile';
import {PostPage} from '../post/post';
import {LoginPage} from "../login/login";
import {CommentPage} from "../comment/comment";
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
  public currentuid:any
  

  
  constructor(public navCtrl: NavController, 
  public userProvider: UserServiceProvider, 
  public afAuth: AngularFireAuth, private toastCtrl: ToastController, 
  private afDatabase: AngularFireDatabase, private zone: NgZone, public modalCtrl:ModalController) {
  this.currentuid = firebase.auth().currentUser;
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
var counter = -1;
// var user = firebase.auth().currentUser;
firebase.database().ref("posts/"+e).orderByChild("timeStamp").once('value').then(snapshot => {
    snapshot.forEach(childSnapshot =>{
    
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    console.log("childSnapshot");
    console.log(childData['post_pic_url']);
    
    
    
    firebase.storage().ref().child(childData['authorPicUrl'].toString()).getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    childData['authorPicUrl'] = url;
    
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
  counter++
  console.log("counter: ",counter)
  childData.arrayIndex = counter;
  childData.key = childKey;
  childData.uid = e;
  
  this.list_posts.push(childData);
  console.log(this.list_posts);
  // this.list_posts.push(childData);
  // console.log("child dataL: ",childData);
    }); 
  }).catch(e => {
    console.log(e);
  });
}

goToPost(){
  let PostModal = this.modalCtrl.create(PostPage);
    PostModal.present();
 }

 togglelikes(p,e,uid){
   var user = firebase.auth().currentUser;
   var postRef = firebase.database().ref("posts/"+uid+"/"+e); 
    postRef.transaction(post =>{
    console.log("p", p);
    console.log("this", this.list_posts);
    console.log(this.list_posts[p]);
   
    if (post) {
      if (post.likes && post.likes[user.uid]) {
        post.likeCount--;
        this.list_posts[p].likeCount--;
        post.likes[user.uid] = null;
        this.list_posts[p].likes[user.uid] =null;
      } else {
        post.likeCount++;
        this.list_posts[p].likeCount++;
        if (!post.likes) {
          post.likes = {};
          this.list_posts[p].likes = {};
        }
        this.list_posts[p].likes[user.uid] =true;
        post.likes[user.uid] = true;
        
      }
    }
   ;
    return post;
},function(){},true);
 }


 clickComment(e,uid){
   this.navCtrl.push(CommentPage,{
     postid: e, 
     postuid:uid});
 }


clickLikeButton(p,e,uid){ //e in this function is the key of each post which we can get by clicking on the button, uid is the poster's uid
this.togglelikes(p,e,uid);
}


ngOnInit(){
this.isCurrentUserCeleb();
this.getFollowingId();
}

ionViewDidEnter(){

}


}