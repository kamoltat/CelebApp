import { Component,OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import firebase from 'firebase';
import {LoginPage} from '../login/login';

/**
 * Generated class for the CommentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})



export class CommentPage implements OnInit {
  public commentText = "";
  public postid:any;
  public postuid:any;
  public username:any;
  public profile_pic_url:any;
  public is_celeb:any;
  public root = "users/";
  public imageRoot = "user_profile/";
  public timeStamp = Date.now();
  public listComment = new Array();
  


  constructor(public navCtrl: NavController, public navParams: NavParams, public alert:AlertController, public zone:NgZone) {
     this.postid = navParams.get('postid');
     this.postuid = navParams.get('postuid');
  }

setIsCeleb(e){
  this.is_celeb = e;
  if(e){
    this.root = 'idols/';
    this.imageRoot = 'idol_profile/';
  }
}

isCurrentUserCeleb(){    //Check if current is idol or follower
var user = firebase.auth().currentUser;
if(user){
firebase.database().ref().child("idols").on('value', snapshot =>{
  this.setIsCeleb(snapshot.hasChild(user.uid));
  console.log("I'm inside");
});
}
else{
  this.navCtrl.setRoot(LoginPage);
}
}

  

postClicked(){
    var user = firebase.auth().currentUser;
    var postRef = firebase.database().ref("posts/"+this.postuid+"/"+this.postid);
    console.log(this.postuid);
    console.log(this.postid);
    postRef.transaction(post =>{
    if(post){
    if(!post.commentCount){
    post.commentCount = 0;
    }
    post.commentCount++;
    if(!post.comments){
    post.comments = {};
    }
    var commentKey = firebase.database().ref("posts/"+this.postuid+"/"+this.postid+"/comments").push().key;
    var commentObject = {
      text:this.commentText, 
      author:this.username,
      authorPicUrl:this.profile_pic_url,
      authorUid:user.uid,
      timeStamp: this.timeStamp
    };
    post.comments[commentKey] = commentObject;
     firebase.storage().ref().child(commentObject['authorPicUrl'].toString()).getDownloadURL().then((url)=> 
  {
    this.zone.run(()=>{
    commentObject['authorPicUrl'] = url;
    
    }).catch(e => {
    console.log(e);
    
  });
  }).catch(e => {
    console.log(e);
  });
    this.listComment.push(commentObject)
    
    }
    return post;
    }); 
    alert("posted!");
  }

getComment(){
var user = firebase.auth().currentUser;
var postRef = firebase.database().ref("posts/"+this.postuid+"/"+this.postid+"/comments");
postRef.once('value').then( snapshot => {
snapshot.forEach(childSnapshot =>{
var childKey = childSnapshot.key;
var childData = childSnapshot.val();
console.log("childData:",childData);
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
  this.listComment.push(childData);
  console.log(this.listComment);
    }); 
  }).catch(e => {
    console.log(e);
  });
}
    
setUserProfile(){
var user = firebase.auth().currentUser;
firebase.database().ref(this.root+user.uid).on("value",snapshot =>{
this.username = snapshot.val().username;
this.profile_pic_url = snapshot.val().profile_pic_url;
});
}

ngOnInit(){
    this.isCurrentUserCeleb();
    this.getComment();
    this.setUserProfile();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

}
