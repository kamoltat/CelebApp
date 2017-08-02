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
import{ShareServiceProvider} from '../../providers/share-service/share-service';
import{SubjectProvider} from '../../providers/subject-service/subject-service';
import{TempProfilePage} from '../temp-profile/temp-profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ShareServiceProvider,SubjectProvider]
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
  private afDatabase: AngularFireDatabase, private zone: NgZone,
  public modalCtrl:ModalController, private shareService:ShareServiceProvider, private _subjectProvider:SubjectProvider) {
  this.currentuid = firebase.auth().currentUser;
  this.shareService.setPostsByFollowingId();
 
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

 doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    console.log("listPost:",this.list_posts)
    console.log("listPost:",this.list_posts)
    setTimeout(() => {
      this.shareService.setPostsByFollowingId();
      this.list_posts = this.shareService.getPosts();
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

// listenForCommentChange(){
// var commentCountRef = firebase.database().ref('posts/' + postId + '/commentCount');
// commentCountRef.on('value', function(snapshot) {
//   updateCommentCount(postElement, snapshot.val());
// });
// }

goToPost(){
  let PostModal = this.modalCtrl.create(PostPage,{list_posts:this.list_posts});
  PostModal.present();
 }

 togglelikes(p,e,uid){
   var user = firebase.auth().currentUser;
   var postRef = firebase.database().ref("posts/"+uid+"/"+e); 
    postRef.transaction(post =>{
    var i = this.list_posts.indexOf(p);
    console.log("p", p);
    console.log("this", this.list_posts);
    console.log(this.list_posts[p]);
    if (post) {
      if (post.likes && post.likes[user.uid]) {
        post.likeCount--;
        this.list_posts[i].likeCount--;
        post.likes[user.uid] = null;
        this.list_posts[i].likes[user.uid] =null;
      } else {
        post.likeCount++;
        this.list_posts[i].likeCount++;
        if (!post.likes) {
          post.likes = {};
         this.list_posts[i].likes = {};
        }
        this.list_posts[i].likes[user.uid] = true;
        post.likes[user.uid] = true;
        
      }
    };
    return post;
},function(){},true);
 }


 clickComment(e,uid,post,listPost){
   this.navCtrl.push(CommentPage,{
     postid: e, 
     postuid:uid,
     post:post,
     list_post:listPost });

 }


clickLikeButton(p,e,uid){ //e in this function is the key of each post which we can get by clicking on the button, uid is the poster's uid
  this.togglelikes(p,e,uid);
}

 setSubjUID(inpUID){
   console.log(inpUID);
   this._subjectProvider.setSubjUID(inpUID);
   this.navCtrl.push(TempProfilePage);
}




ngOnInit(){
this.isCurrentUserCeleb();
this.list_posts = this.shareService.getPosts();
console.log("this.list_posts",this.list_posts);
}

ionViewDidEnter(){

}


}